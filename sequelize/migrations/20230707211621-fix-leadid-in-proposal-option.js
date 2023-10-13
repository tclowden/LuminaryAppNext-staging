'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.removeColumn('proposalOptions', 'leadId');

      await queryInterface.addColumn('proposalOptions', 'leadId', {
         type: Sequelize.UUID,
         allowNull: false,
         primaryKey: true,
         references: {
            model: 'leads',
            key: 'id',
         },
         defaultValue: Sequelize.literal('uuid_generate_v4()'),
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('proposalOptions', 'leadId');

      await queryInterface.addColumn('proposalOptions', 'leadId', {
         type: Sequelize.STRING,
         allowNull: false,
         primaryKey: true,
         defaultValue: Sequelize.literal('uuid_generate_v4()'),
      });
   },
};
