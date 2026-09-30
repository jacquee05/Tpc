const User = require('./User');
const Permiso = require('./Permiso');
const Role = require('./Role');
const Direccion = require('./Direccion');
const CategoriaReporte = require('./CategoriaReporte');
const RolPermiso = require('./RolPermiso');
const UsuarioRol = require('./UsuarioRol');
const Reporte = require('./Reporte');

// USUARIOS <-> ROLES
User.belongsToMany(Role, {
  through: UsuarioRol,
  foreignKey: 'usuario_id',
  otherKey: 'rol_id',
  as: 'roles'
});

Role.belongsToMany(User, {
  through: UsuarioRol,
  foreignKey: 'rol_id',
  otherKey: 'usuario_id',
  as: 'usuarios'
});

// ROLES <-> PERMISOS
Role.belongsToMany(Permiso, {
  through: RolPermiso,
  foreignKey: 'rol_id',
  otherKey: 'permiso_id',
  as: 'permisos'
});

Permiso.belongsToMany(Role, {
  through: RolPermiso,
  foreignKey: 'permiso_id',
  otherKey: 'rol_id',
  as: 'roles'
});

// USUARIO -> REPORTES
User.hasMany(Reporte, {
  foreignKey: 'usuario_id',
  as: 'reportes'
});

Reporte.belongsTo(User, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

// CATEGORIA -> REPORTES
CategoriaReporte.hasMany(Reporte, {
  foreignKey: 'categoria_id',
  as: 'reportes'
});

Reporte.belongsTo(CategoriaReporte, {
  foreignKey: 'categoria_id',
  as: 'categoria'
});

// DIRECCION -> REPORTES
Direccion.hasMany(Reporte, {
  foreignKey: 'direccion_id',
  as: 'reportes'
});

Reporte.belongsTo(Direccion, {
  foreignKey: 'direccion_id',
  as: 'direccion'
});

module.exports = {
  User,
  Permiso,
  Role,
  Direccion,
  CategoriaReporte,
  RolPermiso,
  UsuarioRol,
  Reporte
};
