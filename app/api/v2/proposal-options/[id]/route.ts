import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import { upsert } from '@/utilities/api/helpers';
import * as Yup from 'yup';
import { UUID } from 'crypto';

async function getProposalOptionInfo(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, 'Invalid id in params');
      const { id } = options?.params;

      console.log('ID', id);

      let proposalData = {
         option: [],
         extended: [],
         monthlyProjections: [],
         taxSettings: [],
         proposalBrackets: [],
         proposalSettings: [],
         proposalProductsConfig: [],
      };
      const proposalOptionId = id;
      const proposalOptions = await db.proposalOptions
         .findAll({
            where: { id: proposalOptionId },
            include: [
               {
                  model: db.proposalTypesLookup,
                  required: false,
                  as: 'proposalType',
               },
               {
                  model: db.users,
                  required: false,
                  as: 'proposalTech',
               },
               {
                  model: db.leads,
                  as: 'lead',
               },
               {
                  model: db.financiersLookup,
                  required: false,
                  as: 'financier',
               },
               {
                  model: db.utilityCompaniesLookup,
                  required: false,
                  as: 'utility',
               },
               {
                  model: db.proposalSavingOptionTypesLookup,
                  required: false,
                  as: 'savingsOptionDisplay',
               },
            ],
         })
         .catch((err: any) => {
            console.log(err);
            throw new LumError(400, err);
         });

      if (proposalOptions !== null) {
         proposalData['option'] = proposalOptions;
      } else {
         const err = new LumError(400, "Can't find proposalOption saved, with id: " + id);
         return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
      }

      const extended = await db.proposalOptionsExtended
         .findAll({
            where: { proposalOptionId: proposalOptionId },
            include: [
               {
                  model: db.productsLookup,
                  required: true,
                  as: 'product',
               },
               {
                  model: db.proposalSystemTypesLookup,
                  required: false,
                  as: 'systemType',
               },
            ],
         })
         .catch((err: any) => {
            console.log(err);
            throw new LumError(400, err);
         });

      if (proposalOptions !== null) {
         proposalData['extended'] = extended;
      }

      const proposalMonthlyProjections = await db.proposalMonthlyProjections
         .findAll({
            where: { proposalOptionId: proposalOptionId },
         })
         .catch((err: any) => {
            console.log(err);
            throw new LumError(400, err);
         });

      if (proposalMonthlyProjections !== null) {
         proposalData['monthlyProjections'] = proposalMonthlyProjections;
      }

      const taxSettings = await db.proposalTaxSettings.findAll().catch((err: any) => {
         console.log(err);
         throw new LumError(400, err);
      });

      const proposalBrackets = await db.proposalBrackets.findAll().catch((err: any) => {
         console.log(err);
         throw new LumError(400, err);
      });

      // Get dealer fee
      const proposalSettings = await db.proposalSettings
         .findAll({
            limit: 1,
            order: [['createdAt', 'DESC']],
         })
         .catch((err: any) => {
            console.log(err);
            throw new LumError(400, err);
         });

      const proposalProductsConfig = await db.proposalProductsConfig.findAll().catch((err: any) => {
         console.log(err);
         throw new LumError(400, err);
      });

      proposalData['taxSettings'] = taxSettings;
      proposalData['proposalBrackets'] = proposalBrackets;
      proposalData['proposalSettings'] = proposalSettings;
      proposalData['proposalProductsConfig'] = proposalProductsConfig;

      console.log('proposalData', proposalData);
      return NextResponse.json({ id: id, data: proposalData }, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
export { getProposalOptionInfo as GET };

async function deleteProposalOption(request: NextRequest, options: any) {
   try {
      console.log('add logic to delete (archive) the proposal option');
      return NextResponse.json('response here', { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
export { deleteProposalOption as DELETE };

async function updateExistingProposalOption(request: NextRequest, options: any) {
   const id = options?.params?.id;
   if (!id) throw new LumError(400, `Invalid Id in params.`);

   console.log('id I guess', id);

   const reqBody = await request.json();

   const schema = Yup.object({
      name: Yup.string().required(),
      proposalType: Yup.string().required(),
      utilityCompanyId: Yup.string().required(),
      financierId: Yup.string().required(),
   });
   await schema.validate(reqBody);
   await updateProposalOption(id, reqBody);

   return NextResponse.json({ success: true, edit: 'success', id: id }, { status: 200 });
}
export { updateExistingProposalOption as POST };
async function updateProposalOption(id: string, body: any) {
   try {
      const products = await getProducts();
      const systemTypes = await getSystemTypes();
      const savingsDisplayId = await getSavingsDisplayId(body.savingsOptionDisplay);
      const st = systemTypes;
      const proposalTypeMatchId = st.find((e: any) => {
         return e.name.toLowerCase() == body.proposalType.toLowerCase();
      });

      const proposalTypeId = proposalTypeMatchId?.id;
      const taxCredit = body.taxCreditAsDownpayment || false;
      const proposalOptionSaveInfo = {
         name: body.name,
         downPayment: body.downPayment,
         taxCreditAsDownPayment: taxCredit,
         overrideDealerFee: body.overrideDealerFee || null,
         offsetDisclaimer: body.offsetDisclaimer,
         leadId: body.leadId,
         proposalTypeId: proposalTypeId,
         proposalTechId: body.tech,
         financierId: body.financierId,
         utilityCompanyId: body.utilityCompanyId,
         includeTravelFee: body.includeTravelFees,
         savingsOptionDisplayId: savingsDisplayId,
      };
      const createdProposalOptions = await db.proposalOptions.update(proposalOptionSaveInfo, {
         where: {
            id: id,
         },
      });

      await db.proposalMonthlyProjections.update(
         {
            janUsage: body.janUsage,
            febUsage: body.febUsage,
            marUsage: body.marUsage,
            aprUsage: body.aprUsage,
            mayUsage: body.mayUsage,
            junUsage: body.junUsage,
            julUsage: body.julUsage,
            augUsage: body.augUsage,
            sepUsage: body.sepUsage,
            octUsage: body.octUsage,
            novUsage: body.novUsage,
            decUsage: body.decUsage,
            janBill: body.janBill,
            febBill: body.febBill,
            aprBill: body.aprBill,
            marBill: body.marBill,
            mayBill: body.mayBill,
            junBill: body.junBill,
            julBill: body.julBill,
            augBill: body.augBill,
            sepBill: body.sepBill,
            octBill: body.octBill,
            novBill: body.novBill,
            decBill: body.decBill,
            janProduction: body.janProduction,
            febProduction: body.febProduction,
            aprProduction: body.aprProduction,
            marProduction: body.marProduction,
            mayProduction: body.mayProduction,
            junProduction: body.junProduction,
            julProduction: body.julProduction,
            augProduction: body.augProduction,
            sepProduction: body.sepProduction,
            octProduction: body.octProduction,
            novProduction: body.novProduction,
            decProduction: body.decProduction,
         },
         {
            where: {
               proposalOptionId: id,
            },
         }
      );

      await db.proposalOptionsExtended.destroy({
         where: {
            proposalOptionId: id,
         },
      });

      if (body.Solar) {
         const proposalSystemTypesLookup = await db.proposalSystemTypesLookup.findAll().catch((err: any) => {
            console.log(err);
            throw new LumError(400, err);
         });

         const solarTypeMatch = proposalSystemTypesLookup.find((e: any) => {
            return e.name.toLowerCase() == body.systemType.toLowerCase();
         });
         const solarTypeMatchId = solarTypeMatch.id;
         const proposalOptionsExtended = await db.proposalOptionsExtended.create({
            // doNetMeter: body.utilityCompany.netMeter,
            systemSize: body.roofKw,
            panelSize: body.panelSize,
            numberOfPanels: body.panelSize,
            homeImageUrl: body.homeImageUrl,
            priceOverride: body.solarPriceOverride,
            additionalCost: body.solarAdditionalCost,
            checkCost: body.checkCost,
            trenchingCost: body.trenchingCost,
            systemTypeId: solarTypeMatchId,
            notes: body.solarNotes,
            productId: products.find((e: any) => e.name == 'Solar').id,
            proposalOptionId: id,
         });
      }

      if (body['Energy Efficiency']) {
         const proposalOptionsExtended = await db.proposalOptionsExtended.create({
            productId: products.find((e: any) => e.name == 'Energy Efficiency').id,
            squareFootage: body.eeSquareFootage,
            overrideOffset: body.eeOverrideOffset,
            priceOverride: body.eeOverridePrice,
            additionalCost: body.eeAdditionalCost,
            notes: body.eeNotes,
            proposalOptionId: id,
         });
      }

      // So there's the hvac data we've got to save.
      // If we save them seperately then, which one holds the override, notes, additional cost, etc.
      console.log('What is going on here? Why is this not working', body.hvac?.length);

      if (body.HVAC) {
         console.log('hvac nation', body.hvac);
         body.hvac.forEach(async (singleHVAC: any) => {
            const temp = {
               productId: products.find((e: any) => e.name == 'HVAC').id,
               quanity: singleHVAC.quantity,
               proposalProductConfigId: singleHVAC.hvacId,
               dualFuelUpgrade: body.dualFuelUpgrade,
               overrideOffset: body.hvacOverridePrice,
               additionalCost: body.hvacAdditionalCost,
               priceOverride: body.hvacOverrideOffset,
               notes: body.hvacNotes,
               showDetailsSection: body.HVACDisplay,
               proposalOptionId: id,
            };
            const proposalOptionsExtended = await db.proposalOptionsExtended.create(temp);
         });
      }

      if (body.Battery) {
         body.battery.forEach(async (singleBattery: any) => {
            const proposalOptionsExtended = await db.proposalOptionsExtended.create({
               productId: products.find((e: any) => e.name == 'Battery').id,
               proposalProductConfigId: singleBattery.batteryId,
               quanity: singleBattery.quantity,
               priceOverride: body.batteryOverridePrice,
               proposalOptionId: id,
            });
         });
      }
   } catch (err) {
      console.log(err);
   }

   async function getProducts() {
      const products = await db.productsLookup
         .findAll({
            where: {
               proposalSupported: true,
            },
         })
         .catch((err: any) => {
            console.log(err);
            throw new LumError(400, err);
         });

      return products;
   }

   async function getSystemTypes() {
      const ptl = await db.proposalTypesLookup.findAll().catch((err: any) => {
         console.log(err);
         throw new LumError(400, err);
      });
      return ptl;
   }

   async function getSavingsDisplayId(name: string) {
      const savingsTypes = await db.proposalSavingOptionTypesLookup.findAll().catch((err: any) => {
         console.log(err);
         throw new LumError(400, err);
      });

      const type = savingsTypes.find((e: any) => {
         return (e.name = name);
      });

      if (type == undefined) return savingsTypes[0]?.id;

      return type?.id;
   }
}
