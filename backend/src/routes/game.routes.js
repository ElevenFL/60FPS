const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');
const auth = require('../middleware/auth.middleware');

// Rutas públicas
router.get('/', gameController.getAllGames);
router.get('/search', gameController.searchGames);
router.get('/:id', gameController.getGameById);

// Rutas protegidas (requieren autenticación)
router.post('/', auth, gameController.createGame);
router.put('/:id', auth, gameController.updateGame);
router.delete('/:id', auth, gameController.deleteGame);

module.exports = router; 