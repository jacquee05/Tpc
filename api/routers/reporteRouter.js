const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');

router.get('/', reporteController.getReportes);
router.post('/', reporteController.createReporte);
router.get('/:id', reporteController.getReporteById);
router.put('/:id', reporteController.actualizarReporte);
router.patch('/:id/estado', reporteController.updateEstadoReporte);
router.delete('/:id', reporteController.eliminarReporte);

module.exports = router;