const express = require('express');
const router = express.Router();
const container = require('../../../infrastructure/config/container');
const authMiddleware = require('../../../infrastructure/middleware/auth');

const userController = container.getUserController();

// Rutas públicas
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));

// Rutas protegidas
router.get('/profile', authMiddleware, userController.getUser.bind(userController));
router.put('/profile', authMiddleware, userController.updateUser.bind(userController));
router.delete('/profile', authMiddleware, userController.deleteUser.bind(userController));

module.exports = router; 