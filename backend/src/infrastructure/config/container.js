const MongoGameRepository = require('../../adapters/outbound/repositories/MongoGameRepository');
const MongoUserRepository = require('../../adapters/outbound/repositories/MongoUserRepository');
const MongoReviewRepository = require('../../adapters/outbound/repositories/MongoReviewRepository');
const GameUseCases = require('../../application/use-cases/GameUseCases');
const UserUseCases = require('../../application/use-cases/UserUseCases');
const ReviewUseCases = require('../../application/use-cases/ReviewUseCases');
const GameController = require('../../adapters/inbound/controllers/GameController');
const UserController = require('../../adapters/inbound/controllers/UserController');
const ReviewController = require('../../adapters/inbound/controllers/ReviewController');

class Container {
    constructor() {
        // Repositorios
        this.gameRepository = new MongoGameRepository();
        this.userRepository = new MongoUserRepository();
        this.reviewRepository = new MongoReviewRepository();

        // Casos de uso
        this.gameUseCases = new GameUseCases(this.gameRepository);
        this.userUseCases = new UserUseCases(this.userRepository);
        this.reviewUseCases = new ReviewUseCases(this.reviewRepository, this.gameRepository);

        // Controladores
        this.gameController = new GameController(this.gameUseCases);
        this.userController = new UserController(this.userUseCases);
        this.reviewController = new ReviewController(this.reviewUseCases);
    }

    getGameController() {
        return this.gameController;
    }

    getUserController() {
        return this.userController;
    }

    getReviewController() {
        return this.reviewController;
    }
}

module.exports = new Container(); 