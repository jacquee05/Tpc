const Reporte = require("../models/Reporte")
const ArchivoReporte = require("../models/ArchivoReporte")

// Obtener todos los reportes (con posibilidad de filtrar por estado o prioridad)
const getReportes = async (req, res) => {
    const { estado, prioridad } = req.query
    const where = {}
    
    if (estado) where.estado = estado
    if (prioridad) where.prioridad = prioridad

    const reportes = await Reporte.findAll({ where })
    res.json(reportes)
}

// Obtener un reporte específico por su ID
const getReporteById = async (req, res) => {
    const reporte = await Reporte.findByPk(req.params.id)
    if (!reporte) return res.status(404).json({ message: 'Reporte no encontrado' })
    res.json(reporte)
}

// Crear un nuevo reporte
const createReporte = async (req, res) => {
    const { titulo, descripcion, prioridad, fecha_creacion, categoria_id, direccion_id } = req.body
    const usuario_id = req.user.id // Obtenido del token de sesión

    const reporte = await Reporte.create({
        titulo,
        descripcion,
        prioridad,
        estado: 'pendiente',
        fecha_creacion,
        categoria_id,
        direccion_id,
        usuario_id 
    })

    res.json(reporte)
}

// Actualizar el estado de un reporte
const updateEstadoReporte = async (req, res) => {
    const { id } = req.params
    const { estado } = req.body

    const reporte = await Reporte.findByPk(id)
    if (!reporte) return res.status(404).json({ message: 'Reporte no encontrado' })

    reporte.estado = estado
    await reporte.save()

    res.json(reporte)
}

// Adjuntar archivos a un reporte existente
const addAttachments = async (req, res) => {
    const { id } = req.params
    const { urls } = req.body // Array de cadenas ["url1", "url2"]

    const adjuntos = urls.map(url => ({
        urlArchivo: url,
        reporteId: id
    }))

    await ArchivoReporte.bulkCreate(adjuntos)
    res.json({ message: 'Archivos adjuntados con éxito' })
}

//modificar el reporte
const actualizarReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, prioridad, estado, categoria_id, direccion_id } = req.body;

    // 1. Buscar el reporte existente por su ID
    const reporte = await Reporte.findByPk(id);

    if (!reporte) {
      return res.status(404).json({ mensaje: 'Reporte no encontrado' });
    }

    // 2. Actualizar las propiedades enviadas (mantiene el valor actual si no se proporciona uno nuevo)
    reporte.titulo = titulo || reporte.titulo;
    reporte.descripcion = descripcion || reporte.descripcion;
    reporte.prioridad = prioridad || reporte.prioridad;
    reporte.estado = estado || reporte.estado;
    reporte.categoria_id = categoria_id || reporte.categoria_id;
    reporte.direccion_id = direccion_id || reporte.direccion_id;

    // 3. Guardar los cambios en la base de datos
    await reporte.save();

    return res.json({
      mensaje: 'Reporte actualizado exitosamente',
      reporte
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar el reporte', error: error.message });
  }
};

//Eliminar un reporte del perfil
const eliminarReporte = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Buscar el reporte
    const reporte = await Reporte.findByPk(id);

    if (!reporte) {
      return res.status(404).json({ mensaje: 'Reporte no encontrado' });
    }

    // 2. Eliminar los archivos o adjuntos vinculados a este reporte primero
    await ArchivoReporte.destroy({
      where: { reporte_id: id }
    });

    // 3. Eliminar el reporte principal
    await reporte.destroy();

    return res.json({ mensaje: 'Reporte y sus archivos eliminados exitosamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar el reporte', error: error.message });
  }
};

module.exports = {
    getReportes,
    getReporteById,
    createReporte,
    updateEstadoReporte,
    addAttachments,
    actualizarReporte,
    eliminarReporte
}