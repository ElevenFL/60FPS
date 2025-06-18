const mongoose = require('mongoose');

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

reviewSchema.post('save', async function() {
    const Game = mongoose.model('Game');
    const game = await Game.findById(this.game);
    
    const reviews = await this.constructor.find({ game: this.game });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    
    game.averageRating = totalRating / reviews.length;
    game.totalReviews = reviews.length;
    await game.save();
});

reviewSchema.index({ game: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema); 