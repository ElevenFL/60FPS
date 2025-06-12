class ReviewRepository {
    async findById(id) {
        throw new Error('Method not implemented');
    }

    async findByGameId(gameId) {
        throw new Error('Method not implemented');
    }

    async findByUserId(userId) {
        throw new Error('Method not implemented');
    }

    async findByGameAndUser(gameId, userId) {
        throw new Error('Method not implemented');
    }

    async create(review) {
        throw new Error('Method not implemented');
    }

    async update(id, review) {
        throw new Error('Method not implemented');
    }

    async delete(id) {
        throw new Error('Method not implemented');
    }

    async getGameAverageRating(gameId) {
        throw new Error('Method not implemented');
    }
}

module.exports = ReviewRepository; 