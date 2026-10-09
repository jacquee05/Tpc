const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('proyecto', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize
