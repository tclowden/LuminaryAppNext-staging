'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('productTasks', 'description', {
         type: Sequelize.TEXT,
         allowNull: true, // Or set it to false if you don't want to allow null
      });
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('productTasks', 'description', {
         type: Sequelize.STRING,
         allowNull: true, // Or set it to false if your original setup didn't allow null
      });
   },
};
