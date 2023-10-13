('use strict');
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class buckets extends Model {
      static associate(models) {
         this.belongsTo(models.bucketTypes, { foreignKey: 'bucketTypeId' });
         this.hasMany(models.getNextLeadHistory, { foreignKey: 'bucketId' });

         this.hasMany(models.bucketUsers, { foreignKey: 'bucketId' });
         this.hasMany(models.bucketStatuses, { foreignKey: 'bucketId' });
         this.hasMany(models.bucketLeadSources, { foreignKey: 'bucketId' });
         this.hasMany(models.leads, { foreignKey: 'bucketId' });
      }
   }
   buckets.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         isDefaultBucket: DataTypes.BOOLEAN,
         isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
         },
         orderCriteria: {
            type: DataTypes.JSONB,
            allowNull: true,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'buckets',
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
      }
   );
   return buckets;
};
