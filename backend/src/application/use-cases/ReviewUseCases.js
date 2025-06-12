const Review = require('../../domain/entities/Review');

class ReviewUseCases {
    constructor(reviewRepository, gameRepository) {
        this.reviewRepository = reviewRepository;
        this.gameRepository = gameRepository;
    }

    async createReview(userId, gameId, reviewData) {
        if (!userId || !gameId) {
            throw new Error('Se requieren el ID del usuario y el ID del juego');
        }

        // Verificar que el juego existe
        const game = await this.gameRepository.findById(gameId);
        if (!game) {
            throw new Error('El juego no existe');
        }

        // Verificar si el usuario ya tiene una reseña para este juego
        const existingReview = await this.reviewRepository.findByGameAndUser(gameId, userId);
        if (existingReview) {
            throw new Error('Ya has realizado una reseña para este juego');
        }

        // Validar los datos de la reseña
        if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
            throw new Error('La calificación debe estar entre 1 y 5');
        }

        if (!reviewData.content || reviewData.content.trim().length < 10) {
            throw new Error('La reseña debe tener al menos 10 caracteres');
        }

        const review = new Review({
            userId,
            gameId,
            rating: reviewData.rating,
            content: reviewData.content.trim()
        });

        const savedReview = await this.reviewRepository.create(review);
        await this._updateGameRating(gameId);
        return savedReview;
    }

    async updateReview(id, userId, reviewData) {
        if (!id || !userId) {
            throw new Error('Se requieren el ID de la reseña y el ID del usuario');
        }

        const review = await this.reviewRepository.findById(id);
        if (!review) {
            throw new Error('Reseña no encontrada');
        }

        if (review.userId !== userId) {
            throw new Error('No tienes permiso para modificar esta reseña');
        }

        // Validar los datos de la reseña
        if (reviewData.rating && (reviewData.rating < 1 || reviewData.rating > 5)) {
            throw new Error('La calificación debe estar entre 1 y 5');
        }

        if (reviewData.content && reviewData.content.trim().length < 10) {
            throw new Error('La reseña debe tener al menos 10 caracteres');
        }

        review.update(
            reviewData.content ? reviewData.content.trim() : review.content,
            reviewData.rating || review.rating
        );

        const updatedReview = await this.reviewRepository.update(id, review);
        await this._updateGameRating(review.gameId);
        return updatedReview;
    }

    async deleteReview(id, userId) {
        if (!id || !userId) {
            throw new Error('Se requieren el ID de la reseña y el ID del usuario');
        }

        const review = await this.reviewRepository.findById(id);
        if (!review) {
            throw new Error('Reseña no encontrada');
        }

        if (review.userId !== userId) {
            throw new Error('No tienes permiso para eliminar esta reseña');
        }

        await this.reviewRepository.delete(id);
        await this._updateGameRating(review.gameId);
    }

    async getGameReviews(gameId) {
        if (!gameId) {
            throw new Error('Se requiere el ID del juego');
        }

        // Verificar que el juego existe
        const game = await this.gameRepository.findById(gameId);
        if (!game) {
            throw new Error('El juego no existe');
        }

        return await this.reviewRepository.findByGameId(gameId);
    }

    async getUserReviews(userId) {
        if (!userId) {
            throw new Error('Se requiere el ID del usuario');
        }
        return await this.reviewRepository.findByUserId(userId);
    }

    async getReview(id) {
        if (!id) {
            throw new Error('Se requiere el ID de la reseña');
        }

        const review = await this.reviewRepository.findById(id);
        if (!review) {
            throw new Error('Reseña no encontrada');
        }
        return review;
    }

    async _updateGameRating(gameId) {
        const { averageRating, totalReviews } = await this.reviewRepository.getGameAverageRating(gameId);
        await this.gameRepository.update(gameId, { averageRating, totalReviews });
    }
}

module.exports = ReviewUseCases; 