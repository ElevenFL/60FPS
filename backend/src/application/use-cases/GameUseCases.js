class GameUseCases {
    constructor(gameRepository) {
        this.gameRepository = gameRepository;
    }

    async getGameById(id) {
        return await this.gameRepository.findById(id);
    }

    async getAllGames() {
        return await this.gameRepository.findAll();
    }

    async createGame(gameData) {
        return await this.gameRepository.create(gameData);
    }

    async updateGame(id, gameData) {
        return await this.gameRepository.update(id, gameData);
    }

    async deleteGame(id) {
        return await this.gameRepository.delete(id);
    }

    async searchGames(query) {
        return await this.gameRepository.search(query);
    }
}

module.exports = GameUseCases; 