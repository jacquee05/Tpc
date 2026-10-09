const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET = 'misecreto'

// Obtener todos los usuarios (excluyendo contraseña)
const getUsers = async (req, res) => {
    const users = await User.findAll({ attributes: { exclude: 'password' } })
    res.json(users)
}

// Obtener un usuario por ID
const getUserById = async (req, res) => {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: 'password' } })
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json(user)
}

// Registro de nuevos usuarios
const registerUser = async (req, res) => {
  try {
    // Extraemos ambas posibilidades del body
    const { nombre, email, password, password_hash } = req.body
    
    // Si viene 'password' usa ese, si no usa 'password_hash'
    const plainPassword = password || password_hash

    if (!plainPassword) {
      return res.status(400).json({ error: "La contraseña es requerida" })
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10)

    const user = await User.create({
      nombre,
      email, 
      password_hash: hashedPassword
    })

    return res.status(201).json(user)

  } catch (error) {
    console.error('Error al registrar usuario:', error)
    return res.status(500).json({ error: 'Error al registrar el usuario' })
  }
}

// Autenticación / Login

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ mensaje: 'Credenciales incorrectas' });
    }

    const esValida = await bcrypt.compare(password, user.password_hash);
    if (!esValida) {
      return res.status(400).json({ mensaje: 'Credenciales incorrectas' });
    }

// Ejemplo al generar el token en el login:
const token = jwt.sign(
  { id: user.id, email: user.email }, 
  process.env.JWT_SECRET || 'tu_clave_secreta', 
  { expiresIn: '1d' }
);

    // Devolver el token y los datos del usuario
    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};


// Obtener perfil del usuario autenticado
const me = async (req, res) => {
    const user = await User.findByPk(req.user.id, {
        attributes: { exclude: 'password' }
    })
    res.json(user)
}

// Editar foto de perfil o datos personales
const editMe = async (req, res) => {
    const { id } = req.user
    const { imagen } = req.body
    
    const user = await User.findByPk(id)
    if (!user) return res.status(400).json({ message: 'Usuario No encontrado' })

    user.imagen = imagen
    await user.save()

    res.status(200).json(user)
}

// Asignar o agregar un rol al usuario
const assignRole = async (req, res) => {
    const { id } = req.params // ID del usuario a modificar
    const { rolId } = req.body

    const user = await User.findByPk(id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    // Sequelize genera automáticamente este método al definir relaciones pertenecer/asociar
    await user.addRol(rolId) 

    res.status(200).json({ message: 'Rol asignado correctamente' })
}

module.exports = {
    getUsers,
    getUserById,
    registerUser,
    login,
    me,
    editMe,
    assignRole
}