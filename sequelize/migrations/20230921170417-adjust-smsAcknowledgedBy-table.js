'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      const transaction = await queryInterface.sequelize.transaction();

      try {
         await queryInterface.removeColumn('smsAcknowledgedBy', 'smsLogId', { transaction });
         await queryInterface.addColumn(
            'smsAcknowledgedBy',
            'leadId',
            {
               type: Sequelize.UUID,
               allowNull: false,
               references: {
                  model: 'leads',
                  key: 'id',
               },
               onUpdate: 'CASCADE',
               onDelete: 'CASCADE',
            },
            { transaction }
         );

         await queryInterface.removeColumn('smsAcknowledgedBy', 'acknowledgedByUserId', { transaction });
         await queryInterface.addColumn(
            'smsAcknowledgedBy',
            'acknowledgedByUserIds',
            {
               type: Sequelize.ARRAY(Sequelize.STRING),
               allowNull: false,
            },
            { transaction }
         );

         await transaction.commit();
      } catch (err) {
         await transaction.rollback();
         throw err;
      }
   },

   async down(queryInterface, Sequelize) {
      const transaction = await queryInterface.sequelize.transaction();

      try {
         await queryInterface.removeColumn('smsAcknowledgedBy', 'leadId', { transaction });
         await queryInterface.addColumn(
            'smsAcknowledgedBy',
            'smsLogId',
            {
               type: Sequelize.UUID,
               allowNull: false,
               references: {
                  model: 'smsLogs',
                  key: 'id',
               },
               onUpdate: 'CASCADE',
               onDelete: 'CASCADE',
            },
            { transaction }
         );

         await queryInterface.removeColumn('smsAcknowledgedBy', 'acknowledgedByUserIds', { transaction });
         await queryInterface.addColumn(
            'smsAcknowledgedBy',
            'acknowledgedByUserId',
            {
               type: Sequelize.UUID,
               allowNull: false,
               references: {
                  model: 'users',
                  key: 'id',
               },
               onUpdate: 'CASCADE',
               onDelete: 'CASCADE',
            },
            { transaction }
         );

         await transaction.commit();
      } catch (err) {
         await transaction.rollback();
         throw err;
      }
   },
};
