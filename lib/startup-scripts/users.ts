import db from '@/sequelize/models';
import { faker } from '@faker-js/faker';

async function userDummyData() {
   try {
      // create offices
      const officesArr = [
         {
            name: `Roger's office`,
         },
      ];
      await db.offices.bulkCreate(officesArr).catch((err: any) => console.log(err));

      // // create roles
      // const rolesArr = [
      //    {
      //       name: 'Admin',
      //       description: 'User has ability to read and write app data',
      //    },
      //    {
      //       name: 'Disabled User',
      //       description: 'User has ability to read app data, but not write',
      //    },
      // ];
      // await db.roles.bulkCreate(rolesArr).catch((err: any) => console.log(err));

      const officeRecords = await db.offices.findAll({ attributes: ['id'] });
      const officeIds = officeRecords.map((office: any) => office.id);

      // const roleRecords = await db.roles.findAll({ attributes: ['id'] });
      // const roleIds = roleRecords.map((role) => role.id);

      let usersArr = [];

      for (let i = 0; i < 10; i++) {
         const usersData = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            emailAddress: faker.internet.email(),
            passwordHash: faker.internet.password(),
            phoneNumber: faker.phone.number(),
            prefersDarkMode: faker.datatype.boolean(),
            profileUrl: faker.internet.avatar(),
            officeId: faker.helpers.arrayElement(officeIds),
            // need to change this to write rows in the rolesOnUsers table
            // roleId: faker.helpers.arrayElement(roleIds),
         };

         usersArr.push(usersData);
      }

      await db.users.bulkCreate(usersArr).catch((err: any) => {
         console.log(err);
      });
   } catch (err) {
      console.log(err);
   }
}

async function createStatusAndTypes() {
   // Create the status types first
   const statusTypeArr = [
      {
         name: 'New',
      },
      { name: 'Winning' },
      { name: 'Recycle' },
      {
         name: 'Losing',
      },
   ];
   await db.statusTypes.bulkCreate(statusTypeArr).catch((err: any) => console.log(err));

   // now statuses
   const statusArr = [
      // New statusTypes
      {
         name: 'New Lead',
         typeId: 1,
         archived: false,
      },
      { name: 'Reload', typeId: 1, archived: false },
      { name: 'Newly Inserted Referral', typeId: 1, archived: false },

      { name: 'Sweepstakes B Leads', typeId: 1, archived: false },
      { name: 'Demand IQ Basic Lead', typeId: 1, archived: false },
      { name: 'SweepStakes NQR', typeId: 1, archived: false },
      { name: 'Pre Live Transfer', typeId: 1, archived: false },
      { name: 'Woosender Wait', typeId: 1, archived: false },

      // Winning StatusTypes
      { name: 'Customer', typeId: 2, archived: false },
      { name: 'Appointment Scheduled', typeId: 2, archived: false },
      { name: 'Sales Verification', typeId: 2, archived: false },
      { name: 'Self Scheduled / Discovery', typeId: 2, archived: false },
      { name: 'Operations Only', typeId: 2, archived: false },

      // Recycled types
      { name: 'Attempted Contact', typeId: 3, archived: false },
      { name: 'Newly Inserted Referral', typeId: 3, archived: false },
      { name: 'Junior Engineer Set', typeId: 3, archived: false },

      // Losing typeIds
      { name: 'Do Not Contact', typeId: 4, archived: false },
      { name: 'Cancelled', typeId: 4, archived: false },
      { name: 'Lives Out of State/Area', typeId: 4, archived: false },
      { name: 'Retire Lead', typeId: 4, archived: false },
      { name: 'Non Home owner', typeId: 4, archived: false },
      { name: 'Bogus Lead', typeId: 4, archived: false },
      { name: 'Pre Failed', typeId: 4, archived: false },
      { name: 'Post Failed', typeId: 4, archived: false },
   ];

   await db.statuses.bulkCreate(statusArr).catch((err: any) => console.log(err));
}

async function createLeadSources() {
   const leadSrcTypes = [
      {
         typeName: 'FaceBook',
      },
      {
         typeName: 'Google',
      },
   ];

   const leadSources = [
      {
         name: '/ar15',
         typeId: 1,
         endpoint: 'https://shinesolar.com',
      },
      {
         name: '/google.com',
         typeId: 2,
         endpoint: 'https://shinesolar.com',
      },
   ];

   await db.leadSourceTypes.bulkCreate(leadSrcTypes).catch((err: any) => console.log(err));
   await db.leadSources.bulkCreate(leadSources).catch((err: any) => console.log(err));
}

async function leadsDummyData() {
   try {
      // Create fieldTypesLookup
      const fieldTypesLookupArr = [
         { name: 'Date', iconName: 'Calendar', iconColor: 'purple' },
         {
            name: 'Text',
            iconName: 'Text',
            iconColor: 'cyan',
         },
         {
            name: 'Dropdown',
            iconName: 'Dropdown',
            iconColor: 'orange',
         },
         {
            name: 'Checkbox',
            iconName: 'Checkbox',
            iconColor: 'blue',
         },
         {
            name: 'Number',
            iconName: 'Hash',
            iconColor: 'pink',
         },
         {
            name: 'Currency',
            iconName: 'DollarSignCircle',
            iconColor: 'Green',
         },
      ];
      await db.fieldTypesLookup.bulkCreate(fieldTypesLookupArr).catch((err: any) => console.log(err));

      // Create leadFieldsSections
      const leadFieldsSectionsArr = [
         {
            name: 'Customer Information',
            displayOrder: 1,
            editable: true,
         },
         {
            name: 'Notes & Attachments',
            displayOrder: 2,
         },
         {
            name: 'General Information',
            displayOrder: 3,
            editable: true,
         },
         {
            name: 'Orders',
            displayOrder: 4,
         },
         {
            name: 'Proposals',
            displayOrder: 5,
         },
         {
            name: 'Appointments',
            displayOrder: 6,
         },
         {
            name: 'Call Logs',
            displayOrder: 7,
         },
      ];
      await db.leadFieldsSections.bulkCreate(leadFieldsSectionsArr).catch((err: any) => console.log(err));

      // create leadFieldsSubsections
      const leadFieldsSubsectionsArr = [
         {
            name: 'Customer Information',
            sectionId: 1,
            displayOrder: 1,
         },
         {
            name: 'General Information',
            sectionId: 3,
            displayOrder: 1,
         },
      ];
      await db.leadFieldsSubsections.bulkCreate(leadFieldsSubsectionsArr).catch((err: any) => console.log(err));

      // Create leadFields
      const leadFieldsArr = [
         {
            label: 'First Name',
            placeholder: 'John',
            required: false,
            displayOrder: 1,
            fieldTypeId: 2,
            subsectionId: 1,
         },
         { label: 'Last Name', placeholder: 'Doe', required: false, displayOrder: 2, fieldTypeId: 2, subsectionId: 1 },
         {
            label: 'Phone Number',
            placeholder: '(123) 456-7890',
            required: true,
            displayOrder: 3,
            fieldTypeId: 5,
            subsectionId: 1,
         },
         {
            label: 'Email Address',
            placeholder: 'sample.email@email.com',
            required: false,
            displayOrder: 4,
            fieldTypeId: 2,
            subsectionId: 1,
         },
         {
            label: 'Street Address',
            placeholder: '123 Penny Ln.',
            required: false,
            displayOrder: 5,
            fieldTypeId: 2,
            subsectionId: 1,
         },
         { label: 'City', placeholder: 'Rogers', required: false, displayOrder: 6, fieldTypeId: 2, subsectionId: 1 },
         {
            label: 'State',
            placeholder: 'Select State',
            required: false,
            displayOrder: 7,
            fieldTypeId: 3,
            subsectionId: 1,
         },
         { label: 'ZIP Code', placeholder: '87654', required: false, displayOrder: 8, fieldTypeId: 5, subsectionId: 1 },
      ];
      await db.leadFields.bulkCreate(leadFieldsArr).catch((err: any) => console.log(err));

      const leadFieldOptionsArr = [
         {
            value: 'AR',
            displayOrder: 1,
            leadFieldId: 7,
         },
         {
            value: 'MO',
            displayOrder: 2,
            leadFieldId: 7,
         },
         {
            value: 'TX',
            displayOrder: 3,
            leadFieldId: 7,
         },
         {
            value: 'TN',
            displayOrder: 4,
            leadFieldId: 7,
         },
         {
            value: 'FL',
            displayOrder: 5,
            leadFieldId: 7,
         },
      ];
      await db.leadFieldOptions.bulkCreate(leadFieldOptionsArr).catch((err: any) => console.log(err));

      const userRecords = await db.users.findAll({ attributes: ['id'] });
      const userIds = userRecords.map((user: any) => user.id);

      const statusRecords = await db.statuses.findAll({ attributes: ['id'] });
      const statusIds = statusRecords.map((status: any) => status.id);

      const leadSourceRecords = await db.leadSources.findAll({ attributes: ['id'] });
      const leadSourceIds = leadSourceRecords.map((leadSource: any) => leadSource.id);

      let leadsArr = [];

      for (let i = 0; i < 500; i++) {
         const leadData = {
            ownerId: faker.helpers.arrayElement(userIds),
            createdById: faker.helpers.arrayElement(userIds),
            setterAgentId: faker.helpers.arrayElement(userIds),
            statusId: faker.helpers.arrayElement(statusIds),
            leadSourceId: faker.helpers.arrayElement(leadSourceIds),
         };

         leadsArr.push(leadData);
      }

      const createdLeads = await db.leads.bulkCreate(leadsArr).catch((err: any) => console.log(err));

      for (const lead of createdLeads) {
         const fieldsOnLeadArr = [
            {
               leadId: lead.id,
               leadFieldId: 1,
               answer: faker.name.firstName(),
            },
            {
               leadId: lead.id,
               leadFieldId: 2,
               answer: faker.name.lastName(),
            },
            {
               leadId: lead.id,
               leadFieldId: 3,
               answer: faker.phone.number(),
            },
            ,
            {
               leadId: lead.id,
               leadFieldId: 4,
               answer: faker.internet.email(),
            },
            ,
            {
               leadId: lead.id,
               leadFieldId: 5,
               answer: faker.address.streetAddress(),
            },
            ,
            {
               leadId: lead.id,
               leadFieldId: 6,
               answer: faker.address.cityName(),
            },
            ,
            {
               leadId: lead.id,
               leadFieldId: 7,
               answer: faker.helpers.arrayElement(['AR', 'MO', 'TX', 'TN', 'FL']),
            },
            ,
            {
               leadId: lead.id,
               leadFieldId: 8,
               answer: faker.address.zipCode(),
            },
         ];
         const filteredFieldsOnLeadArr = fieldsOnLeadArr.filter((field) => field?.leadId);
         await db.fieldsOnLeads.bulkCreate(filteredFieldsOnLeadArr).catch((err: any) => console.log(err));
      }
   } catch (err) {
      console.log(err);
   }
}

async function main() {
   // first we want to create some dummy users
   await userDummyData();

   // status
   await createStatusAndTypes();

   // dummy Lead Sources and Types
   await createLeadSources();

   // create dummy leads and assign these users as fk fields
   await leadsDummyData();

   console.log('done');
}

main();
