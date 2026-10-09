const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CategoriaReporte = sequelize.define('CategoriaReporte', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'El nombre de la categoría es obligatorio' }
    }
  }
}, {
  tableName: 'categorias_reporte',
  timestamps: false
});

module.exports = CategoriaReporte;
