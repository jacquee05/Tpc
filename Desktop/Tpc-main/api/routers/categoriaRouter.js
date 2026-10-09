const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaReporteController');

router.get('/', categoriaController.getCategorias);
router.post('/', categoriaController.createCategoria);

module.exports = router;