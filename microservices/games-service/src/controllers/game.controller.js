const Game = require('../models/game.model');

// Obtener todos los videojuegos
exports.getAllGames = async (req, res) => {
    try {
        const games = await Game.find()
            .sort({ averageRating: -1 });
        res.json(games);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener videojuegos',
            error: error.message 
        });
    }
};

// Obtener un videojuego por ID
exports.getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Videojuego no encontrado' });
        }
        res.json(game);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener videojuego',
            error: error.message 
        });
    }
};

// Crear un nuevo videojuego
exports.createGame = async (req, res) => {
    try {
        const game = new Game(req.body);
        await game.save();
        res.status(201).json(game);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al crear videojuego',
            error: error.message 
        });
    }
};

// Actualizar un videojuego
exports.updateGame = async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!game) {
            return res.status(404).json({ message: 'Videojuego no encontrado' });
        }
        res.json(game);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al actualizar videojuego',
            error: error.message 
        });
    }
};

// Eliminar un videojuego
exports.deleteGame = async (req, res) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Videojuego no encontrado' });
        }
        res.json({ message: 'Videojuego eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al eliminar videojuego',
            error: error.message 
        });
    }
};

// Buscar videojuegos
exports.searchGames = async (req, res) => {
    try {
        const { query } = req.query;
        const games = await Game.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { genre: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar videojuegos' });
    }
};
