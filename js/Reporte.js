const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reporte = sequelize.define('Reporte', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El título es obligatorio' },
      len: { args: [3, 150], msg: 'El título debe tener entre 3 y 150 caracteres' }
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  prioridad: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: 'media',
    validate: {
      isIn: [['urgente', 'alta', 'media', 'baja']]
    }
  },
  estado: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: 'pendiente',
    validate: {
      isIn: [['pendiente', 'en proceso', 'finalizado', 'en cuenta']]
    }
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categorias_reporte',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  direccion_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'direcciones',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }
}, {
  tableName: 'reportes',
  timestamps: false,
  indexes: [
    { fields: ['usuario_id'] },
    { fields: ['categoria_id'] },
    { fields: ['direccion_id'] },
    { fields: ['estado'] },
    { fields: ['prioridad'] }
  ]
});

module.exports = Reporte;
