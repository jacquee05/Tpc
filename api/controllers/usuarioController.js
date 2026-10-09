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

    // Buscar el usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Comparar la contraseña ingresada con la hasheada
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar el Token (usa una clave secreta segura en tus variables de entorno)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secreto_super_seguro',
      { expiresIn: '2h' }
    );

    // Retornar el token al cliente
    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
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