'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class proposalQueueNotes extends Model {
      static associate(models) {
         this.belongsTo(models.proposalQueue, { foreignKey: 'proposalQueueId', as: 'proposalQueue' });
      }
   }

   proposalQueueNotes.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         notes: {
            type: DataTypes.TEXT,
            allowNull: false,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         timestamps: true,
         sequelize,
         modelName: 'proposalQueueNotes',
         freezeTableName: true,
         paranoid: true,
      }
   );
   return proposalQueueNotes;
};
