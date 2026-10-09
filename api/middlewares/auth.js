const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = 'misecreto'

//este es el middleware de JWT
const isAuth = (req, res, next) => {        
    const token = req.headers['authorization']
    jwt.verify(token, SECRET, async (err, decoded) => {        
        if (err) return res.status(401).json({ message: 'Error al acceder' })

        const user = await User.findByPk(decoded.id)

        if (!user) return res.json({ message: 'Usuario no encontrado' })

        req.user = {
            id: user.id,
            email: user.email
        }
        next()
    });
}

const disableAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        // User.destroy() con paranoid:true actualiza 'deletedAt' en lugar de borrar la fila
        await User.destroy({ where: { id: userId } }); 
        res.json({ message: 'Perfil deshabilitado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    isAuth,
    disableAccount
}