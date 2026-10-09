const Direccion = require("../models/Direccion")

const getDireccionById = async (req, res) => {
    const direccion = await Direccion.findByPk(req.params.id)
    if (!direccion) return res.status(404).json({ message: 'Dirección no encontrada' })
    res.json(direccion)
}

const createDireccion = async (req, res) => {
    const { direccionTexto, latitud, longitud } = req.body
    const direccion = await Direccion.create({
        direccionTexto,
        latitud,
        longitud
    })
    res.json(direccion)
}

module.exports = {
    getDireccionById,
    createDireccion
}