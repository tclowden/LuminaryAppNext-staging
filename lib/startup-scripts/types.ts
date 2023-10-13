/**
 * this file holds data that does not rely on foreign keys
 */
import db from '@/sequelize/models';

export const createFieldTypes = async () => {
   const fieldTypes = [
      { name: 'Text', iconName: 'Text', iconColor: 'cyan' },
      { name: 'Dropdown', iconName: 'Dropdown', iconColor: 'orange' },
      { name: 'Number', iconName: 'Hash', iconColor: 'pink' },
      { name: 'Currency', iconName: 'DollarSignCircle', iconColor: 'green' },
      { name: 'Date', iconName: 'CheckCalendar', iconColor: 'purple' },
      { name: 'Configurable List', iconName: 'Gear', iconColor: 'yellow' },
      { name: 'Checkbox', iconName: 'Checkbox', iconColor: 'blue' },
   ];

   // see if some already exist
   const fieldTypesFromDb = await db.fieldTypesLookup.findAll({}).catch((err: any) => {
      console.log('err:', err);
   });

   if (!!fieldTypesFromDb?.length) return;

   await db.fieldTypesLookup.bulkCreate(fieldTypes).catch((err: any) => {
      console.log(err);
   });
};

export const createBucketTypes = async () => {
   const bucketTypes = [
      {
         typeName: 'Auto Dialer',
      },
      {
         typeName: 'Power Dialer',
      },
      {
         typeName: 'Static',
      },
      {
         typeName: 'Default',
      },
   ];

   // see if some already exist
   const bucketTypesFromDb = await db.bucketTypes.findAll({}).catch((err: any) => {
      console.log('err:', err);
   });

   if (!!bucketTypesFromDb?.length) return;

   await db.bucketTypes.bulkCreate(bucketTypes).catch((err: any) => {
      console.log(err);
   });
};

export const createLeadSourcesTypes = async () => {
   const leadSourceTypes = [
      {
         typeName: 'Facebook',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         typeName: 'Google',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
   ];

   // see if some already exist
   const leadSourceTypesFromDb = await db.leadSourceTypes.findAll({}).catch((err: any) => {
      console.log('err:', err);
   });

   if (!!leadSourceTypesFromDb?.length) return;

   await db.leadSourceTypes.bulkCreate(leadSourceTypes).catch((err: any) => {
      console.log(err);
   });
};

export const createStatusTypes = async () => {
   // types dummy data
   const statusTypes = [
      {
         name: 'Winning',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         name: 'Recycled',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         name: 'Losing',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         name: 'New',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
   ];

   // see if some already exist
   const statusTypesFromDb = await db.statusTypes.findAll({}).catch((err: any) => {
      console.log('err:', err);
   });

   if (!!statusTypesFromDb?.length) return;

   // Create the types
   await db.statusTypes.bulkCreate(statusTypes).catch((err: any) => {
      console.log(err);
   });
};

export const createStageTypes = async () => {
   const stageTypes = [{ name: 'Success' }, { name: 'Pending' }, { name: 'Failed' }];

   const stageTypesFromDb = await db.stageTypesLookup.findAll({}).catch((err: any) => {
      console.log('err:', err);
   });

   if (!!stageTypesFromDb?.length) return;

   await db.stageTypesLookup.bulkCreate(stageTypes).catch((err: any) => {
      console.log('err:', err);
   });
};

export const createNetMeteringTypes = async () => {
   const netMeteringTypes = [{ name: 'None' }, { name: 'Full Benefit' }, { name: 'Lose It' }];

   const netMeteringTypesLookupFromDb = await db.netMeteringTypesLookup.findAll({}).catch((err: any) => {
      console.log('err:', err);
   });

   if (!!netMeteringTypesLookupFromDb?.length) return;

   await db.netMeteringTypesLookup.bulkCreate(netMeteringTypes).catch((err: any) => {
      console.log('err:', err);
   });
};

export const createTaskDueDateTypes = async () => {
   const taskDueDateTypes = [{ name: 'Time to Complete' }];

   const taskDueDateTypesLookupFromDb = await db.taskDueDateTypesLookup.findAll({}).catch((err: any) => {
      console.log('err:', err);
   });

   if (!!taskDueDateTypesLookupFromDb?.length) return;

   await db.taskDueDateTypesLookup.bulkCreate(taskDueDateTypes).catch((err: any) => {
      console.log('err:', err);
   });
};
