const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/registro', usuarioController.registerUser);
router.post('/login', usuarioController.login);
router.get('/:id', usuarioController.me);
router.put('/me', usuarioController.editMe)

module.exports = router;