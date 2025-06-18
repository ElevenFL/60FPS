const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

// Rutas Publicas
router.get('/', reviewController.getAllReviews);
router.get('/game/:gameId', reviewController.getReviewsByGame);
router.get('/user/:userId', reviewController.getReviewsByUser);

// Rutas que requieren al Usuario
router.post('/', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
