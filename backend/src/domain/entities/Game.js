class Game {
    constructor({
        id,
        title,
        description,
        releaseDate,
        genre,
        platform,
        imageUrl,
        averageRating = 0,
        totalReviews = 0,
        createdAt = new Date()
    }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.releaseDate = releaseDate;
        this.genre = genre;
        this.platform = platform;
        this.imageUrl = imageUrl;
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
        this.createdAt = createdAt;
    }

    updateRating(newRating) {
        const totalRating = (this.averageRating * this.totalReviews) + newRating;
        this.totalReviews += 1;
        this.averageRating = totalRating / this.totalReviews;
    }
}

module.exports = Game; 