const CategoriaReporte = require("../models/CategoriaReporte")

const getCategorias = async (req, res) => {
    const categorias = await CategoriaReporte.findAll()
    res.json(categorias)
}

const createCategoria = async (req, res) => {
    const { nombre, descripcion } = req.body
    const categoria = await CategoriaReporte.create({ nombre, descripcion })
    res.json(categoria)
}

module.exports = {
    getCategorias,
    createCategoria
}