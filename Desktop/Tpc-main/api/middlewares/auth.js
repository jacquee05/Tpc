// api/middlewares/auth.js
const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'No autorizado: Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
    
    // Inyectamos el usuario decodificado en req.user
    req.user = decoded; // Asegúrate de que el payload del JWT contenga { id: user.id }
    
    next(); // Continuamos solo si el token es válido
  } catch (error) {
    return res.status(401).json({ mensaje: 'No autorizado: Token inválido o expirado' });
  }
};

module.exports = { isAuth }