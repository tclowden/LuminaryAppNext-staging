const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   class bucketUsers extends Model {
      static associate(models) {
         this.belongsTo(models.buckets, { foreignKey: 'bucketId' });
         this.belongsTo(models.users, { foreignKey: 'userId' });
      }
   }
   bucketUsers.init(
      {
         bucketId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
         },
         userId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
         },
      },
      {
         sequelize,
         modelName: 'bucketUsers',
         timestamps: false,
      }
   );

   return bucketUsers;
};
