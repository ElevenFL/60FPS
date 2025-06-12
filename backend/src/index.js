const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Configuración de variables de entorno
dotenv.config();

// Importación de rutas
const authRoutes = require('./adapters/inbound/routes/auth.routes');
const gameRoutes = require('./adapters/inbound/routes/game.routes');
const reviewRoutes = require('./adapters/inbound/routes/review.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/game-reviews', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/reviews', reviewRoutes);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
}); 