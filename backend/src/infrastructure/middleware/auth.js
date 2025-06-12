const jwt = require('jsonwebtoken');
const User = require('../../domain/entities/User');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('No se proporcionó token');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Asegurarse de que el token contiene la información necesaria
        if (!decoded.id || !decoded.username) {
            throw new Error('Token inválido');
        }

        // Establecer la información del usuario en el request
        req.user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email
        };

        next();
    } catch (error) {
        console.error('Error de autenticación:', error.message);
        res.status(401).json({ message: 'Por favor autentíquese' });
    }
};

module.exports = authMiddleware; 