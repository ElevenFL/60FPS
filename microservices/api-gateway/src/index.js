require('dotenv').config();
const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

// Middleware para verificar el token y añadir el ID de usuario a la petición
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Añadir userId a la request para el decorador
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido.' });
    }
};

// Decorador para añadir el header X-User-Id a las peticiones que van a los microservicios
const proxyReqDecorator = (proxyReqOpts, srcReq) => {
    if (srcReq.userId) {
        proxyReqOpts.headers['X-User-Id'] = srcReq.userId;
    }
    return proxyReqOpts;
};

// Definición de los proxies para cada servicio
const authServiceProxy = proxy(process.env.AUTH_SERVICE_URL);
const gamesServiceProxy = proxy(process.env.GAMES_SERVICE_URL, { proxyReqDecorator: proxyReqDecorator });
const reviewsServiceProxy = proxy(process.env.REVIEWS_SERVICE_URL, { proxyReqDecorator: proxyReqDecorator });

// --- Rutas de Autenticación (Públicas) ---
app.post('/api/auth/register', authServiceProxy);
app.post('/api/auth/login', authServiceProxy);

// --- Rutas de Juegos ---
// Públicas
app.get('/api/games', gamesServiceProxy);
app.get('/api/games/search', gamesServiceProxy);
app.get('/api/games/:id', gamesServiceProxy);
// Protegidas
app.post('/api/games', authMiddleware, gamesServiceProxy);
app.put('/api/games/:id', authMiddleware, gamesServiceProxy);
app.delete('/api/games/:id', authMiddleware, gamesServiceProxy);

// --- Rutas de Reseñas ---
// Públicas
app.get('/api/reviews', reviewsServiceProxy);
app.get('/api/reviews/game/:gameId', reviewsServiceProxy);
app.get('/api/reviews/user/:userId', reviewsServiceProxy);
// Protegidas
app.post('/api/reviews', authMiddleware, reviewsServiceProxy);
app.put('/api/reviews/:id', authMiddleware, reviewsServiceProxy);
app.delete('/api/reviews/:id', authMiddleware, reviewsServiceProxy);


const PORT = process.env.API_GATEWAY_PORT || 4000;

app.listen(PORT, () => {
    console.log(`API Gateway corriendo en el puerto ${PORT}`);
});
