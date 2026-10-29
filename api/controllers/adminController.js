// api/controllers/adminController.js
// Funciones NUEVAS para el CRUD de usuarios y sus reportes.
// Reutilizan los modelos que ya tenés (User, Reporte, ArchivoReporte).

const User = require('../models/User')
const Reporte = require('../models/Reporte')
const ArchivoReporte = require('../models/ArchivoReporte')

// Devuelve solo los datos "seguros" de un usuario
const datosPublicos = (u) => ({
  id: u.id,
  nombre: u.nombre,
  email: u.email,
  imagen_url: u.imagen_url,
  fecha_registro: u.fecha_registro
})

// GET /api/usuarios/users/:id/reportes
// Los reportes (formularios) que hizo un usuario cualquiera
const getReportesDeUsuario = async (req, res) => {
  try {
    const reportes = await Reporte.findAll({
      where: { usuario_id: req.params.id },
      order: [['fecha_creacion', 'DESC']]
    })
    res.json(reportes)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los reportes', error: error.message })
  }
}

// PUT /api/usuarios/users/:id
// Edita nombre y email de un usuario (la contraseña no se toca acá)
const updateUser = async (req, res) => {
  try {
    const usuario = await User.findByPk(req.params.id)
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' })

    const { nombre, email } = req.body
    if (nombre !== undefined) usuario.nombre = nombre
    if (email !== undefined) usuario.email = email

    await usuario.save() // acá corren las validaciones del modelo

    res.json({ mensaje: 'Usuario actualizado', usuario: datosPublicos(usuario) })
  } catch (error) {
    // Errores de validación o email repetido: son del usuario, no del servidor
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ mensaje: 'Ya existe un usuario con ese email' })
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ mensaje: error.errors.map((e) => e.message).join('. ') })
    }
    res.status(500).json({ mensaje: 'Error al actualizar el usuario', error: error.message })
  }
}

// DELETE /api/usuarios/users/:id
// Borra un usuario y todo lo que cuelga de él (mismo orden que tu eliminarCuenta)
const deleteUser = async (req, res) => {
  try {
    const usuario = await User.findByPk(req.params.id)
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' })

    // Para no borrarte a vos mismo por accidente desde el panel
    if (usuario.id === req.user.id) {
      return res.status(400).json({ mensaje: 'No podés borrar tu propia cuenta desde acá' })
    }

    // 1. Archivos adjuntos de sus reportes
    const reportes = await Reporte.findAll({ where: { usuario_id: usuario.id }, attributes: ['id'] })
    const ids = reportes.map((r) => r.id)
    if (ids.length > 0) {
      await ArchivoReporte.destroy({ where: { reporte_id: ids } })
    }

    // 2. Sus reportes
    await Reporte.destroy({ where: { usuario_id: usuario.id } })

    // 3. Sus roles (tabla intermedia), si existe la asociación
    if (typeof usuario.setRols === 'function') {
      await usuario.setRols([])
    }

    // 4. El usuario
    await usuario.destroy()

    res.json({ mensaje: 'Usuario eliminado' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el usuario', error: error.message })
  }
}

module.exports = { getReportesDeUsuario, updateUser, deleteUser }
