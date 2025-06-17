const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');

// Todas las rutas son públicas dentro del cluster de microservicios.
// La protección se aplicará en el API Gateway.

router.get('/', gameController.getAllGames);
router.get('/search', gameController.searchGames);
router.get('/:id', gameController.getGameById);
router.post('/', gameController.createGame);
router.put('/:id', gameController.updateGame);
router.delete('/:id', gameController.deleteGame);

module.exports = router;
