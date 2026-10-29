const express = require('express')
const cors = require('cors')

// 1. Importar controladores y middleware
const { getUsers, getUserById, registerUser, login, me, editMe, changePassword, assignRole } = require('./controllers/usuarioController')
const { isAuth } = require('./middlewares/auth');
const { createReporte, getReportes } = require('./controllers/reporteController')
const { getCategorias } = require('./controllers/categoriaReporteController')
const { getReporteById, actualizarReporte, eliminarReporte } = require('./controllers/reporteController')
const { getReportesDeUsuario, updateUser, deleteUser } = require('./controllers/adminController')
const CategoriaReporte = require('./models/CategoriaReporte');
const Direccion = require('./models/Direccion');

// 2. Cargar modelos de Sequelize
const sequelize = require('./config/db')
require('./models/User')
require('./models/CategoriaReporte') 
require('./models/Direccion') 
require('./models/Permiso') 
require('./models/Role') 
require('./models/RolPermiso') 
require('./models/UsuarioRol') 
require('./models/ArchivoReporte') 
require('./models/Reporte')

const server = express()
// 3. Middlewares generales
server.use(express.json())
server.use(cors());

// Configuración de CORS
server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// 4. Rutas
// Rutas de Usuarios
server.get('/api/usuarios/users', isAuth, getUsers)
server.get('/api/usuarios/users/:id', isAuth, getUserById)
server.post('/api/usuarios/registro', registerUser) 
server.post('/api/usuarios/login', login) 
server.get('/api/usuarios/me', isAuth, me) 
server.patch('/api/usuarios/me', isAuth, editMe) 
server.put('/api/usuarios/me', isAuth, editMe) 
server.put('/api/usuarios/me/password', isAuth, changePassword)
server.post('/api/usuarios/assignRole', assignRole)

// Categorías (las usa el formulario de reportes)
server.get('/api/categorias', getCategorias)

// Rutas de Reportes
server.get('/api/reportes', isAuth, getReportes)
server.post('/api/reportes', isAuth, createReporte)
// CRUD de usuarios y reportes
// TODO(roles): cuando exista el chequeo de rol, va acá junto a isAuth (ej: isAuth, isAdmin)
server.put('/api/usuarios/users/:id', isAuth, updateUser)
server.delete('/api/usuarios/users/:id', isAuth, deleteUser)
server.get('/api/usuarios/users/:id/reportes', isAuth, getReportesDeUsuario)
server.get('/api/reportes/:id', isAuth, getReporteById)
server.put('/api/reportes/:id', isAuth, actualizarReporte)
server.delete('/api/reportes/:id', isAuth, eliminarReporte)

// 5. Middleware global de manejo de errores
server.use((err, req, res, next) => {
  console.error('Error no capturado:', err)
  res.status(500).json({ error: err.message || 'Error interno del servidor' })
})

// 6. Iniciar base de datos y servidor Express
async function iniciarServidor() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Base de datos y tablas sincronizadas correctamente.');

    // Crear registros iniciales si no existen
    await CategoriaReporte.findOrCreate({
      where: { id: 1 },
      defaults: { nombre: 'General' }
    });

    // Los registros iniciales se crean con id fijo: hay que adelantar el contador automático
    // para que los próximos inserts no choquen con esos ids.
    await sequelize.query(`SELECT setval(pg_get_serial_sequence('categorias_reporte', 'id'), (SELECT MAX(id) FROM categorias_reporte))`);

    // Una categoría por cada prestación de la portada (mismos nombres que en client/src/data/prestaciones.js)
    const nombresCategorias = [
      'Calles, fachadas y veredas',
      'Arbolado y espacios verdes',
      'Limpieza y residuos',
      'Alumbrado público',
      'Obras y catastro',
      'Comercios y actividades',
      'Seguridad',
      'Tránsito y transporte'
    ];
    for (const nombre of nombresCategorias) {
      await CategoriaReporte.findOrCreate({ where: { nombre } });
    }

    await Direccion.findOrCreate({
      where: { id: 1 },
      defaults: { direccion_texto: 'Sin direccion', latitud: 0, longitud: 0 }
    });

    await sequelize.query(`SELECT setval(pg_get_serial_sequence('direcciones', 'id'), (SELECT MAX(id) FROM direcciones))`);

    server.listen(3000, () => {
      console.log('El server esta corriendo en el puerto 3000');
    });
  } catch (error) {
    console.error('Error al conectar o sincronizar con la base de datos:', error);
  }
}

iniciarServidor()