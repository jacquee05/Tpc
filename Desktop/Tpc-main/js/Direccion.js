const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Direccion = sequelize.define('Direccion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  direccion_texto: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  latitud: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: -90,
      max: 90
    }
  },
  longitud: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: -180,
      max: 180
    }
  }
}, {
  tableName: 'direcciones',
  timestamps: false
});

module.exports = Direccion;
