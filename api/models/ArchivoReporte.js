const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ArchivoReporte = sequelize.define('ArchivoReporte', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reporte_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'ARCHIVO_REPORTE',
  timestamps: false
});

module.exports = ArchivoReporte;