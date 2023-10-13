// 'use strict';

// @ts-ignore
const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');
// @ts-ignore
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

const config = require(__dirname + '/../config/config.js')[env];
const db: any = {};

let sequelize: any;
if (config.use_env_variable) {
   sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
   sequelize = new Sequelize(config.database, config.username, config.password, config);
}

let models = fs.readdirSync(path.resolve('sequelize/models'));
models = models
   .map((model: any) => {
      if (model.includes('index')) return;
      return require(`./${model}`)(sequelize, Sequelize.DataTypes);
   })
   .filter((model: any) => model);

models.forEach((model: any) => {
   // @ts-ignore
   db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
   if (db[modelName].associate) {
      db[modelName].associate(db);
   }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
