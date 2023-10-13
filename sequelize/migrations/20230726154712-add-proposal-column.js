'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      // await queryInterface.addColumn('productsLookup', 'proposalSupported', {
      //    type: Sequelize.BOOLEAN,
      //    defaultValue: false,
      //    allowNull: false,
      // });
      // proposalSupported example for solar ee hvac battery
      // UPDATE "public"."productsLookup" SET "proposalSupported" = 't' WHERE "id" = '73242884-7c33-4a47-897e-af18b77a09f7';
      // UPDATE "public"."productsLookup" SET "proposalSupported" = 't' WHERE "id" = 'bb920e31-326f-4f90-ba08-447b41a9bb76';
      // UPDATE "public"."productsLookup" SET "proposalSupported" = 't' WHERE "id" = 'a203d0e4-52f8-4e1a-b4f5-4a723901f285';
      // UPDATE "public"."productsLookup" SET "proposalSupported" = 't' WHERE "id" = '32e4fe10-4035-4f2b-ad94-1699d987bf45';
   },

   async down(queryInterface, Sequelize) {
      // await queryInterface.removeColumn('productsLookup', 'proposalSupported');
   },
};
