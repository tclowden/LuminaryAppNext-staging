'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class pagesLookup extends Model {
      static associate(models) {
         this.belongsTo(models.pagesLookup, { foreignKey: 'parentPageId', as: 'parentPage' }); // a recursive way to add subsections to pages
         this.hasMany(models.permissions, { foreignKey: 'pageId' });
      }
   }
   pagesLookup.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         iconName: DataTypes.STRING,
         iconColor: DataTypes.STRING,
         route: DataTypes.STRING,
         displayOrder: DataTypes.INTEGER,
         showOnSidebar: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'pagesLookup',
         freezeTableName: true,
         timestamps: true,
         paranoid: true,
      }
   );

   // pagesLookup.beforeUpdate(async (page, options) => {
   //    if (page.deletedAt) {
   //       // need to archive any pages nested in the page... if any
   //       // how to do so?
   //       // using the individualHooks: true, will keep firing until the rows are archived...
   //       // it's like sequelize's version of recursion
   //       await sequelize.models.pagesLookup
   //          .unscoped()
   //          .update(
   //             { deletedAt: new Date() },
   //             { where: { parentPageId: page.id }, individualHooks: true, paranoid: false }
   //          );

   //       // archive permissions associate to the pageId
   //       await sequelize.models.permissions
   //          .unscoped()
   //          .update({ deletedAt: new Date() }, { where: { pageId: page.id }, individualHooks: true, paranoid: false });
   //    }
   // });

   pagesLookup.beforeDestroy(async (page, options) => {
      // soft delete any children pages
      await sequelize.models.pagesLookup.destroy({ where: { parentPageId: page.id }, individualHooks: true });

      // archive permissions associate to the pageId
      await sequelize.models.permissions.destroy({ where: { pageId: page.id }, individualHooks: true });
   });

   return pagesLookup;
};

// const findAllPagesToArchive = async (sqlizeConn, pages) => {
//    let arrayToReturn = [];
//    const recurse = async (pages) => {
//       for (const page of pages) {
//          const foundPages = await sqlizeConn.models.pagesLookup
//             .unscoped()
//             .findAll({ attributes: ['id', 'name', 'parentPageId'], where: { parentPageId: page.id } })
//             .catch((err) => {
//                throw new LumError(400, err);
//             });
//          if (!!foundPages.length) {
//             arrayToReturn.push(JSON.parse(JSON.stringify(foundPages)));
//             // loop through each page and recurse this function
//             return recurse(foundPages);
//          }
//          return;
//       }
//    };
//    await recurse(pages);
//    return arrayToReturn.flat();
// };
