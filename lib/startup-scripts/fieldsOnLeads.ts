// const { faker } = require('@faker-js/faker');
// const db = require('../../sequelize/models');
// const { Op } = require('sequelize');
import { faker } from '@faker-js/faker';
import db from '@/sequelize/models';

// Need to have lead sources and statuses for this script
async function createLeadFieldSections() {
   const leadFieldSectionsDummyData = [
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

   // Create the sections, return an id
   const leadFieldSectionsQuery = await db.leadFieldsSections
      .bulkCreate(leadFieldSectionsDummyData, { returning: true })
      .catch((err: any) => console.log(err));

   // use for subSections id
   const leadFieldSectionId = leadFieldSectionsQuery[0].id;

   // Dummy data
   const leadFieldSubsectionsDummyData = [
      {
         name: 'Customer Information',
         sectionId: leadFieldSectionId,
         displayOrder: 1,
      },
      {
         name: 'General Information',
         sectionId: leadFieldSectionId,
         displayOrder: 2,
      },
      {
         name: 'Marketing Information',
         sectionId: leadFieldSectionId,
         displayOrder: 3,
      },
      {
         name: 'Install Information',
         sectionId: leadFieldSectionId,
         displayOrder: 1,
      },
      {
         name: 'proposal Information',
         sectionId: leadFieldSectionId,
         displayOrder: 1,
      },
      {
         name: 'Dev Information',
         sectionId: leadFieldSectionId,
         displayOrder: 1,
      },
   ];
   const leadFieldSubsectionQuery = await db.leadFieldsSubsections
      .bulkCreate(leadFieldSubsectionsDummyData, { returning: true })
      .catch((err: any) => console.log(err));

   const leadFieldSubsectionQueryId = leadFieldSubsectionQuery[0].id;

   console.log('leadFieldSubsectionQueryId: ', leadFieldSubsectionQueryId);
}

async function createLeadFields() {
   const subsection = await db.leadFieldsSubsections.findOne().catch((err: any) => console.log(err));
   const subsectionId = subsection.id;

   const fieldType = await db.fieldTypesLookup.findOne().catch((err: any) => console.log(err));
   const fieldTypeId = fieldType.id;
   const leadFieldsData = [
      {
         subsectionId: subsectionId,
         fieldTypeId: fieldTypeId,
         label: 'First Name',
         placeholder: 'John',
         required: false,
         displayOrder: 1,
      },
      {
         subsectionId: subsectionId,
         fieldTypeId: fieldTypeId,
         label: 'Last Name',
         placeholder: 'Doe',
         required: false,
         displayOrder: 2,
      },
      {
         subsectionId: subsectionId,
         fieldTypeId: fieldTypeId,
         label: 'Phone Number',
         placeholder: '(123) 456-7890',
         required: true,
         displayOrder: 3,
      },
      {
         subsectionId: subsectionId,
         fieldTypeId: fieldTypeId,
         label: 'Email Address',
         placeholder: 'john.doe@mail.com',
         required: false,
         displayOrder: 4,
      },
      {
         subsectionId: subsectionId,
         fieldTypeId: fieldTypeId,
         label: 'Street Address',
         placeholder: '123 Penny Ln.',
         required: false,
         displayOrder: 5,
      },
      {
         subsectionId: subsectionId,
         fieldTypeId: fieldTypeId,
         label: 'City',
         placeholder: 'Bentonville',
         required: false,
         displayOrder: 6,
      },
      {
         subsectionId: subsectionId,
         fieldTypeId: fieldTypeId,
         label: 'State',
         placeholder: 'AR',
         required: false,
         displayOrder: 7,
      },
      {
         subsectionId: subsectionId,
         fieldTypeId: fieldTypeId,
         label: 'ZIP Code',
         placeholder: '72712',
         required: false,
         displayOrder: 8,
      },
   ];

   console.log(leadFieldsData);

   await db.leadFields.bulkCreate(leadFieldsData).catch((err: any) => console.log(err));
}

async function createLeadFieldOptions() {
   const leadField = await db.leadFields.findOne({
      where: {
         label: 'State',
      },
   });

   const options = [
      {
         value: 'AR',
         displayOrder: 1,
         leadFieldId: leadField.id,
      },
      {
         value: 'MO',
         displayOrder: 2,
         leadFieldId: leadField.id,
      },
      {
         value: 'TX',
         displayOrder: 3,
         leadFieldId: leadField.id,
      },
      {
         value: 'TN',
         displayOrder: 4,
         leadFieldId: leadField.id,
      },
      {
         value: 'FL',
         displayOrder: 5,
         leadFieldId: leadField.id,
      },
   ];

   console.log(options);

   await db.leadFieldOptions.bulkCreate(options).catch((err: any) => console.log(err));
   console.log('options Created');
}

async function createFieldsOnLeads() {
   // Grab 10 leads
   const leads = await db.leads.findAll({
      limit: 10,
   });

   for (const lead of leads) {
      // Get the firstName and lastName Lead Fields
      const firstNameField = await db.leadFields.findOne({
         where: {
            label: {
               [db.Op.like]: '%First Name',
            },
         },
      });

      const firstNameLeadField = {
         answer: faker.name.firstName(),
         archived: false,
         leadId: lead.id,
         leadFieldId: firstNameField.id,
      };

      const lastNameField = await db.leadFields.findOne({
         where: {
            label: {
               [db.Op.like]: '%Last Name',
            },
         },
      });

      const lastNameLeadField = {
         answer: faker.name.lastName(),
         archived: false,
         leadId: lead.id,
         leadFieldId: lastNameField.id,
      };

      const fieldsOnLeadArr = [firstNameLeadField, lastNameLeadField];

      await db.fieldsOnLeads.bulkCreate(fieldsOnLeadArr).catch((err: any) => console.log(err));
      console.log('Fields On lead created');
   }
}
const main = async () => {
   try {
      // await createLeadFieldSections();
      // await createLeadFields();
      // await createLeadFieldOptions();
      // await createFieldsOnLeads();
   } catch (err) {
      console.log(err);
   }
};

main();
