const Rol = require("../models/Rol")

const getRoles = async (req, res) => {
    const roles = await Rol.findAll()
    res.json(roles)
}

const createRol = async (req, res) => {
    const { nombreRol, descripcion } = req.body
    const rol = await Rol.create({ nombreRol, descripcion })
    res.json(rol)
}

module.exports = {
    getRoles,
    createRol
}