// api/middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'No autorizado: Token no proporcionado' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
    const usuario = await User.findByPk(decoded.id);

    if (!usuario || usuario.eliminado) {
      return res.status(401).json({ mensaje: 'La cuenta está desactivada o no existe' });
    }

    req.user = { id: usuario.id, email: usuario.email };
    return next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'No autorizado: Token inválido o expirado' });
  }
};

module.exports = { isAuth };
