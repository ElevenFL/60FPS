const mongoose = require('mongoose');

class ReviewController {
    constructor(reviewUseCases) {
        this.reviewUseCases = reviewUseCases;
    }

    async createReview(req, res) {
        try {
            const { gameId } = req.params;
            const userId = req.user?.id;
            const username = req.user?.username;

            if (!userId || !username) {
                return res.status(401).json({ message: 'No autorizado' });
            }

            if (!gameId || !mongoose.Types.ObjectId.isValid(gameId)) {
                return res.status(400).json({ message: 'ID del juego inválido' });
            }

            const { rating, content } = req.body;

            if (!rating || !content) {
                return res.status(400).json({ 
                    message: 'Se requieren calificación y contenido' 
                });
            }

            if (typeof rating !== 'number' || rating < 1 || rating > 5) {
                return res.status(400).json({ 
                    message: 'La calificación debe ser un número entre 1 y 5' 
                });
            }

            if (typeof content !== 'string' || content.trim().length < 10) {
                return res.status(400).json({ 
                    message: 'La reseña debe tener al menos 10 caracteres' 
                });
            }

            const review = await this.reviewUseCases.createReview(userId, gameId, {
                rating,
                content: content.trim(),
                username
            });

            res.status(201).json(review);
        } catch (error) {
            console.error('Error al crear reseña:', error);
            if (error.message.includes('juego no existe')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('ya has realizado')) {
                return res.status(409).json({ message: error.message });
            }
            res.status(400).json({ message: error.message });
        }
    }

    async updateReview(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const review = await this.reviewUseCases.updateReview(id, userId, req.body);
            res.json(review);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteReview(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            await this.reviewUseCases.deleteReview(id, userId);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getGameReviews(req, res) {
        try {
            const { gameId } = req.params;
            const reviews = await this.reviewUseCases.getGameReviews(gameId);
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getUserReviews(req, res) {
        try {
            const userId = req.user.id;
            const reviews = await this.reviewUseCases.getUserReviews(userId);
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getReview(req, res) {
        try {
            const { id } = req.params;
            const review = await this.reviewUseCases.getReview(id);
            res.json(review);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}

module.exports = ReviewController; 