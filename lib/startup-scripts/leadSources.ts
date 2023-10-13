import db from '@/sequelize/models';

export const createLeadSources = async () => {
   // Get a typeId for the sources
   const leadSourceTypes = await db.leadSourceTypes.findAll().catch((err: any) => console.log(err));

   // Dummy Data
   const leadSources = [
      {
         name: 'Homepage',
         endpoint: 'https://Homepage.com',
         archived: false,
         createdAt: new Date(),
         updatedAt: new Date(),
         typeId: leadSourceTypes[Math.floor(Math.random() * leadSourceTypes.length)].id,
      },
      {
         name: 'Facebook',
         endpoint: 'https://Facebook.com',
         archived: false,
         createdAt: new Date(),
         updatedAt: new Date(),
         typeId: leadSourceTypes[Math.floor(Math.random() * leadSourceTypes.length)].id,
      },
      {
         name: 'Google',
         endpoint: 'https://Google.com',
         archived: false,
         createdAt: new Date(),
         updatedAt: new Date(),
         typeId: leadSourceTypes[Math.floor(Math.random() * leadSourceTypes.length)].id,
      },
      {
         name: 'Energy Bill Cruncher',
         endpoint: 'https://ebc.com',
         archived: false,
         createdAt: new Date(),
         updatedAt: new Date(),
         typeId: leadSourceTypes[Math.floor(Math.random() * leadSourceTypes.length)].id,
      },
      {
         name: 'Solar Direct',
         endpoint: 'https://solardirect.com',
         archived: false,
         createdAt: new Date(),
         updatedAt: new Date(),
         typeId: leadSourceTypes[Math.floor(Math.random() * leadSourceTypes.length)].id,
      },
   ];

   // see if some already exist
   const leadSourcesFromDb = await db.leadSources.findAll({}).catch((err: any) => {
      console.log('err:', err);
   });

   if (!!leadSourcesFromDb?.length) return;

   // Create sources
   await db.leadSources.bulkCreate(leadSources).catch((err: any) => {
      console.log(err);
   });
};
