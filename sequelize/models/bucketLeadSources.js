const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   class bucketLeadSources extends Model {
      static associate(models) {
         this.belongsTo(models.buckets, { foreignKey: 'bucketId' });
         this.belongsTo(models.leadSources, { foreignKey: 'leadSourceId' });
      }
   }
   bucketLeadSources.init(
      {
         bucketId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
         },
         leadSourceId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
         },
      },
      {
         sequelize,
         modelName: 'bucketLeadSources',
         timestamps: false,
      }
   );

   return bucketLeadSources;
};
