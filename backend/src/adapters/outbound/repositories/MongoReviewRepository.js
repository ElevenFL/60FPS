const mongoose = require('mongoose');
const ReviewRepository = require('../../../domain/ports/repositories/ReviewRepository');
const Review = require('../../../domain/entities/Review');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    content: {
        type: String,
        required: true,
        minlength: 10
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

reviewSchema.index({ game: 1, user: 1 }, { unique: true });

const ReviewModel = mongoose.model('Review', reviewSchema);

class MongoReviewRepository extends ReviewRepository {
    async findById(id) {
        const reviewDoc = await ReviewModel.findById(id)
            .populate('user', 'username')
            .populate('game', 'title');
        return reviewDoc ? this._toDomain(reviewDoc) : null;
    }

    async findByGameId(gameId) {
        const reviews = await ReviewModel.find({ game: gameId })
            .populate('user', 'username')
            .populate('game', 'title');
        return reviews.map(review => this._toDomain(review));
    }

    async findByUserId(userId) {
        const reviews = await ReviewModel.find({ user: userId })
            .populate('user', 'username')
            .populate('game', 'title');
        return reviews.map(review => this._toDomain(review));
    }

    async findByGameAndUser(gameId, userId) {
        const reviewDoc = await ReviewModel.findOne({ game: gameId, user: userId })
            .populate('user', 'username')
            .populate('game', 'title');
        return reviewDoc ? this._toDomain(reviewDoc) : null;
    }

    async create(review) {
        const reviewDoc = new ReviewModel({
            user: review.userId,
            game: review.gameId,
            rating: review.rating,
            content: review.content
        });
        const savedReview = await reviewDoc.save();
        const populatedReview = await ReviewModel.findById(savedReview._id)
            .populate('user', 'username')
            .populate('game', 'title');
        return this._toDomain(populatedReview);
    }

    async update(id, review) {
        const updatedReview = await ReviewModel.findByIdAndUpdate(
            id,
            {
                rating: review.rating,
                content: review.content,
                updatedAt: new Date()
            },
            { new: true }
        ).populate('user', 'username')
         .populate('game', 'title');
        return updatedReview ? this._toDomain(updatedReview) : null;
    }

    async delete(id) {
        const deletedReview = await ReviewModel.findByIdAndDelete(id);
        return deletedReview ? this._toDomain(deletedReview) : null;
    }

    async getGameAverageRating(gameId) {
        const result = await ReviewModel.aggregate([
            { $match: { game: new mongoose.Types.ObjectId(gameId) } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        if (result.length === 0) {
            return { averageRating: 0, totalReviews: 0 };
        }

        return {
            averageRating: result[0].averageRating,
            totalReviews: result[0].totalReviews
        };
    }

    _toDomain(reviewDoc) {
        return new Review({
            id: reviewDoc._id.toString(),
            userId: reviewDoc.user._id.toString(),
            gameId: reviewDoc.game._id.toString(),
            rating: reviewDoc.rating,
            content: reviewDoc.content,
            createdAt: reviewDoc.createdAt,
            updatedAt: reviewDoc.updatedAt,
            user: {
                id: reviewDoc.user._id.toString(),
                username: reviewDoc.user.username
            },
            game: {
                id: reviewDoc.game._id.toString(),
                title: reviewDoc.game.title
            }
        });
    }
}

module.exports = MongoReviewRepository; 