class GameController {
    constructor(gameUseCases) {
        this.gameUseCases = gameUseCases;
    }

    async getGame(req, res) {
        try {
            const { id } = req.params;
            const game = await this.gameUseCases.getGameById(id);
            
            if (!game) {
                return res.status(404).json({ message: 'Juego no encontrado' });
            }
            res.json(game);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el juego', error: error.message });
        }
    }

    async getAllGames(req, res) {
        try {
            const games = await this.gameUseCases.getAllGames();
            res.json(games);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los juegos', error: error.message });
        }
    }

    async createGame(req, res) {
        try {
            const game = await this.gameUseCases.createGame(req.body);
            res.status(201).json(game);
        } catch (error) {
            res.status(400).json({ message: 'Error al crear el juego', error: error.message });
        }
    }

    async updateGame(req, res) {
        try {
            const game = await this.gameUseCases.updateGame(req.params.id, req.body);
            if (!game) {
                return res.status(404).json({ message: 'Juego no encontrado' });
            }
            res.json(game);
        } catch (error) {
            res.status(400).json({ message: 'Error al actualizar el juego', error: error.message });
        }
    }

    async deleteGame(req, res) {
        try {
            const game = await this.gameUseCases.deleteGame(req.params.id);
            if (!game) {
                return res.status(404).json({ message: 'Juego no encontrado' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el juego', error: error.message });
        }
    }

    async searchGames(req, res) {
        try {
            const { query } = req.query;
            const games = await this.gameUseCases.searchGames(query);
            res.json(games);
        } catch (error) {
            res.status(500).json({ message: 'Error al buscar juegos', error: error.message });
        }
    }
}

module.exports = GameController; 