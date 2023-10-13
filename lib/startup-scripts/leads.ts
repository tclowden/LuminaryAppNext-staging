import { faker } from '@faker-js/faker';
import db from '@/sequelize/models';

// Need to have lead sources and statuses and users for this script
export const createLeads = async () => {
   const statusIds = await db.statuses.findAll({ attributes: ['id'] });
   const leadSourceIds = await db.leadSources.findAll({ attributes: ['id'] });
   const userIds = await db.users.findAll({ attributes: ['id'] });

   const newLeadsArr = [];
   const appointmentsArr = [];
   const notesArr = [];
   for (let i = 0; i < 50; i++) {
      const leadId = crypto.randomUUID();
      const statusId = statusIds[Math.floor(Math.random() * statusIds.length)].id;
      const createdById = userIds[Math.floor(Math.random() * userIds.length)].id;
      const ownerId = userIds[Math.floor(Math.random() * userIds.length)].id;

      const newLead = {
         id: leadId,
         firstName: faker.name.firstName(),
         lastName: faker.name.lastName(),
         phoneNumber: faker.phone.number('+1479#######'),
         phoneVerified: false,
         callCount: 0,
         emailAddress: faker.internet.email(),
         streetAddress: faker.address.streetAddress(),
         city: faker.address.cityName(),
         state: faker.address.state(),
         zipCode: faker.address.zipCode(),
         latitude: faker.address.latitude(),
         longitude: faker.address.longitude(),
         addressVerified: false,
         ownerId: ownerId,
         createdById: createdById,
         setterAgentId: userIds[Math.floor(Math.random() * userIds.length)].id,
         statusId: statusId,
         leadSourceId: leadSourceIds[Math.floor(Math.random() * leadSourceIds.length)].id,
         archived: false,
         createdAt: new Date(),
         updatedAt: new Date(),
         isAvailableInQueue: false,
      };
      newLeadsArr.push(newLead);

      const newAppt = {
         appointmentTime: faker.date.past(),
         kept: i % 2 === 0,
         leadId: leadId,
         // statusId: statusId,
         createdById: createdById,
         assignedRedId: ownerId,
      };
      appointmentsArr.push(newAppt);

      const newNote = {
         content: faker.lorem.sentence(),
         pinned: false,
         createdById: createdById,
         leadId: leadId,
         orderId: null,
      };
      notesArr.push(newNote);
   }

   await db.leads.bulkCreate(newLeadsArr).catch((err: any) => console.log(err));
   await db.appointments.bulkCreate(appointmentsArr).catch((err: any) => console.log(err));
   await db.notes.bulkCreate(notesArr).catch((err: any) => console.log(err));
};
