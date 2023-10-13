import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class ProductsStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         let result;

         await this.migrateFieldTypes();
         await this.migrateStageTypes();
         await this.migrateTaskDueDateTypes();

         // get lookup data
         const { fieldTypes, configuredLists, stageTypes, taskDueDateTypes } = await this.getLookupData();

         let productsMigrated = false;
         while (!productsMigrated) {
            await this.migrateTableData('products', 'product_id', async (pendingProduct) => {
               let iconName;
               let iconColor;
               switch (pendingProduct?.name) {
                  case 'Solar':
                     iconName = 'Solar';
                     iconColor = 'orange';
                     break;
                  case 'Energy Efficiency':
                     iconName = 'Leaf';
                     iconColor = 'green';
                     break;
                  case 'HVAC':
                     iconName = 'Hvac';
                     iconColor = 'cyan';
                  case 'HVAC Preventative Maintenance':
                     iconName = 'HvacPm';
                     iconColor = 'yellow';
                     break;
                  case 'Battery':
                     iconName = 'Battery';
                     iconColor = 'purple';
                     break;
                  case 'Solar Service':
                     iconName = 'Solar';
                     iconColor = 'orange';
                     break;
                  case 'Commercial Solar':
                     iconName = 'Solar';
                     iconColor = 'orange';
                     break;
                  case 'Generator':
                     break;
                  case 'Quality Assurance':
                     break;
                  case 'HVAC Service':
                     break;
                  case 'EE Service':
                     break;
                  default:
                     break;
               }

               const prodName = pendingProduct.name.trim();
               const doNotAddProd = prodName === 'test devs' || prodName === 'New Product';
               if (doNotAddProd) return;

               const createdProduct = await this.targetDb.productsLookup.create({
                  oldId: pendingProduct.product_id,
                  name: pendingProduct.name,
                  description: "Product in legacy luminary doesn't have a description...",
                  iconName: iconName || '',
                  iconColor: iconColor || '',
                  primary: pendingProduct.primary_product,
               });

               return createdProduct;
            });
            Logger.info(`Migrated products table`);
            // see if anymore products to migrate
            const allMigrated = await this.getMigratedStatus('products');
            if (allMigrated) productsMigrated = true;
         }

         // PRODUCT FIELDS
         let prodFieldsMigrated = false;
         while (!prodFieldsMigrated) {
            await this.migrateTableData('product_inputs', 'input_id', async (currRow: any) => {
               let fieldTypeName: string | undefined;
               switch (currRow?.field_type.trim()) {
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

               const fieldType = fieldTypes.find((ft: any) => ft.name === fieldTypeName);
               if (!fieldType) return;

               // no duplicates...
               let prodField = await this.targetDb.productFields
                  .findOne({
                     where: { label: currRow?.label },
                  })
                  .then((res: any) => JSON.parse(JSON.stringify(res)));

               if (prodField) {
                  // add the alreadyExists prodInput.id to the array of otherOldIds
                  // to avoid duplicates and remigrating this data... just add all the other ids for referencing later down
                  const oldIds = prodField?.otherOldIds;
                  oldIds.push(currRow?.input_id);
                  await this.targetDb.productFields.update({ otherOldIds: oldIds }, { where: { id: prodField?.id } });
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
                  const foundConfigList = configurableLists.find((list: any) => list.label === currRow?.label);
                  // if found, convert to a configurable list
                  if (foundConfigList) {
                     configuredList = await configuredLists.find(
                        (list: any) => foundConfigList.table === list.tableName
                     );
                  }

                  // create the productField row
                  const newProductField = await this.targetDb.productFields.create({
                     label: currRow?.label,
                     placeholder: currRow?.placeholder,
                     fieldTypeId: fieldType?.id,
                     configuredListId: configuredList?.id || null,
                     oldId: currRow?.input_id,
                  });
                  prodField = newProductField;

                  if (fieldType?.name === 'Dropdown') {
                     const currDdOptions = await this.queryDb(
                        `SELECT * FROM ${process.env.ORIGIN_DATABASE}.dropdown_selections WHERE selection_id = ?`,
                        [currRow.input_id]
                     );

                     if (!!currDdOptions?.length) {
                        // if we are here, write those dropdown_selection rows to the productFieldOptions table
                        for (const ddOption of currDdOptions) {
                           await this.targetDb.productFieldOptions.create({
                              value: ddOption.display_value,
                              displayOrder: ddOption.display_order,
                              productFieldId: prodField.id,
                              oldId: ddOption.id,
                           });

                           // set that option to know it's been migrated
                           await this.queryDb(
                              `UPDATE ${process.env.ORIGIN_DATABASE}.dropdown_selections SET migrated = 1`,
                              []
                           );
                        }
                     }
                  }
               }

               // HANDLE FIELDS ON PRODUCT
               const product = await this.targetDb.productsLookup.findOne({ where: { oldId: currRow?.product } });
               if (!product) return;
               return await this.targetDb.fieldsOnProducts.create({
                  displayOrder: currRow?.display_order,
                  required: currRow?.required,
                  hidden: currRow?.hidden,
                  hideOnCreate: currRow?.hide_on_create,
                  productFieldId: prodField?.id,
                  productId: product?.id,
                  // fields tied to stages... we will update this value when migrating the stages for each product
                  // stageOnProductConstraintId: "",
               });
            });
            Logger.info(`Migrated product fields table`);
            // see if anymore product fields to migrate
            const allMigrated = await this.getMigratedStatus('product_inputs');
            if (allMigrated) prodFieldsMigrated = true;
         }

         // PRODUCT STAGES
         let prodStagesMigrated = false;
         while (!prodStagesMigrated) {
            await this.migrateTableData('product_stages', 'stage_id', async (currRow: any) => {
               let stageTypeName: string | undefined;
               switch (currRow?.stage_type.trim()) {
                  case 'success':
                     stageTypeName = 'Success';
                     break;
                  case 'pending':
                     stageTypeName = 'Pending';
                     break;
                  case 'failed':
                     stageTypeName = 'Failed';
                     break;
                  default:
                     break;
               }

               const stageType = stageTypes.find((st: any) => st.name === stageTypeName);
               if (!stageType) return;

               // no duplicates...
               let prodStage = await this.targetDb.productStages
                  .findOne({
                     where: { name: currRow?.name?.trim() },
                  })
                  .then((res: any) => JSON.parse(JSON.stringify(res)));

               if (prodStage) {
                  // add the alreadyExists prodInput.id to the array of otherOldIds
                  // to avoid duplicates and remigrating this data... just add all the other ids for referencing later down
                  const oldIds = prodStage?.otherOldIds;
                  oldIds.push(currRow?.stage_id);
                  await this.targetDb.productStages.update({ otherOldIds: oldIds }, { where: { id: prodStage?.id } });
               } else {
                  // create the productField row
                  const newProductStage = await this.targetDb.productStages.create({
                     name: currRow?.name?.trim(),
                     stageTypeId: stageType?.id,
                     oldId: currRow?.stage_id,
                  });
                  prodStage = newProductStage;
               }

               // HANDLE STAGES ON PRODUCT
               const product = await this.targetDb.productsLookup.findOne({ where: { oldId: currRow?.product } });
               if (!product) return;
               return await this.targetDb.stagesOnProducts.create({
                  displayOrder: currRow?.display_order,
                  required: currRow?.required,
                  scheduled: currRow?.scheduled,
                  timeline: currRow?.timeline,
                  // beginning: currRow?.beginning,
                  createdById: null, // null because this is a migration
                  productStageId: prodStage?.id,
                  productId: product?.id,
               });
            });
            Logger.info(`Migrated product stages table`);
            // see if anymore products to migrate
            const allMigrated = await this.getMigratedStatus('product_stages');
            if (allMigrated) prodStagesMigrated = true;
         }

         // PRODUCT TASKS
         let prodTasksMigrated = false;
         while (!prodTasksMigrated) {
            await this.migrateTableData('product_tasks', 'task_id', async (currRow: any) => {
               let taskTypeName: string | undefined;
               switch (currRow?.deadline_type.trim()) {
                  case 'time':
                     taskTypeName = 'Time to Complete';
                     break;
                  case 'relative':
                     break;
                  case 'install_date':
                     break;
                  default:
                     break;
               }

               const taskDueDateType = taskDueDateTypes.find((st: any) => st.name === taskTypeName);
               if (!taskDueDateType) return;

               // no duplicates...
               let prodTask = await this.targetDb.productTasks
                  .findOne({
                     where: { name: currRow?.name?.trim() },
                  })
                  .then((res: any) => JSON.parse(JSON.stringify(res)));

               if (prodTask) {
                  // add the alreadyExists prodInput.id to the array of otherOldIds
                  // to avoid duplicates and remigrating this data... just add all the other ids for referencing later down
                  const oldIds = prodTask?.otherOldIds;
                  oldIds.push(currRow?.task_id);
                  await this.targetDb.productTasks.update({ otherOldIds: oldIds }, { where: { id: prodTask?.id } });
               } else {
                  // create the productField row
                  const newProductTask = await this.targetDb.productTasks.create({
                     name: currRow?.name?.trim(),
                     oldId: currRow?.task_id,
                     description: currRow?.description.trim(),
                  });
                  prodTask = newProductTask;
               }

               // HANDLE TASKS ON PRODUCT
               const product = await this.targetDb.productsLookup.findOne({ where: { oldId: currRow?.product } });
               if (!product) return;
               return await this.targetDb.tasksOnProducts.create({
                  displayOrder: currRow?.display_order,
                  stageOnProductConstraintId: null,
                  productTaskId: prodTask?.id,
                  productId: product?.id,
                  taskDueDateTypesLookupId: null,
               });
            });
            Logger.info(`Migrated product tasks table`);
            // see if anymore products to migrate
            const allMigrated = await this.getMigratedStatus('product_tasks');
            if (allMigrated) prodTasksMigrated = true;
         }

         // PRODUCT COORDINATORS
         let prodCoordinatorsMigrated = false;
         while (!prodCoordinatorsMigrated) {
            await this.migrateTableData('product_coordinators', 'coord_id', async (currRow: any) => {
               // no duplicates...
               let prodCoord = await this.targetDb.productCoordinators
                  .findOne({
                     where: { name: currRow?.name?.trim() },
                  })
                  .then((res: any) => JSON.parse(JSON.stringify(res)));

               if (prodCoord) {
                  // add the alreadyExists prodInput.id to the array of otherOldIds
                  // to avoid duplicates and remigrating this data... just add all the other ids for referencing later down
                  const oldIds = prodCoord?.otherOldIds;
                  oldIds.push(currRow?.coord_id);
                  await this.targetDb.productCoordinators.update(
                     { otherOldIds: oldIds },
                     { where: { id: prodCoord?.id } }
                  );
               } else {
                  // create the productField row
                  const newProductCoord = await this.targetDb.productCoordinators.create({
                     name: currRow?.name?.trim(),
                     oldId: currRow?.coord_id,
                  });
                  prodCoord = newProductCoord;
               }

               // HANDLE ROLES ON COORDS
               const role = await this.targetDb.roles.findOne({ where: { oldId: currRow?.role } });
               if (!role) return;
               await this.targetDb.rolesOnProductCoordinators.create({
                  productCoordinatorId: prodCoord?.id,
                  roleId: role?.id,
               });

               // HANDLE TASKS ON PRODUCT
               const product = await this.targetDb.productsLookup.findOne({ where: { oldId: currRow?.product } });
               if (!product) return;
               return await this.targetDb.coordinatorsOnProducts.create({
                  // displayOrder: currRow?.display_order,
                  stageOnProductConstraintId: null,
                  productCoordinatorId: prodCoord?.id,
                  productId: product?.id,
               });
            });
            Logger.info(`Migrated product coordinators table`);
            // see if anymore products to migrate
            const allMigrated = await this.getMigratedStatus('product_coordinators');
            if (allMigrated) prodCoordinatorsMigrated = true;
         }
      } catch (error) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating products lookup');
      }
   }

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

   private async migrateStageTypes() {
      const inDb = await this.targetDb.stageTypesLookup.findOne();
      if (inDb) return Logger.info('Stage types already in db...');

      const defaultstageTypesLookup = [{ name: 'Success' }, { name: 'Failed' }, { name: 'Pending' }];
      const result = await this.targetDb.stageTypesLookup.bulkCreate(defaultstageTypesLookup);
      if (result) Logger.info(`Migrated stage types lookup table`);
   }

   private async migrateTaskDueDateTypes() {
      const inDb = await this.targetDb.taskDueDateTypesLookup.findOne({});
      if (inDb) return Logger.info('Task due date types already in db...');

      const defaultTypes = [{ name: 'Time to Complete' }];
      const result = await this.targetDb.taskDueDateTypesLookup.bulkCreate(defaultTypes);
      if (result) Logger.info(`Task Due Date types table`);
   }

   private async getLookupData() {
      const fieldTypes = await this.targetDb.fieldTypesLookup.findAll({});
      const stageTypes = await this.targetDb.stageTypesLookup.findAll({});
      const configuredLists = await this.targetDb.configuredListsLookup.findAll({});
      const taskDueDateTypes = await this.targetDb.taskDueDateTypesLookup.findAll({});

      return { fieldTypes, stageTypes, configuredLists, taskDueDateTypes };
   }
}
