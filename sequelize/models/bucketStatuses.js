const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   class bucketStatuses extends Model {
      static associate(models) {
         this.belongsTo(models.buckets, { foreignKey: 'bucketId' });
         this.belongsTo(models.statuses, { foreignKey: 'statusId' });
      }
   }
   bucketStatuses.init(
      {
         bucketId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
         },
         statusId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
         },
      },
      {
         sequelize,
         modelName: 'bucketStatuses',
         timestamps: false,
      }
   );

   return bucketStatuses;
};
