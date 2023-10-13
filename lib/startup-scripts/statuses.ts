import db from '@/sequelize/models';

export const createStatuses = async () => {
   const statusTypes = await db.statusTypes.findAll().catch((err: any) => console.log(err));

   // Dummy Data
   const statuses = [
      {
         name: 'New Lead',
         archived: false,
         typeId: statusTypes[Math.floor(Math.random() * statusTypes.length)].id,
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         name: 'Working',
         archived: false,
         typeId: statusTypes[Math.floor(Math.random() * statusTypes.length)].id,
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         name: 'Attempted Contact',
         archived: false,
         typeId: statusTypes[Math.floor(Math.random() * statusTypes.length)].id,
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         name: 'Customer',
         archived: false,
         typeId: statusTypes[Math.floor(Math.random() * statusTypes.length)].id,
         createdAt: new Date(),
         updatedAt: new Date(),
      },
   ];

   // see if some already exist
   const statusesFromDb = await db.statuses.findAll({}).catch((err: any) => {
      console.log('err:', err);
   });

   if (!!statusesFromDb?.length) return;

   // Create sources
   await db.statuses.bulkCreate(statuses).catch((err: any) => {
      console.log(err);
   });
};
