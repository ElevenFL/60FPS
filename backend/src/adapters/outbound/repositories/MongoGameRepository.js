const mongoose = require('mongoose');
const GameRepository = require('../../../domain/ports/repositories/GameRepository');
const Game = require('../../../domain/entities/Game');

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date
    },
    genre: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

gameSchema.index({ title: 'text', genre: 'text' });

const GameModel = mongoose.model('Game', gameSchema);

class MongoGameRepository extends GameRepository {
    async findById(id) {
        const gameDoc = await GameModel.findById(id);
        return gameDoc ? this._toDomain(gameDoc) : null;
    }

    async findAll() {
        const games = await GameModel.find();
        return games.map(game => this._toDomain(game));
    }

    async create(gameData) {
        const gameDoc = new GameModel(gameData);
        const savedGame = await gameDoc.save();
        return this._toDomain(savedGame);
    }

    async update(id, gameData) {
        const updatedGame = await GameModel.findByIdAndUpdate(
            id,
            gameData,
            { new: true }
        );
        return updatedGame ? this._toDomain(updatedGame) : null;
    }

    async delete(id) {
        const deletedGame = await GameModel.findByIdAndDelete(id);
        return deletedGame ? this._toDomain(deletedGame) : null;
    }

    async search(query) {
        const games = await GameModel.find(
            { $text: { $search: query } },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } });
        return games.map(game => this._toDomain(game));
    }

    _toDomain(gameDoc) {
        return new Game({
            id: gameDoc._id.toString(),
            title: gameDoc.title,
            description: gameDoc.description,
            releaseDate: gameDoc.releaseDate,
            genre: gameDoc.genre,
            platform: gameDoc.platform,
            imageUrl: gameDoc.imageUrl,
            averageRating: gameDoc.averageRating,
            totalReviews: gameDoc.totalReviews,
            createdAt: gameDoc.createdAt
        });
    }
}

module.exports = MongoGameRepository; 