const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const auth = require('../middleware/auth.middleware');

// Rutas públicas
router.get('/', reviewController.getAllReviews);
router.get('/game/:gameId', reviewController.getReviewsByGame);
router.get('/user/:userId', reviewController.getReviewsByUser);

// Rutas protegidas (requieren autenticación)
router.post('/', auth, reviewController.createReview);
router.put('/:id', auth, reviewController.updateReview);
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router; 