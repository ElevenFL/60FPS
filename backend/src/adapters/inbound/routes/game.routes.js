const express = require('express');
const router = express.Router();
const container = require('../../../infrastructure/config/container');
const authMiddleware = require('../../../infrastructure/middleware/auth');

const gameController = container.getGameController();

// Rutas
router.get('/search', gameController.searchGames.bind(gameController));
router.get('/:id', gameController.getGame.bind(gameController));
router.get('/', gameController.getAllGames.bind(gameController));
router.post('/', authMiddleware, gameController.createGame.bind(gameController));
router.put('/:id', authMiddleware, gameController.updateGame.bind(gameController));
router.delete('/:id', authMiddleware, gameController.deleteGame.bind(gameController));

module.exports = router; 