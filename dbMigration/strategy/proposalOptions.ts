import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';
import { Op } from 'sequelize';

export class ProposalOptionsStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         let financerFailTimes = 0;

         let proposalDataMigrated = false;
         while (!proposalDataMigrated) {
            await this.migrateProposalTypes();
            await this.proposalSystemTypesLookup();
            await this.proposalSavingOptionTypesLookup();
            await this.proposalRequirementsLookup();
            await this.proposalProductsConfig();

            // get lookup data
            const { states, financiers, products, proposalTypes, savingOptionDisplayTypes, systemTypes } =
               await this.getLookupData();

            let result;

            result = await this.migrateTableData(
               'proposal_product_loan_options',
               'id',
               async (currRow: any) => {
                  // this will go to financiersOnProducts table
                  const financier = financiers.find((financier: any) => financier.oldId === currRow.financier_id);
                  if (!financier) {
                     console.log('cannot find financier by id', currRow.financier_id);
                     return false;
                  }

                  const solarProd = products.find((prod: any) => prod.name === 'Solar');
                  const eEProd = products.find((prod: any) => prod.name === 'Energy Efficiency');
                  const hvacProd = products.find((prod: any) => prod.name === 'HVAC');
                  const batteryProd = products.find((prod: any) => prod.name === 'Battery');
                  let prods = [];

                  if (currRow?.solar === 1) prods.push(solarProd);
                  if (currRow.energy_efficiency === 1) prods.push(eEProd);
                  if (currRow.hvac === 1) prods.push(hvacProd);
                  if (currRow.battery === 1) prods.push(batteryProd);

                  if (!!prods.length) {
                     for (const prod of prods) {
                        await this.targetDb.financiersOnProducts.create({
                           oldId: currRow.id,
                           financierId: financier?.id,
                           productId: prod?.id,
                        });
                     }
                     return true;
                  }
               },
               false
            );
            if (result) Logger.info(`Migrated proposal_product_loan_options table table`);

            result = await this.migrateTableData(
               'proposal_general_settings',
               'id',
               async (currRow: any) => {
                  const generalSettingsRowAlreadyExists = await this.targetDb.proposalSettings.findOne({});
                  if (!generalSettingsRowAlreadyExists) {
                     // this will go to proposalSettings table
                     return await this.targetDb.proposalSettings.create({
                        oldId: currRow.id,
                        universalDealerFee: currRow?.universal_dealer_fee,
                     });
                  }
               },
               false
            );
            if (result) Logger.info(`Migrated proposal_general_settings table`);

            result = await this.migrateTableData(
               'proposals_tax_settings',
               'id',
               async (currRow: any) => {
                  // this will go to proposalTaxSettings table
                  const state = states.find((state: any) => currRow.state.trim() === state.abbreviation);
                  const proposalSetting = await this.targetDb.proposalSettings.findOne({});
                  return await this.targetDb.proposalTaxSettings.create({
                     oldId: currRow.id,
                     stateId: state?.id || null,
                     zipCode: currRow.zip_code,
                     taxRegionName: currRow.tax_region_name,
                     combinedRate: currRow.combined_rate,
                     stateTaxRate: currRow.state_tax_rate,
                     county: currRow.county,
                     city: currRow.city,
                     special: currRow.special,
                     riskLevel: currRow.risk_level,
                     proposalSettingId: proposalSetting?.id,
                  });
               },
               false
            );
            if (result) Logger.info(`Migrated proposal_tax_settings table`);

            const migrateLatestProposalPriceSettingRow = async () => {
               const { allPriceSettings } = await this.getCurrDbDataForProposalPriceSettings();
               const currRow = allPriceSettings[0];
               // if no current row, that means they are all migrated
               if (!currRow) return true;
               const alreadyInDb = await this.targetDb.proposalProductsConfig.findOne({
                  where: { oldId: currRow?.id },
               });
               // another check... just in case to make sure there is no duplicate migrations
               if (alreadyInDb) {
                  console.log('ALREADY IN DB');
                  console.log('SETTING PROPOSAL_PRICE_SETTINGS MIGRATED TO 1');
                  const priceSettingsIds = [...allPriceSettings].map((priceSetting: any) => priceSetting.id);
                  await this.setMigratedStatus('proposals_price_settings', 'id', priceSettingsIds, false);
                  return true;
               }

               const solarProd = products.find((prod: any) => prod.name === 'Solar');
               const eEProd = products.find((prod: any) => prod.name === 'Energy Efficiency');

               // create solar product config row
               const solarProposalProdConfig = await this.targetDb.proposalProductsConfig.create({
                  productId: solarProd?.id,
                  oldId: currRow?.id,
               });

               // create solar enery efficiency config row
               await this.targetDb.proposalProductsConfig.create({
                  pricePerSquareFt: currRow.ee_price_per_square_foot,
                  productId: eEProd?.id,
                  oldId: currRow?.id,
               });

               // array of arrays of strings [ ['', ''], ['', ''] ]
               const priceBrackets = JSON.parse(currRow?.solar_pricing)[0];

               // remove the first array in the price brackets array because those are the columns
               priceBrackets.shift();
               for (const row of priceBrackets) {
                  const state = await this.targetDb.statesLookup.findOne({ where: { name: row[0].trim() } });
                  const systemType = systemTypes.find((sT: any) => sT.name === row[1].trim());
                  const travelFee = row[2];
                  const priceBrackets = row.slice(3);

                  const priceBracketsToWrite = [];
                  for (let i = 0; i < priceBrackets?.length; i++) {
                     let kw, ppw;
                     if (i % 2 === 0) kw = priceBrackets[i - 1];
                     else ppw = priceBrackets[i];
                     priceBracketsToWrite.push([kw, ppw]);
                  }

                  for (const pb of priceBracketsToWrite) {
                     const kw = pb[0] === '' ? null : pb[0];
                     const ppw = pb[1] === '' ? null : pb[1];

                     await this.targetDb.proposalBrackets.create({
                        stateId: state?.id,
                        travelFee: travelFee,
                        systemTypeId: systemType?.id,
                        kw: kw,
                        ppw: ppw,
                        proposalProductConfigId: solarProposalProdConfig?.id,
                     });
                  }
               }

               // set migration status
               console.log('DONE MIGRATING PROPOSAL_PRICE_SETTINGS');
               console.log('SETTING PROPOSAL_PRICE_SETTINGS MIGRATED TO 1');
               const priceSettingsIds = [...allPriceSettings].map((priceSetting: any) => priceSetting.id);
               await this.setMigratedStatus('proposals_price_settings', 'id', priceSettingsIds, false);
               return true;
            };
            result = await migrateLatestProposalPriceSettingRow();
            if (result) Logger.info(`Migrated migrateProposalPriceSettings table`);

            result = await this.migrateTableData('proposals_battery_options', 'id', async (currRow: any) => {
               const batteryProd = products.find((prod: any) => prod.name === 'Battery');
               console.log('currRow:', currRow);
               return await this.targetDb.proposalProductsConfig.create({
                  oldId: currRow?.id,
                  name: currRow.name,
                  price: currRow.cost,
                  productId: batteryProd?.id,
               });
            });
            if (result) Logger.info(`Migrated proposal battery options table`);

            result = await this.migrateTableData('proposals_hvac_options', 'id', async (currRow: any) => {
               const hvacProd = products.find((prod: any) => prod.name === 'HVAC');
               return await this.targetDb.proposalProductsConfig.create({
                  oldId: currRow.id,
                  name: currRow.display_name,
                  price: currRow.price,
                  productId: hvacProd?.id,
               });
            });
            if (result) Logger.info(`Migrated proposal hvac options table`);

            // const migrateProposalPriceSettings = async () => {
            //    const alreadyInDb = await this.targetDb.proposalProductsConfig.findOne({});
            //    console.log('alreadyInDb:', alreadyInDb);
            //    if (alreadyInDb) return true;

            //    const { allPriceSettings, allBatteryOptions, allHvacOptions } =
            //       await this.getCurrDbDataForProposalPriceSettings();

            //    const allBatteryOptionIds = [...allBatteryOptions].map((bO: any) => bO.id);
            //    const allHvacOptionIds = [...allHvacOptions].map((hO: any) => hO.id);
            //    const priceSettingsIds = [...allPriceSettings].map((priceSetting: any) => priceSetting.id);

            //    console.log('allBatteryOptionIds:', allBatteryOptionIds);
            //    console.log('allHvacOptionIds:', allHvacOptionIds);
            //    console.log('priceSettingsIds:', priceSettingsIds);

            //    const solarProd = products.find((prod: any) => prod.name === 'Solar');
            //    const eEProd = products.find((prod: any) => prod.name === 'Energy Efficiency');
            //    const batteryProd = products.find((prod: any) => prod.name === 'Battery');
            //    const hvacProd = products.find((prod: any) => prod.name === 'HVAC');

            //    // create all battery proposalProductsConfig rows
            //    for (const batteryOption of allBatteryOptions) {
            //       await this.targetDb.proposalProductsConfig.create({
            //          oldId: batteryOption.id,
            //          name: batteryOption.name,
            //          price: batteryOption.cost,
            //          productId: batteryProd?.id,
            //       });
            //    }

            //    // create all hvac proposalProductsConfig rows
            //    for (const hvacOption of allHvacOptions) {
            //       await this.targetDb.proposalProductsConfig.create({
            //          oldId: hvacOption.id,
            //          name: hvacOption.display_name,
            //          price: hvacOption.price,
            //          productId: hvacProd?.id,
            //       });
            //    }

            //    const currRow = allPriceSettings[0];
            //    // array of arrays of strings [ ['', ''], ['', ''] ]
            //    const priceBrackets = JSON.parse(currRow?.solar_pricing)[0];

            //    // create solar product config row
            //    const solarProposalProdConfig = await this.targetDb.proposalProductsConfig.create({
            //       productId: solarProd?.id,
            //       oldId: currRow.id,
            //    });

            //    // create solar enery efficiency config row
            //    const EeProposalProdConfig = await this.targetDb.proposalProductsConfig.create({
            //       pricePerSquareFt: currRow.ee_price_per_square_foot,
            //       productId: eEProd?.id,
            //       oldId: currRow.id,
            //    });

            //    // remove the first array in the price brackets array because those are the columns
            //    priceBrackets.shift();
            //    for (const row of priceBrackets) {
            //       const state = await this.targetDb.statesLookup.findOne({ where: { name: row[0].trim() } });
            //       const systemType = systemTypes.find((sT: any) => sT.name === row[1].trim());
            //       const travelFee = row[2];
            //       const priceBrackets = row.slice(3);

            //       const priceBracketsToWrite = [];
            //       for (let i = 0; i < priceBrackets?.length; i++) {
            //          let kw, ppw;
            //          if (i % 2 === 0) kw = priceBrackets[i - 1];
            //          else ppw = priceBrackets[i];
            //          priceBracketsToWrite.push([kw, ppw]);
            //       }

            //       for (const pb of priceBracketsToWrite) {
            //          const kw = pb[0] === '' ? null : pb[0];
            //          const ppw = pb[1] === '' ? null : pb[1];

            //          await this.targetDb.proposalBrackets.create({
            //             stateId: state?.id,
            //             travelFee: travelFee,
            //             systemTypeId: systemType?.id,
            //             kw: kw,
            //             ppw: ppw,
            //             proposalProductConfigId: solarProposalProdConfig?.id,
            //          });
            //       }
            //    }

            //    // set migration status
            //    await this.setMigratedStatus('proposals_battery_options', 'id', allBatteryOptionIds, false);
            //    await this.setMigratedStatus('proposals_hvac_options', 'id', allHvacOptionIds, false);
            //    await this.setMigratedStatus('proposals_price_settings', 'id', priceSettingsIds, false);

            //    return true;
            // };
            // result = await migrateProposalPriceSettings();
            // if (result) Logger.info(`Migrated migrateProposalPriceSettings table`);

            result = await this.migrateTableData(
               'proposal_options',
               'id',
               async (currRow: any) => {
                  const {
                     allBatteryOptions,
                     allBatteryOptionIds,
                     allEeOptions,
                     allEeOptionIds,
                     allEnergyUsageOptions,
                     allEnergyUsageOptionIds,
                     allFeeOptions,
                     allFeeOptionIds,
                     allFinancingInfoOptions,
                     allFinancingInfoOptionIds,
                     allHvacOptions,
                     allHvacOptionIds,
                     allHvacSelectionsOptions,
                     allHvacSelectionsOptionIds,
                     allSolarOptions,
                     allSolarOptionIds,
                  } = await this.getCurrDbDataForProposalOptions(currRow.id);

                  const proposalType = proposalTypes.find(
                     (proposalType: any) => proposalType.name.toLowerCase() === currRow.proposal_type.trim()
                  );
                  if (!proposalType) return console.log('could not find proposal type....', currRow);
                  const proposalTech = await this.targetDb.users.findOne({ where: { oldId: currRow.proposal_tech } });
                  // const lead = await this.targetDb.leads.findOne({ where: { oldId: currRow.lead } });
                  const lead = await this.targetDb.leads.findOne({
                     where: {
                        [Op.or]: [{ oldId: currRow.lead }, { otherOldIds: { [Op.contains]: [currRow.lead] } }],
                     },
                  });
                  if (!lead) return console.log('could not find lead....', currRow);

                  const financeInfo = allFinancingInfoOptions[0];

                  let financier = null;
                  if (financeInfo?.proposal_option) {
                     // if proposal_option fk is not null
                     financier = financiers.find((f: any) => f.oldId === +financeInfo.loan_product);
                     if (!financier) {
                        Logger.error('No financier found...');
                        console.log('financeInfo.loan_product:', financeInfo.loan_product);
                        financerFailTimes += 1;
                        if (financerFailTimes > 30) process.exit(0);
                     }
                     // financier = await this.targetDb.financiersLookup.findOne({
                     //    where: { oldId: financeInfo.loan_product },
                     // });
                  }
                  if (financeInfo?.savings_option_display === '') financeInfo['savings_option_display'] = 'None';
                  const savingOptionDisplay = savingOptionDisplayTypes.find(
                     (o: any) => o.name === financeInfo?.savings_option_display?.trim()
                  );

                  // create new proposalOption row
                  const createdProposalOption = await this.targetDb.proposalOptions.create({
                     oldId: currRow.id,
                     name: currRow.name,
                     proposalTypeId: proposalType?.id,
                     proposalTechId: proposalTech?.id,
                     leadId: lead?.id,
                     financierId: financier?.id,
                     downPayment: financeInfo?.down_payment,
                     taxCreditAsDownPayment: financeInfo?.tax_credit_as_downpayment ? true : false,
                     savingsOptionDisplayId: savingOptionDisplay?.id,
                     overrideDealerFee: null,
                     includeTravelFee: allFeeOptions[0]?.include_travel_fee ? true : false,
                     offsetDisclaimer: allFeeOptions[0]?.offset_disclaimer ? true : false,
                  });

                  if (allBatteryOptions && !!allBatteryOptions?.length) {
                     const prod = products.find((p: any) => p.name === 'Battery');
                     for (const batteryOp of allBatteryOptions) {
                        const batteryType = await this.targetDb.proposalProductsConfig.findOne({
                           where: { oldId: batteryOp.battery_type },
                        });
                        await this.targetDb.proposalOptionsExtended.create({
                           proposalOptionId: createdProposalOption?.id,
                           productId: prod?.id,
                           proposalProductConfigId: batteryType?.id,
                           quantity: batteryOp?.unit_amount,
                        });
                     }
                  }

                  if (allHvacOptions && !!allHvacOptions?.length) {
                     const prod = products.find((p: any) => p.name === 'HVAC');
                     for (const hvacOp of allHvacOptions) {
                        await this.targetDb.proposalOptionsExtended.create({
                           proposalOptionId: createdProposalOption?.id,
                           productId: prod?.id,
                           additionalCost: hvacOp.additional_cost,
                           notes: hvacOp.notes,
                        });
                     }
                  }

                  if (allHvacSelectionsOptions && !!allHvacSelectionsOptions?.length) {
                     const prod = products.find((p: any) => p.name === 'HVAC');
                     for (const hvacOp of allHvacSelectionsOptions) {
                        const hvacType = await this.targetDb.proposalProductsConfig.findOne({
                           where: { oldId: hvacOp.hvac_package },
                        });
                        await this.targetDb.proposalOptionsExtended.create({
                           proposalOptionId: createdProposalOption?.id,
                           productId: prod?.id,
                           proposalProductConfigId: hvacType?.id,
                           quantity: hvacType?.hvac_quantity,
                        });
                     }
                  }

                  if (allEeOptions && !!allEeOptions?.length) {
                     const prod = products.find((p: any) => p.name === 'Energy Efficiency');
                     for (const eeOp of allEeOptions) {
                        await this.targetDb.proposalOptionsExtended.create({
                           proposalOptionId: createdProposalOption?.id,
                           productId: prod?.id,
                           squareFootage: eeOp?.square_footage,
                           additionalCost: eeOp?.additional_cost,
                           overrideOffset: eeOp?.override_offset,
                           notes: eeOp?.notes,
                        });
                     }
                  }

                  if (allSolarOptions && !!allSolarOptions?.length) {
                     const prod = products.find((p: any) => p.name === 'Solar');
                     for (const sOp of allSolarOptions) {
                        if (sOp?.system_type.trim() === 'roof') sOp['system_type'] = 'roof mount';
                        if (sOp?.system_type.trim() === 'ground_mount') sOp['system_type'] = 'ground mount';
                        let systemType = systemTypes.find((st: any) => st.name.toLowerCase() === sOp.system_type);
                        if (!systemType) console.log('could not find system type...', sOp, systemTypes);

                        if (sOp?.home_image_url?.length > 1000) sOp['home_image_url'] = null;

                        if (systemType?.name === 'Both') {
                           // HANDLE TWO ROW CREATIONS
                           const LENGTH = ['roof_kw', 'ground_kw'];
                           for (let i = 0; i < LENGTH.length; i++) {
                              const st = LENGTH[i];
                              if (st === 'roof_kw') {
                                 systemType = systemTypes.find((st: any) => st.name.toLowerCase() === 'roof mount');
                              } else {
                                 systemType = systemTypes.find((st: any) => st.name.toLowerCase() === 'ground mount');
                              }

                              await this.targetDb.proposalOptionsExtended.create({
                                 proposalOptionId: createdProposalOption?.id,
                                 productId: prod?.id,
                                 systemSize: sOp[LENGTH[i]],
                                 panelSize: sOp?.panel_size,
                                 numberOfPanels: sOp?.number_of_panels,
                                 homeImageUrl: sOp?.home_image_url,
                                 additionalCost: sOp?.additional_cost,
                                 checkCost: sOp?.check_cost,
                                 trenchingCost: sOp?.trenching_cost,
                                 systemTypeId: systemType?.id,
                                 notes: sOp.notes,
                              });
                           }
                        } else {
                           await this.targetDb.proposalOptionsExtended.create({
                              proposalOptionId: createdProposalOption?.id,
                              productId: prod?.id,
                              systemSize: sOp?.system_size,
                              panelSize: sOp?.panel_size,
                              numberOfPanels: sOp?.number_of_panels,
                              homeImageUrl: sOp?.home_image_url,
                              additionalCost: sOp?.additional_cost,
                              checkCost: sOp?.check_cost,
                              trenchingCost: sOp?.trenching_cost,
                              systemTypeId: systemType?.id,
                              notes: sOp.notes,
                           });
                        }

                        await this.targetDb.proposalMonthlyProjections.create({
                           proposalOptionId: createdProposalOption?.id,
                           janProduction: sOp.jan_production,
                           febProduction: sOp.feb_production,
                           marProduction: sOp.mar_production,
                           aprProduction: sOp.apr_production,
                           mayProduction: sOp.may_production,
                           junProduction: sOp.jun_production,
                           julProduction: sOp.jul_production,
                           augProduction: sOp.aug_production,
                           sepProduction: sOp.sep_production,
                           octProduction: sOp.oct_production,
                           novProduction: sOp.nov_production,
                           decProduction: sOp.dec_production,
                        });
                     }
                  }

                  if (allEnergyUsageOptions && !!allEnergyUsageOptions?.length) {
                     for (const eUOp of allEnergyUsageOptions) {
                        await this.targetDb.proposalMonthlyProjections.create({
                           proposalOptionId: createdProposalOption?.id,
                           janUsage: eUOp.jan_usage,
                           janBill: eUOp.jan_bill,
                           febUsage: eUOp.feb_usage,
                           febBill: eUOp.feb_bill,
                           marUsage: eUOp.mar_usage,
                           marBill: eUOp.mar_bill,
                           aprUsage: eUOp.apr_usage,
                           aprBill: eUOp.apr_bill,
                           mayUsage: eUOp.may_usage,
                           mayBill: eUOp.may_bill,
                           junUsage: eUOp.jun_usage,
                           junBill: eUOp.jun_bill,
                           julUsage: eUOp.jul_usage,
                           julBill: eUOp.jul_bill,
                           augUsage: eUOp.aug_usage,
                           augBill: eUOp.aug_bill,
                           sepUsage: eUOp.sep_usage,
                           sepBill: eUOp.sep_bill,
                           octUsage: eUOp.oct_usage,
                           octBill: eUOp.oct_bill,
                           novUsage: eUOp.nov_usage,
                           novBill: eUOp.nov_bill,
                           decUsage: eUOp.dec_usage,
                           decBill: eUOp.dec_bill,
                        });
                     }
                  }

                  // set migration status
                  if (!!allBatteryOptionIds?.length)
                     await this.setMigratedStatus('proposal_option_battery', 'id', allBatteryOptionIds, false);
                  if (!!allEeOptionIds?.length)
                     await this.setMigratedStatus('proposal_option_ee', 'id', allEeOptionIds, false);
                  if (!!allEnergyUsageOptionIds?.length)
                     await this.setMigratedStatus('proposal_option_energy_usage', 'id', allEnergyUsageOptionIds, false);
                  if (!!allFeeOptionIds?.length)
                     await this.setMigratedStatus('proposal_option_fees', 'id', allFeeOptionIds, false);
                  if (!!allFinancingInfoOptionIds?.length)
                     await this.setMigratedStatus(
                        'proposal_option_financing_information',
                        'id',
                        allFinancingInfoOptionIds,
                        false
                     );
                  if (!!allHvacOptionIds?.length)
                     await this.setMigratedStatus('proposal_option_hvac', 'id', allHvacOptionIds, false);
                  if (!!allHvacSelectionsOptionIds?.length)
                     await this.setMigratedStatus(
                        'proposal_option_hvac_selections',
                        'id',
                        allHvacSelectionsOptionIds,
                        false
                     );
                  if (!!allSolarOptionIds?.length)
                     await this.setMigratedStatus('proposal_option_solar', 'id', allSolarOptionIds, false);

                  return true;
               },
               false
            );
            if (result) Logger.info(`Migrated proposal_options table`);

            const doneMigrating = await this.getProposalMigrateStatus();
            console.log('doneMigrating:', doneMigrating);
            if (doneMigrating) proposalDataMigrated = true;
         }
      } catch (error) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating lead products');
      }
   }

   private async migrateProposalTypes() {
      // const result
      const alreadyInDb = await this.targetDb.proposalTypesLookup.findOne({});
      if (alreadyInDb) return;

      const defaultTypes = [{ name: 'Residential' }, { name: 'Commercial' }];
      const result = await this.targetDb.proposalTypesLookup.bulkCreate(defaultTypes);

      if (result) Logger.info(`Migrated proposalTypesLookup table`);
   }

   private async proposalSystemTypesLookup() {
      // const result
      const alreadyInDb = await this.targetDb.proposalSystemTypesLookup.findOne({});
      if (alreadyInDb) return;

      const defaultTypes = [{ name: 'Roof Mount' }, { name: 'Ground Mount' }, { name: 'Both' }];
      const result = await this.targetDb.proposalSystemTypesLookup.bulkCreate(defaultTypes);

      if (result) Logger.info(`Migrated proposalSystemTypesLookup table`);
   }

   private async proposalSavingOptionTypesLookup() {
      // const result
      const alreadyInDb = await this.targetDb.proposalSavingOptionTypesLookup.findOne({});
      if (alreadyInDb) return;

      // there is a blank one in the proposal_option_financing_information table...
      // should we create a "None" one or just make those rows null for the saving option
      const defaultTypes = [{ name: '25 Year Savings' }, { name: 'Avg Utility Bill Savings' }, { name: 'None' }];
      const result = await this.targetDb.proposalSavingOptionTypesLookup.bulkCreate(defaultTypes);

      if (result) Logger.info(`Migrated proposalSavingOptionTypesLookup table`);
   }

   private async proposalProductsConfig() {
      // const result
      const alreadyInDb = await this.targetDb.proposalProductsConfig.findOne({});
      if (alreadyInDb) return;

      let results = [];
      const hvacProduct = await this.targetDb.productsLookup.findOne({ where: { name: 'HVAC' } });
      if (hvacProduct) {
         const defaultHvacProds = [
            { name: 'Platinum 1.5-2 Ton', price: 16161.0, productId: hvacProduct?.id },
            { name: 'Platinum 2.5-3 Ton', price: 17572.0, productId: hvacProduct?.id },
            { name: 'Platinum 3.5-4 Ton', price: 18982.0, productId: hvacProduct?.id },
            { name: 'Platinum 5 Ton', price: 20393.0, productId: hvacProduct?.id },
            { name: 'Platinum Mini Split', price: 6413.0, productId: hvacProduct?.id },
            { name: 'Platinum Mini Package', price: 28217.0, productId: hvacProduct?.id },
            { name: 'Gold 1.5-2 Ton', price: 14237.0, productId: hvacProduct?.id },
            { name: 'Gold 2.5-3 Ton', price: 15263.0, productId: hvacProduct?.id },
            { name: 'Gold 3.5-4 Ton', price: 16033.0, productId: hvacProduct?.id },
            { name: 'Gold 5 Ton', price: 18598.0, productId: hvacProduct?.id },
            { name: 'Silver 1.5-2 Ton', price: 12056.0, productId: hvacProduct?.id },
            { name: 'Silver 2.5-3 Ton', price: 12698.0, productId: hvacProduct?.id },
            { name: 'Silver 3.5-4 Ton', price: 13467.0, productId: hvacProduct?.id },
            { name: 'Silver 5 Ton', price: 14750.0, productId: hvacProduct?.id },
            { name: 'Custom Duct Work', price: 0.0, productId: hvacProduct?.id },
         ];
         const res = await this.targetDb.proposalProductsConfig.bulkCreate(defaultHvacProds);
         results.push(res);
      }

      const batteryProduct = await this.targetDb.productsLookup.findOne({ where: { name: 'Battery' } });
      if (batteryProduct) {
         const defaultBatteryProds = [
            { name: 'Storz 10kw ', price: 22800.0, productId: batteryProduct?.id },
            { name: 'Storz 15kw', price: 28550.0, productId: batteryProduct?.id },
            { name: 'Enphase 10.1kw', price: 22500.0, productId: batteryProduct?.id },
            { name: 'Enphase Storage 6.7kw', price: 9985.0, productId: batteryProduct?.id },
            { name: 'Tesla Powerwall 2', price: 22800.0, productId: batteryProduct?.id },
            { name: 'Storz 5kw', price: 5750.0, productId: batteryProduct?.id },
            { name: 'Generator 24kw', price: 12540.0, productId: batteryProduct?.id },
            { name: 'Enphase 20kw', price: 35125.0, productId: batteryProduct?.id },
            { name: 'Enphase 30kw', price: 47750.0, productId: batteryProduct?.id },
            { name: 'Enphase 40kw', price: 60375.0, productId: batteryProduct?.id },
         ];
         const res = await this.targetDb.proposalProductsConfig.bulkCreate(defaultBatteryProds);
         results.push(res);
      }

      if (results?.length > 1) Logger.info(`Migrated proposal product options table`);
   }

   private async proposalRequirementsLookup() {
      // const result
      const alreadyInDb = await this.targetDb.proposalRequirementsLookup.findOne({});
      if (alreadyInDb) return;

      const defaultTypes = [
         { name: 'Energy Usage' },
         { name: 'Square Footage' },
         { name: 'Roof Confirmation' },
         { name: 'Utility Company' },
         { name: 'Other' },
      ];
      const result = await this.targetDb.proposalRequirementsLookup.bulkCreate(defaultTypes);

      if (result) Logger.info(`Migrated proposalRequirementsLookup table`);
   }

   private async getLookupData() {
      // get lookup data
      const states = await this.targetDb.statesLookup.findAll({}).then((res: any) => JSON.parse(JSON.stringify(res)));
      const financiers = await this.targetDb.financiersLookup
         .findAll({})
         .then((res: any) => JSON.parse(JSON.stringify(res)));
      const products = await this.targetDb.productsLookup
         .findAll({})
         .then((res: any) => JSON.parse(JSON.stringify(res)));
      const proposalTypes = await this.targetDb.proposalTypesLookup
         .findAll({})
         .then((res: any) => JSON.parse(JSON.stringify(res)));
      const savingOptionDisplayTypes = await this.targetDb.proposalSavingOptionTypesLookup
         .findAll({})
         .then((res: any) => JSON.parse(JSON.stringify(res)));
      const systemTypes = await this.targetDb.proposalSystemTypesLookup
         .findAll({})
         .then((res: any) => JSON.parse(JSON.stringify(res)));

      return { states, financiers, products, proposalTypes, savingOptionDisplayTypes, systemTypes };
   }

   private async getCurrDbDataForProposalPriceSettings() {
      const allPriceSettings = await this.queryDb(
         `SELECT * FROM ${process.env.ORIGIN_DATABASE}.proposals_price_settings WHERE migrated = 0 ORDER BY date_created DESC`,
         []
      ).then((res: any) => JSON.parse(JSON.stringify(res)));

      const allBatteryOptions = await this.queryDb(
         `SELECT * FROM ${process.env.ORIGIN_DATABASE}.proposals_battery_options WHERE migrated = 0`,
         []
      ).then((res: any) => JSON.parse(JSON.stringify(res)));

      const allHvacOptions = await this.queryDb(
         `SELECT * FROM ${process.env.ORIGIN_DATABASE}.proposals_hvac_options WHERE migrated = 0`,
         []
      ).then((res: any) => JSON.parse(JSON.stringify(res)));

      return { allPriceSettings, allBatteryOptions, allHvacOptions };
   }

   private async getCurrDbDataForProposalOptions(proposalOptionLegacyId: number | string) {
      const allBatteryOptions = await this.queryDb(
         `SELECT * FROM ${process.env.ORIGIN_DATABASE}.proposal_option_battery WHERE proposal_option = ? AND migrated = 0`,
         [proposalOptionLegacyId]
      ).then((res: any) => JSON.parse(JSON.stringify(res)));

      const allEeOptions = await this.queryDb(
         `SELECT * FROM ${process.env.ORIGIN_DATABASE}.proposal_option_ee WHERE proposal_option = ? AND migrated = 0`,
         [proposalOptionLegacyId]
      ).then((res: any) => JSON.parse(JSON.stringify(res)));

      const allEnergyUsageOptions = await this.queryDb(
         `SELECT * FROM ${process.env.ORIGIN_DATABASE}.proposal_option_energy_usage WHERE proposal_option = ? AND migrated = 0`,
         [proposalOptionLegacyId]
      ).then((res: any) => JSON.parse(JSON.stringify(res)));

      const allFeeOptions = await this.queryDb(
         `SELECT * FROM ${process.env.ORIGIN_DATABASE}.proposal_option_fees WHERE proposal_option = ? AND migrated = 0`,
         [proposalOptionLegacyId]
      ).then((res: any) => JSON.parse(JSON.stringify(res)));

      const allFinancingInfoOptions = await this.queryDb(
         `SELECT * FROM ${process.env.ORIGIN_DATABASE}.proposal_option_financing_information WHERE proposal_option = ? AND migrated = 0`,
         [proposalOptionLegacyId]
      ).then((res: any) => JSON.parse(JSON.stringify(res)));

      const allHvacOptions = await this.queryDb(
         `SELECT * FROM ${process.env.ORIGIN_DATABASE}.proposal_option_hvac WHERE proposal_option = ? AND migrated = 0`,
         [proposalOptionLegacyId]
      ).then((res: any) => JSON.parse(JSON.stringify(res)));

      const allHvacSelectionsOptions = await this.queryDb(
         `SELECT * FROM ${process.env.ORIGIN_DATABASE}.proposal_option_hvac_selections WHERE proposal_option = ? AND migrated = 0`,
         [proposalOptionLegacyId]
      ).then((res: any) => JSON.parse(JSON.stringify(res)));

      const allSolarOptions = await this.queryDb(
         `SELECT * FROM ${process.env.ORIGIN_DATABASE}.proposal_option_solar WHERE proposal_option = ? AND migrated = 0`,
         [proposalOptionLegacyId]
      ).then((res: any) => JSON.parse(JSON.stringify(res)));

      const allBatteryOptionIds = [...allBatteryOptions].map((o: any) => o.id);
      const allEeOptionIds = [...allEeOptions].map((o: any) => o.id);
      const allEnergyUsageOptionIds = [...allEnergyUsageOptions].map((o: any) => o.id);
      const allFeeOptionIds = [...allFeeOptions].map((o: any) => o.id);
      const allFinancingInfoOptionIds = [...allFinancingInfoOptions].map((o: any) => o.id);
      const allHvacOptionIds = [...allHvacOptions].map((o: any) => o.id);
      const allHvacSelectionsOptionIds = [...allHvacSelectionsOptions].map((o: any) => o.id);
      const allSolarOptionIds = [...allSolarOptions].map((o: any) => o.id);

      return {
         allBatteryOptions,
         allEeOptions,
         allEnergyUsageOptions,
         allFeeOptions,
         allFinancingInfoOptions,
         allHvacOptions,
         allHvacSelectionsOptions,
         allSolarOptions,
         allBatteryOptionIds,
         allEeOptionIds,
         allEnergyUsageOptionIds,
         allFeeOptionIds,
         allFinancingInfoOptionIds,
         allHvacOptionIds,
         allHvacSelectionsOptionIds,
         allSolarOptionIds,
      };
   }

   private async getProposalMigrateStatus() {
      const proposalOptionTotalCount = await this.getRowCount('proposal_options').then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      const proposalOptionMigratedCount = await this.getRowCount('proposal_options', true).then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      Logger.info(`Migrated ${proposalOptionMigratedCount} proposal options`);
      if (proposalOptionTotalCount > proposalOptionMigratedCount) return false;

      const porposalProductLoanOptionTotalCount = await this.getRowCount('proposal_product_loan_options').then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      const porposalProductLoanOptionMigratedCount = await this.getRowCount('proposal_product_loan_options', true).then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      if (porposalProductLoanOptionTotalCount > porposalProductLoanOptionMigratedCount) return false;

      const porposalGeneralSettingsTotalCount = await this.getRowCount('proposal_general_settings').then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      const porposalGeneralSettingsMigratedCount = await this.getRowCount('proposal_general_settings', true).then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      if (porposalGeneralSettingsTotalCount > porposalGeneralSettingsMigratedCount) return false;

      const porposalTaxSettingsTotalCount = await this.getRowCount('proposals_tax_settings').then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      const porposalTaxSettingsMigratedCount = await this.getRowCount('proposals_tax_settings', true).then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      if (porposalTaxSettingsTotalCount > porposalTaxSettingsMigratedCount) return false;

      const porposalBatteryOptionsTotalCount = await this.getRowCount('proposals_battery_options').then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      const porposalBatteryOptionsMigratedCount = await this.getRowCount('proposals_battery_options', true).then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      console.log('porposalBatteryOptionsTotalCount:', porposalBatteryOptionsTotalCount);
      console.log('porposalBatteryOptionsMigratedCount:', porposalBatteryOptionsMigratedCount);
      if (porposalBatteryOptionsTotalCount > porposalBatteryOptionsMigratedCount) return false;

      const porposalHvacOptionsTotalCount = await this.getRowCount('proposals_hvac_options').then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      const porposalHvacOptionsMigratedCount = await this.getRowCount('proposals_hvac_options', true).then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      console.log('porposalHvacOptionsTotalCount:', porposalHvacOptionsTotalCount);
      console.log('porposalHvacOptionsMigratedCount:', porposalHvacOptionsMigratedCount);
      if (porposalHvacOptionsTotalCount > porposalHvacOptionsMigratedCount) return false;

      const porposalPriceSettingsTotalCount = await this.getRowCount('proposals_price_settings').then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      const porposalPriceSettingsMigratedCount = await this.getRowCount('proposals_price_settings', true).then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      console.log('porposalPriceSettingsTotalCount:', porposalPriceSettingsTotalCount);
      console.log('porposalPriceSettingsMigratedCount:', porposalPriceSettingsMigratedCount);
      if (porposalPriceSettingsTotalCount > porposalPriceSettingsMigratedCount) return false;

      return true;
   }
}
