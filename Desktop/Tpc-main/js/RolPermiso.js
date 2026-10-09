const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RolPermiso = sequelize.define('RolPermiso', {
  rol_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'roles',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  permiso_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'permisos',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'rol_permiso',
  timestamps: false
});

module.exports = RolPermiso;
