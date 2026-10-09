const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UsuarioRol = sequelize.define('UsuarioRol', {
  usuario_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'usuarios',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  rol_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'roles',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'usuario_rol',
  timestamps: false
});

module.exports = UsuarioRol;
