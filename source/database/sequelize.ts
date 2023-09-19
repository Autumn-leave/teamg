const dbConfig = require("../config/db.config");
const Sequelize = require('sequelize')
const sequelize = new Sequelize(dbConfig.DB, 'postgres', dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: 'postgres',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    // acquire: 30000,
    // idle: 10000,
    idle: 20000,
  evict: 15000,
  acquire: 30000
  }
});


module.exports = sequelize;