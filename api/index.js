const express = require('express')

// 1. Importar controladores y middleware
const { getUsers, getUserById, registerUser, login, me, editMe, assignRole } = require('./controllers/usuarioController')
const { isAuth } = require('./middlewares/auth')

// 2. Importar conexión y cargar los modelos
const sequelize = require('./config/db')
require('./models/User') // 👈 ESENCIAL: Carga el modelo para que Sequelize sepa que debe sincronizar la tabla 'usuarios'

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

// 4. Rutas
server.get('/users', isAuth, getUsers)
server.get('/users/:id', isAuth, getUserById)
server.post('/users', registerUser)
server.post('/login', login)
server.get('/me', isAuth, me)
server.patch('/me', isAuth, editMe)
server.post('/assignRole', assignRole)

// 5. Middleware global para evitar respuestas HTML en caso de error
server.use((err, req, res, next) => {
  console.error('Error no capturado:', err)
  res.status(500).json({ error: err.message || 'Error interno del servidor' })
})

// 6. Iniciar base de datos y luego el servidor Express
async function iniciarServidor() {
  try {
    await sequelize.sync({ alter: true }) // Crea/actualiza la tabla 'usuarios' en PostgreSQL
    console.log('Base de datos y tablas sincronizadas correctamente.')
    
    server.listen(3000, () => {
      console.log('El server esta corriendo en el puerto 3000')
    })
  } catch (error) {
    console.error('Error al conectar o sincronizar con la base de datos:', error)
  }
}

iniciarServidor()