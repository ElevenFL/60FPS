class Review {
    constructor({
        id,
        userId,
        gameId,
        rating,
        content,
        createdAt = new Date(),
        updatedAt = new Date(),
        user = undefined,
        game = undefined
    }) {
        this.id = id;
        this.userId = userId;
        this.gameId = gameId;
        this.rating = rating;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.user = user;
        this.game = game;
    }

    validate() {
        if (!this.userId) {
            throw new Error('El usuario es requerido');
        }
        if (!this.gameId) {
            throw new Error('El juego es requerido');
        }
        if (!this.rating || this.rating < 1 || this.rating > 5) {
            throw new Error('La calificación debe estar entre 1 y 5');
        }
        if (!this.content || this.content.length < 10) {
            throw new Error('El contenido debe tener al menos 10 caracteres');
        }
    }

    update(content, rating) {
        this.content = content;
        this.rating = rating;
        this.updatedAt = new Date();
        this.validate();
    }
}

module.exports = Review; 