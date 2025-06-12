const express = require('express');
const router = express.Router();
const container = require('../../../infrastructure/config/container');
const authMiddleware = require('../../../infrastructure/middleware/auth');

const reviewController = container.getReviewController();

// Rutas públicas
router.get('/game/:gameId', reviewController.getGameReviews.bind(reviewController));

// Rutas protegidas
router.post('/game/:gameId', authMiddleware, reviewController.createReview.bind(reviewController));
router.put('/:id', authMiddleware, reviewController.updateReview.bind(reviewController));
router.delete('/:id', authMiddleware, reviewController.deleteReview.bind(reviewController));

module.exports = router; 