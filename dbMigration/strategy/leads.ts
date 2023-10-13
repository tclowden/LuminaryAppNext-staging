import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';
import originDb from '../originDbConnect';
const { Sequelize } = require('sequelize');

// ONLY THING NOT SOLVED HERE IS DUPLICATE PHONE NUMBERS & EMAILS
// OH & INVALID PHONE NUMBERS AND EMAILS
// right now, in migration, we are saving in new db invalid emails & phone numbers
// right now, in migration, we are skipping over leads with duplicate emails & phone numbers

export class LeadsStrategy extends BaseMigration implements MigrationStrategy {
   private leadFieldsColumns = [
      { col: 'taxable_income', type: 'Text' },
      { col: 'credit_score', type: 'Text' },
      { col: 'homeowner', type: 'Text' },
      { col: 'square_footage', type: 'Text' },
      { col: 'average_utility_bill', type: 'Text' },
      { col: 'roof_age', type: 'Text' },
      { col: 'how_do_you_rate_your_credit', type: 'Text' },
      { col: 'type_of_home', type: 'Text' },
      { col: 'last_utility_bill', type: 'Text' },
      { col: 'has_taxable_income', type: 'Text' },
      { col: 'employment_status', type: 'Text' },
      { col: 'accept_text', type: 'Checkbox' },
      { col: 'welcome_call_completed_date', type: 'Text' },
      { col: 'spouse_first_name', type: 'Text' },
      { col: 'spouse_last_name', type: 'Text' },
      { col: 'spouse_phone_number', type: 'Text' },
      { col: 'general_notes', type: 'Text' },
      { col: 'gclid', type: 'Text' },
      { col: 'pending_cancel', type: 'Text' },
      { col: 'sms_consent', type: 'Checkbox' },
      { col: 'created_in_netsuite', type: 'Checkbox' },
      { col: 'ev_transaction_id', type: 'Text' },
      { col: 'phone_carrier', type: 'Text' },
      { col: 'has_mobile_phone', type: 'Checkbox' },
   ];

   // columns to add just use the 'total' column on the orders table instead of productFields
   private orderTotalColumns = [
      'solar_dollar_amount',
      'ee_dollar_amount',
      'hvac_preventative_maintenance_amount',
      'hvac_total_amount',
      'total_battery_price',
   ];

   private productFieldsColumns = [
      { col: 'system_size', type: 'Number', productName: 'Solar' },
      { col: 'generator_size', type: 'Number', productName: 'Generator' },
      {
         col: 'tree_removal_dollar_amount',
         type: 'Number',
         productName: 'Solar',
      },
      {
         col: 'number_of_trees_to_remove',
         type: 'Number',
         productName: 'Solar',
      },
      { col: 'hvac_package', type: 'Text', productName: 'HVAC' },
      { col: 'hvac_mini_splits', type: 'Text', productName: 'HVAC' },
      { col: 'welcome_call_notes', type: 'Text', productName: 'Solar' },
      { col: 'ground_mount', type: 'Text', productName: 'Solar' },
      { col: 'battery_option', type: 'Text', productName: 'Battery' },
      { col: 'enphase_10_qty', type: 'Number', productName: 'Solar' },
      { col: 'enphase_3_qty', type: 'Number', productName: 'Solar' },
      { col: 'financed_tree_amount', type: 'Number', productName: 'Solar' },
   ];

   public async run() {
      try {
         await this.migrateFieldTypes();

         let leadsMigrated = false;
         while (!leadsMigrated) {
            const LEADS_TO_MIGRATE = 3000;
            Logger.info(`Migrating ${LEADS_TO_MIGRATE} leads...`);
            const migratedIds = [];
            let leadData = await this.getOriginData('leads', LEADS_TO_MIGRATE);

            if (leadData.length) {
               // HANDLE LEAD FIELDS
               // create the leadFields first... using the first object in the lead array, create the lead fields based on the keys
               console.log('creating lead fields...');
               await this.createLeadFields(leadData[0]);

               // HANDLE LEADS
               // migrate the leads
               for (const leadToMigrate of leadData) {
                  const newLead = await this.createLead(leadToMigrate);
                  if (newLead) {
                     // create fieldsOnLeads rows
                     await this.createFieldsOnLeads(leadToMigrate, newLead.id);
                     // console.log('created new lead & leadFields for the lead...');
                  }
                  migratedIds.push(leadToMigrate.lead_id);
               }

               await this.setMigratedStatus('leads', 'lead_id', migratedIds);
               // console.log('set leads to migrated = 1');
               Logger.info('Migrated leads table');
               leadsMigrated = false;
            } else {
               Logger.info('Leads migrated... exiting while loop...');
               leadsMigrated = true;
            }
         }
      } catch (error) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error creating leads');
      }
   }

   private underscoreToPretty = (underscoredStr: string) => {
      return underscoredStr
         .split('_')
         .map((str: string) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
         })
         .join(' ');
   };

   private async migrateFieldTypes() {
      const inDb = await this.targetDb.fieldTypesLookup.findOne();
      if (inDb) return Logger.info('Field types already in db...');

      const defaultFieldTypes = [
         { name: 'Dropdown', iconName: 'Dropdown', iconColor: 'orange' },
         { name: 'Currency', iconName: 'DollarSignCircle', iconColor: 'green' },
         { name: 'Number', iconName: 'Hash', iconColor: 'pink' },
         { name: 'Date', iconName: 'CheckCalendar', iconColor: 'purple' },
         { name: 'Text', iconName: 'Text', iconColor: 'cyan' },
         { name: 'Checkbox', iconName: 'Checkbox', iconColor: 'blue' },
         { name: 'Configurable List', iconName: 'Gear', iconColor: 'yellow' },
      ];
      const result = await this.targetDb.fieldTypesLookup.bulkCreate(defaultFieldTypes);
      if (result) Logger.info(`Migrated field types lookup table`);
   }

   private async createLead(leadRecord: Record<string, any>) {
      // see if the lead already exists by phoneNumber or email address... if so skip this record
      let orCondition: Array<any> = [{ phoneNumber: leadRecord.phone_number }];
      const createdAt = this.isProperDate(leadRecord?.date_created)
         ? leadRecord?.date_created
         : leadRecord?.date_updated;

      // // there are some emails that are empty strings...
      // const emailIsEmptyStr = typeof leadRecord.email_address === 'string' && !leadRecord.email_address?.length;
      // if (emailIsEmptyStr) leadRecord['email_address'] = null;
      // if (leadRecord?.email_address) {
      //    orCondition = [...orCondition, { emailAddress: leadRecord.email_address }];
      // }
      const inDb = await this.targetDb.leads
         .findOne({
            where: {
               [Sequelize.Op.or]: orCondition,
            },
         })
         .catch((err: any) => {
            console.log('error --> leadRecord:', leadRecord);
            throw new LumError(err);
         });
      if (inDb) {
         // update oldIds array
         console.log('DUPLICATE LEAD BY PHONE_NUMBER OR EMAIL.... update otherOldIds array!', {
            curr_id: leadRecord.lead_id,
            full_name: `${leadRecord.first_name} ${leadRecord.last_name}`,
            phone_number: leadRecord.phone_number,
            email_address: leadRecord.email_address,
         });
         const oldIds = inDb?.otherOldIds;
         oldIds.push(leadRecord?.lead_id);
         await this.targetDb.leads.update({ otherOldIds: oldIds }, { where: { id: inDb?.id } });
         return null;

         // see which leadRecord was created the latest...
         // const currDateCreated = createdAt;
         // const foundDateCreated = inDb?.createdAt;
         // if (foundDateCreated > currDateCreated) {
         //    // just updated the otherOldIds array
         //    await this.targetDb.leads.update({ otherOldIds: oldIds }, { where: { id: inDb?.id }});
         // } else {
         //    // update phoneNumber, emailAddress, firstName, lastName and otherOldIds array
         // }
      }

      const leadSource = await this.targetDb.leadSources.findOne({
         where: { oldId: leadRecord.lead_source },
      });

      const status = await this.targetDb.statuses.findOne({
         where: { oldId: leadRecord.status },
      });

      const owner = await this.targetDb.users.findOne({
         where: { oldId: leadRecord.owner },
      });

      const createdBy = await this.targetDb.users.findOne({
         where: { oldId: leadRecord.created_by },
      });

      const setterAgent = await this.targetDb.users.findOne({
         where: { oldId: leadRecord.setter_agent },
      });

      return await this.targetDb.leads.create({
         oldId: leadRecord.lead_id,
         firstName: leadRecord.first_name,
         lastName: leadRecord.last_name,
         phoneNumber: leadRecord.phone_number,
         phoneVerified: false,
         emailAddress: leadRecord.email_address,
         emailVerified: false,
         isAvailableInQueue: true,
         streetAddress: leadRecord.street_address,
         city: leadRecord.city,
         state: leadRecord.state,
         zipCode: leadRecord.zip_code,
         latitude: leadRecord.roof_lat,
         longitude: leadRecord.roof_lng,
         addressVerified: leadRecord.address_verified ?? false,
         callCount: leadRecord.call_count ?? 0,
         leadSourceId: leadSource?.id,
         statusId: status?.id,
         ownerId: owner?.id,
         createdById: createdBy?.id,
         setterAgentId: setterAgent?.id,
         createdAt: createdAt,
         updatedAt: leadRecord?.date_updated,
      });
   }

   private async createLeadFields(leadRecord: Record<string, any>) {
      try {
         let displayOrder = 1;
         const leadRecordColumns = Object.keys(leadRecord);
         for (const leadField of this.leadFieldsColumns) {
            // if (typeof leadRecord[leadField.col] !== undefined) {
            if (leadRecordColumns.includes(leadField.col)) {
               const fieldType = await this.targetDb.fieldTypesLookup.findOne({
                  where: { name: leadField.type },
               });
               if (!fieldType) continue;

               const prettyLabel = this.underscoreToPretty(leadField.col);

               // see if label already exists... if so, just continue
               // to avoid duplicates and remigrating this data...
               const labelAlreadyExists = await this.targetDb.leadFields.findOne({
                  where: { label: prettyLabel },
               });
               if (labelAlreadyExists) continue;

               await this.targetDb.leadFields.create({
                  label: prettyLabel,
                  placeholder: prettyLabel,
                  required: false,
                  fieldTypeId: fieldType.id,
                  displayOrder: displayOrder,
               });

               displayOrder += 1;
            }
         }
         console.log('done creating lead fields');
      } catch (error) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error creating lead fields');
      }
   }

   private async createFieldsOnLeads(leadRecord: Record<string, any>, newLeadId: string) {
      for (const currLeadField of this.leadFieldsColumns) {
         // find the lead field (column) by label
         const prettyLabel = this.underscoreToPretty(currLeadField.col);
         const newLeadField = await this.targetDb.leadFields.findOne({
            where: { label: prettyLabel },
         });
         if (!newLeadField) continue;
         // some answers maybe null... let's not migrate those ones
         if (!leadRecord[currLeadField.col]) continue;
         await this.targetDb.fieldsOnLeads.create({
            answer: leadRecord[currLeadField.col],
            leadId: newLeadId,
            leadFieldId: newLeadField.id,
         });
      }
   }

   private async createProductFields(currProductInputs: Array<Record<string, any>>) {
      const fieldTypes = await this.targetDb.fieldTypesLookup.findAll();
      const configuredLists = await this.targetDb.configuredListsLookup.findAll();
      // const currDdSelections = await this.getOriginData("dropdown_selections");

      for (const prodInput of currProductInputs) {
         // find the new field type
         let fieldTypeName = '';
         switch (prodInput?.field_type?.trim()) {
            case 'dropdown':
               fieldTypeName = 'Dropdown';
               break;
            case 'money':
               fieldTypeName = 'Currency';
               break;
            case 'number':
               fieldTypeName = 'Number';
               break;
            case 'date':
               fieldTypeName = 'Date';
               break;
            case 'text':
               fieldTypeName = 'Text';
               break;
            default:
               break;
         }

         const fieldType = fieldTypes.find((fieldType: any) => fieldType.name === fieldTypeName);
         if (!fieldType) continue;

         // now... need to make sure there aren't any duplicates...
         // the only way to really know is to check by label
         const alreadyExists = await this.targetDb.productFields
            .findOne({
               where: { label: prodInput.label },
            })
            .then((res: any) => JSON.parse(JSON.stringify(res)));
         if (alreadyExists) {
            // add the alreadyExists prodInput.id to the array of otherOldIds
            // to avoid duplicates and remigrating this data... just add all the other ids for referencing later down
            const oldIds = alreadyExists?.otherOldIds;
            oldIds.push(prodInput?.input_id);
            await this.targetDb.productFields.update({ otherOldIds: oldIds });
         } else {
            // if here, we want to see if we can convert the prodInput from a normal field to a configurable list
            const configurableLists = [
               { label: 'Utility Company', table: 'utilityCompaniesLookup' },
               { label: 'Financing Option', table: 'financiersLookup' },
               { label: 'Initial Install Crew', table: 'teams' },
               { label: 'Install Crew', table: 'teams' },
               { label: 'Install Team', table: 'teams' },
               { label: 'Lead Installer', table: 'users' },
               { label: 'Proposalist', table: 'users' },
               { label: 'Tech 1', table: 'users' },
               { label: 'Tech 2', table: 'users' },
               { label: 'Tech 3', table: 'users' },
               { label: 'State', table: 'statesLookup' },
            ];
            let configuredList;
            const foundConfigList = configurableLists.find((list: any) => list.label === prodInput.label);
            // if found, convert to a configurable list
            if (foundConfigList) {
               configuredList = await configuredLists.find((list: any) => foundConfigList.table === list.tableName);
            }

            // create the productField row
            const newProductField = await this.targetDb.productFields.create({
               label: prodInput.label,
               placeholder: prodInput.placeholder,
               fieldTypeId: fieldType.id,
               configuredListId: configuredList?.id || null,
               oldId: prodInput.input_id,
            });

            // see if the prodInput is a dropdown type...
            // if so, we need to populate the productFieldOptions table
            if (fieldType?.name === 'Dropdown') {
               const currDdOptions: Array<any> = await new Promise((resolve, reject) => {
                  originDb.query(
                     `SELECT *
                                 FROM ${process.env.ORIGIN_DATABASE}.dropdown_selections
                                 WHERE selection_id = ${prodInput.input_id}`,
                     [],
                     function (error: any, results: any, fields: any) {
                        if (error) reject(error);
                        resolve(results);
                     }
                  );
               });

               // if there were previous created dropdown options..
               if (currDdOptions && !!currDdOptions?.length) {
                  // if we are here, write those dropdown_selection rows to the productFieldOptions table
                  for (const dropdown_option of currDdOptions) {
                     await this.targetDb.productFieldOptions.create({
                        value: dropdown_option.display_value,
                        displayOrder: dropdown_option.displayOrder,
                        productFieldId: newProductField.id,
                        oldId: dropdown_option.id,
                     });

                     // set that option to know it's been migrated
                     await new Promise((resolve, reject) => {
                        originDb.query(
                           `UPDATE ${process.env.ORIGIN_DATABASE}.dropdown_selections SET migrated = 1`,
                           [],
                           function (error: any, results: any, fields: any) {
                              if (error) reject(error);
                              resolve(results);
                           }
                        );
                     });
                  }
               }
            }
         }
      }

      // craete some more product fields from the this.productFieldsColumns array that was generated from the leads table
      // those columns are related to the product the lead is purchasing, not to the lead
      // the product_inputs table didn't have all the same ones, so must add more
      for (const prodInput of this.productFieldsColumns) {
         // see if the productInput already exists
         const prettyLabel = this.underscoreToPretty(prodInput.col);
         const inDb = await this.targetDb.productFields.findOne({
            where: { label: prettyLabel },
         });
         if (inDb) continue;
         else {
            // get fieldType
            const fieldType = fieldTypes.find((type: any) => type.name === prodInput.type);
            if (!fieldType) continue;
            // create the new field based on column name
            await this.targetDb.productFields.create({
               label: prettyLabel,
               placeholder: prettyLabel,
               fieldTypeId: fieldType.id,
            });
         }
      }
   }

   private async createFieldsOnProducts(currProductInputs: Array<Record<string, any>>) {
      try {
         for (const prodInput of currProductInputs) {
            // get the product field relation
            let prodField = await this.targetDb.productFields.findOne({
               where: {
                  [Sequelize.Op.or]: [
                     { oldId: prodInput.input_id },
                     {
                        otherOldIds: {
                           [Sequelize.Op.contains]: [prodInput.input_id],
                        },
                     },
                  ],
               },
            });
            if (!prodField) continue;

            const product = await this.targetDb.productsLookup.findOne({
               where: { oldId: prodInput.product },
            });
            if (!product) continue;

            // create fieldOnProduct row
            await this.targetDb.fieldsOnProducts.create({
               displayOrder: prodInput.display_order,
               required: prodInput.required,
               hidden: prodInput.hidden,
               hideOnCreate: prodInput.hide_on_create,
               productFieldId: prodField.id,
               productId: product.id,
               // fields tied to stages... we will update this value when migrating the stages for each product
               // stageOnProductConstraintId: "",
               oldId: prodInput.input_id,
            });
         }
      } catch (error) {
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error creating fields on products');
      }
   }

   private async setMigratedToProductFields(currProductInputs: Array<Record<string, any>>) {
      // set all rows to migrated = 1
      await new Promise((resolve, reject) => {
         originDb.query(
            `UPDATE ${process.env.ORIGIN_DATABASE}.product_inputs SET migrated = 1`,
            [],
            function (error: any, results: any, fields: any) {
               if (error) reject(error);
               resolve(results);
            }
         );
      });
   }
}
