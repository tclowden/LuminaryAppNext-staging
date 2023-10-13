'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      // // add deafult fieldTypesLookup
      // await queryInterface.bulkInsert('fieldTypesLookup', [
      //    { name: 'Text', iconName: 'Text', iconColor: 'cyan' },
      //    { name: 'Dropdown', iconName: 'Dropdown', iconColor: 'orange' },
      //    { name: 'Number', iconName: 'Hash', iconColor: 'pink' },
      //    { name: 'Currency', iconName: 'DollarSignCircle', iconColor: 'green' },
      //    { name: 'Date', iconName: 'CheckCalendar', iconColor: 'purple' },
      //    { name: 'Configured List', iconName: 'Gear', iconColor: 'yellow' },
      //    { name: 'Checkbox', iconName: 'Checkbox', iconColor: 'blue' },
      // ]);

      // // add deafult configuredListsLookup
      // await queryInterface.bulkInsert('configuredListsLookup', [
      //    { name: 'Users', tableName: 'users', keyPath: 'fullName' },
      //    { name: 'Financiers', tableName: 'financiersLookup', keyPath: 'name' },
      // ]);

      // add deafult keyTypesLookup
      await queryInterface.bulkInsert('keyTypesLookup', [{ name: 'register' }, { name: 'forgot_password' }]);

      // add deafult fieldTypes
      await queryInterface.bulkInsert('offices', [{ name: 'Rexburg' }, { name: 'Arkansas' }]);

      // // add deafult teamTypes
      // await queryInterface.bulkInsert('teamTypesLookup', [{ name: 'HVAC' }]);

      // add default roles
      await queryInterface.bulkInsert('roles', [
         {
            id: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            name: 'Super Secret Dev',
            description: "The most powerful role there is... but it's secret!",
         },
         { id: 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6', name: 'Super Admin', description: 'Admin with a cape.' },
         {
            id: '1df5344f-99f0-4450-a1ad-7a752e61aab8',
            name: 'Default Role',
            description: 'Any registered user has this role, but the role does not have any permissions.',
         },
         { id: '02d28634-d018-47c5-a4f6-ee528b44f92d', name: 'Admin', description: 'Lesser super admin.' },
      ]);

      // // add default states
      // const statesToWrite = states.map((state, i) => {
      //    return { ...state, id: stateIds[i] };
      // });
      // await queryInterface.bulkInsert('statesLookup', statesToWrite);
   },

   async down(queryInterface, Sequelize) {
      // remove default roles
      await queryInterface.bulkDelete('roles', null, {});

      // // remove default fieldTypesLookup
      // await queryInterface.bulkDelete('fieldTypesLookup', null, {});

      // // remove default configuredListsLookup
      // await queryInterface.bulkDelete('configuredListsLookup', null, {});

      // // remove default keyTypesLookup
      // await queryInterface.bulkDelete('keyTypesLookup', null, {});

      // // remove default offices
      // await queryInterface.bulkDelete('offices', null, {});

      // // remove default states
      // await queryInterface.bulkDelete('statesLookup', null, {});
   },
};

const stateIds = [
   'bb044441-a444-47ef-b645-110c5c4c0aa7',
   '64222060-db28-4a49-a9bb-ac07006320d1',
   'd7054c01-bb5b-4d3b-9113-559025e3a0d9',
   '95822b52-1f94-478e-a0c7-c945a3c5a7e9',
   '207a7f97-db7b-4b6e-8971-922fe40740c6',
   'e4c3aa42-fb50-4dc2-98f0-e151e44d7523',
   '59466208-c172-4b7e-98ea-cbd80ac176f9',
   '850da694-9b0d-4e2f-a8c3-5f6893d81d14',
   'b79384a8-0bd5-4019-acd7-923e7208394c',
   '69b41dd5-bc7d-4a53-9ed4-bf952a2549b3',
   'c23cd8b7-a3d3-48b7-95ab-e61f65d1cae1',
   'd323c246-f97c-4467-bbaf-a0f993389b7a',
   'c2c5143b-0459-4c4e-a1a9-e37e8c5c6179',
   '0538557f-2073-433d-a1af-1f25c6b18057',
   '635a58ef-462d-4a28-bc4a-d52a2a4fced2',
   '5a62b092-043a-4486-991b-36f4da53530b',
   '4ce15a76-0eba-4ff7-84cb-708c13ec9a27',
   'a7869c64-c0bd-43f6-9775-5b17e9a28a63',
   'a493481c-a64e-47fc-8f12-db0cc5cb6f43',
   'b2a62fc0-2d00-42de-8a30-3f39c4d98226',
   '65e612ae-7ebf-471a-a9c2-eadbfed117c0',
   '8903f3dd-aa53-4aa4-9436-c4d890324fcb',
   '35a009c7-a2e0-4d43-925b-47b06c6a36dd',
   '0757fda2-cc11-447e-bbe5-00f5ae0b680d',
   '3c67d7b8-5f9a-4926-bd3b-2478075830e4',
   'e264dc62-4200-489a-ad2f-60b59eedc92e',
   '23071c2b-6e40-409a-88ec-40bfa93ed3cd',
   '5e84b427-5c31-4b29-866f-9eb3e11c6249',
   '6850ab17-d979-4b0f-8623-28a630a50785',
   'fb707eb7-52fb-4742-b7f4-d772d403ffd7',
   '84dde758-5c96-4bdc-9202-da67eb1dd347',
   '3af4b8c0-a9c9-4fad-b1b8-66c70021ba60',
   '072c8a2a-e5aa-40b8-99f5-cdc2dfd081e5',
   '3c8710ef-0100-4a98-868c-5172d8493c74',
   '5c1895ed-7998-4413-9d8e-0fd2a699c3f7',
   '7eb31346-1b92-49f1-b0ac-3bcd2b40d929',
   '024f411f-b6bb-4674-8821-9cf330d4c5bf',
   '2a78cb89-8669-4f3b-8b63-2d8ee57fb072',
   '8f0ba048-ff6d-4536-b90b-06b91bf54a0b',
   '35512edd-6709-404a-810d-18bc40642191',
   '26a15f68-48dd-454d-a686-d5a8c47073dc',
   '57525bb1-72ae-4f61-b4ef-7ec128efcf9b',
   '9f9050af-a373-4ecd-96c2-6b0f10222eb8',
   'd756f2a0-c961-4b0a-aa54-fe994d593ba2',
   '423dbb6c-99d1-4104-9a6c-d85d933cc93a',
   '027a58cd-55e2-4cc2-9379-e6e9f5d08b28',
   '9a0fd06e-6ed4-406d-b065-af658678b4e6',
   'c3e52927-c643-4afc-9a4e-ef50ebdf8d6a',
   '423a5495-e39b-49c2-bdd5-d19dbeff42e8',
   'e19c7329-1412-44a9-8346-5a5a7273884f',
];
const states = [
   { name: 'Alabama', abbreviation: 'AL', supported: false },
   { name: 'Alaska', abbreviation: 'AK', supported: false },
   { name: 'Arizona', abbreviation: 'AZ', supported: false },
   { name: 'Arkansas', abbreviation: 'AR', supported: true },
   { name: 'California', abbreviation: 'CA', supported: false },
   { name: 'Colorado', abbreviation: 'CO', supported: false },
   { name: 'Connecticut', abbreviation: 'CT', supported: false },
   { name: 'Delaware', abbreviation: 'DE', supported: false },
   { name: 'Florida', abbreviation: 'FL', supported: true },
   { name: 'Georgia', abbreviation: 'GA', supported: false },
   { name: 'Hawaii', abbreviation: 'HI', supported: false },
   { name: 'Idaho', abbreviation: 'ID', supported: false },
   { name: 'Illinois', abbreviation: 'IL', supported: false },
   { name: 'Indiana', abbreviation: 'IN', supported: false },
   { name: 'Iowa', abbreviation: 'IA', supported: false },
   { name: 'Kansas', abbreviation: 'KS', supported: true },
   { name: 'Kentucky', abbreviation: 'KY', supported: true },
   { name: 'Louisiana', abbreviation: 'LA', supported: false },
   { name: 'Maine', abbreviation: 'ME', supported: false },
   { name: 'Maryland', abbreviation: 'MD', supported: false },
   { name: 'Massachusetts', abbreviation: 'MA', supported: false },
   { name: 'Michigan', abbreviation: 'MI', supported: false },
   { name: 'Minnesota', abbreviation: 'MN', supported: false },
   { name: 'Mississippi', abbreviation: 'MS', supported: true },
   { name: 'Missouri', abbreviation: 'MO', supported: false },
   { name: 'Montana', abbreviation: 'MT', supported: true },
   { name: 'Nebraska', abbreviation: 'NE', supported: false },
   { name: 'Nevada', abbreviation: 'NV', supported: false },
   { name: 'New Hampshire', abbreviation: 'NH', supported: false },
   { name: 'New Jersey', abbreviation: 'NJ', supported: false },
   { name: 'New Mexico', abbreviation: 'NM', supported: false },
   { name: 'New York', abbreviation: 'NY', supported: false },
   { name: 'North Carolina', abbreviation: 'NC', supported: false },
   { name: 'North Dakota', abbreviation: 'ND', supported: false },
   { name: 'Ohio', abbreviation: 'OH', supported: false },
   { name: 'Oklahoma', abbreviation: 'OK', supported: true },
   { name: 'Oregon', abbreviation: 'OR', supported: false },
   { name: 'Pennsylvania', abbreviation: 'PA', supported: false },
   { name: 'Rhode Island', abbreviation: 'RI', supported: false },
   { name: 'South Carolina', abbreviation: 'SC', supported: false },
   { name: 'South Dakota', abbreviation: 'SD', supported: false },
   { name: 'Tennessee', abbreviation: 'TN', supported: true },
   { name: 'Texas', abbreviation: 'TX', supported: true },
   { name: 'Utah', abbreviation: 'UT', supported: false },
   { name: 'Vermont', abbreviation: 'VT', supported: false },
   { name: 'Virginia', abbreviation: 'VA', supported: false },
   { name: 'Washington', abbreviation: 'WA', supported: false },
   { name: 'West Virginia', abbreviation: 'WV', supported: false },
   { name: 'Wisconsin', abbreviation: 'WI', supported: false },
   { name: 'Wyoming', abbreviation: 'WY', supported: false },
];
