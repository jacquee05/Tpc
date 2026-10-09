const express = require('express')

// 1. Importar controladores y middleware
const { getUsers, getUserById, registerUser, login, me, editMe, assignRole } = require('./controllers/usuarioController')
const { isAuth } = require('./middlewares/auth');
const { createReporte, getReportes } = require('./controllers/reporteController')
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

console.log('isAuth:', isAuth);
console.log('getUsers:', getUsers);
console.log('getReportes:', getReportes);

// 4. Rutas
// Rutas de Usuarios
server.get('/api/usuarios/users', isAuth, getUsers)
server.get('/api/usuarios/users/:id', isAuth, getUserById)
server.post('/api/usuarios/registro', registerUser) 
server.post('/api/usuarios/login', login) 
server.get('/api/usuarios/me', isAuth, me) 
server.patch('/api/usuarios/me', isAuth, editMe) 
server.put('/api/usuarios/me', isAuth, editMe) 
server.post('/api/usuarios/assignRole', assignRole)

// Rutas de Reportes
server.get('/api/reportes', isAuth, getReportes)
server.post('/api/reportes', isAuth, createReporte)

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

    await Direccion.findOrCreate({
      where: { id: 1 },
      defaults: { calle: 'Calle Principal', numero: 123 }
    });

    server.listen(3000, () => {
      console.log('El server esta corriendo en el puerto 3000');
    });
  } catch (error) {
    console.error('Error al conectar o sincronizar con la base de datos:', error);
  }
}

iniciarServidor()