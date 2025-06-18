require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));

const PORT = process.env.AUTH_PORT || 4001;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('FATAL ERROR: MONGODB_URI no está definida en el archivo .env');
    process.exit(1);
}

const startServer = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('[auth-service] Conectado a MongoDB.');

        app.listen(PORT, () => {
            console.log(`[auth-service] Servicio corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('[auth-service] Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

startServer();
