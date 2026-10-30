const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET = 'misecreto'

// Obtener todos los usuarios (excluyendo contraseña)
const getUsers = async (req, res) => {
    const users = await User.findAll({ where: { eliminado: false }, attributes: { exclude: 'password_hash' } })
    res.json(users)
}

// Obtener un usuario por ID
const getUserById = async (req, res) => {
    const user = await User.findOne({ where: { id: req.params.id, eliminado: false }, attributes: { exclude: 'password_hash' } })
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

    const user = await User.findOne({ where: { email, eliminado: false } });
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
const editMe = async (req, res, next) => {
  try {
    // req.user.id viene del middleware de autenticación (isAuth)
    const userId = req.user.id; 

    // Extraemos la imagen_url del cuerpo de la petición
    const { imagen_url } = req.body; 

    console.log("Datos recibidos en el backend - imagen_url:", imagen_url); // <-- ¡Mira qué sale en la terminal!

    // Buscamos y actualizamos el usuario en la base de datos
    const usuario = await User.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Actualizamos el campo correspondiente
    usuario.imagen_url = imagen_url;
    await usuario.save();

    return res.json({ mensaje: 'Perfil actualizado con éxito', usuario });
  } catch (error) {
    next(error);
  }
};

// Cambiar la contraseña del usuario autenticado
const changePassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva, passwordConfirmacion } = req.body

    if (!passwordActual || !passwordNueva || !passwordConfirmacion) {
      return res.status(400).json({ mensaje: 'Completá todos los campos' })
    }
    if (passwordNueva !== passwordConfirmacion) {
      return res.status(400).json({ mensaje: 'La nueva contraseña y su confirmación no coinciden' })
    }
    if (passwordNueva.length < 6) {
      return res.status(400).json({ mensaje: 'La nueva contraseña debe tener al menos 6 caracteres' })
    }

    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' })

    const esValida = await bcrypt.compare(passwordActual, user.password_hash)
    if (!esValida) {
      return res.status(400).json({ mensaje: 'La contraseña actual es incorrecta' })
    }
    if (passwordActual === passwordNueva) {
      return res.status(400).json({ mensaje: 'La nueva contraseña debe ser distinta de la actual' })
    }

    user.password_hash = await bcrypt.hash(passwordNueva, 10)
    await user.save()

    return res.json({ mensaje: 'Contraseña actualizada correctamente' })
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error)
    return res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
}

// Eliminar cuenta
const eliminarCuenta = async (req, res) => {
  try {
    const { usuario: usuarioIngresado, password } = req.body;

    if (!usuarioIngresado || !password) {
      return res.status(400).json({ mensaje: 'Ingresá tu usuario y contraseña para confirmar la eliminación.' });
    }

    const usuario = await User.findByPk(req.user.id);
    if (!usuario || usuario.eliminado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado o cuenta ya eliminada.' });
    }

    // Acepta el nombre de usuario o el correo registrado en la cuenta.
    const identificador = usuarioIngresado.trim().toLowerCase();
    const coincideUsuario = identificador === String(usuario.nombre).trim().toLowerCase();
    const coincideEmail = identificador === String(usuario.email).trim().toLowerCase();
    const coincidePassword = await bcrypt.compare(password, usuario.password_hash);

    if ((!coincideUsuario && !coincideEmail) || !coincidePassword) {
      return res.status(401).json({ mensaje: 'El usuario o la contraseña son incorrectos. No se eliminó la cuenta.' });
    }

    usuario.eliminado = true;
    usuario.fecha_eliminacion = new Date();
    await usuario.save();

    return res.json({ mensaje: 'Cuenta desactivada exitosamente. Tus datos históricos se conservaron.' });
  } catch (error) {
    console.error('Error al eliminar la cuenta:', error);
    return res.status(500).json({ mensaje: 'Error al eliminar la cuenta.' });
  }
};

// Asignar o agregar un rol al usuario
const assignRole = async (req, res) => {
    const { id } = req.params 
    const { rolId } = req.body

    const user = await User.findByPk(id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
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
    eliminarCuenta,
    changePassword,
    assignRole
}
