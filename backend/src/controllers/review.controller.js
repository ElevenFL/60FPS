const Review = require('../models/review.model');
const Game = require('../models/game.model');

// Obtener todas las reseñas
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'username')
            .populate('game', 'title')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener reseñas',
            error: error.message 
        });
    }
};

// Obtener reseñas por videojuego
exports.getReviewsByGame = async (req, res) => {
    try {
        const reviews = await Review.find({ game: req.params.gameId })
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener reseñas del videojuego',
            error: error.message 
        });
    }
};

// Obtener reseñas por usuario
exports.getReviewsByUser = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.params.userId })
            .populate('game', 'title')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener reseñas del usuario',
            error: error.message 
        });
    }
};

// Crear una nueva reseña
exports.createReview = async (req, res) => {
    try {
        const { gameId, rating, content } = req.body;
        
        // Verificar si el usuario ya tiene una reseña para este juego
        const existingReview = await Review.findOne({
            user: req.userId,
            game: gameId
        });

        if (existingReview) {
            return res.status(400).json({ 
                message: 'Ya has creado una reseña para este juego' 
            });
        }

        const review = new Review({
            user: req.userId,
            game: gameId,
            rating,
            content
        });

        await review.save();
        
        const populatedReview = await Review.findById(review._id)
            .populate('user', 'username')
            .populate('game', 'title');

        res.status(201).json(populatedReview);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al crear reseña',
            error: error.message 
        });
    }
};

// Actualizar una reseña
exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!review) {
            return res.status(404).json({ 
                message: 'Reseña no encontrada o no tienes permiso para editarla' 
            });
        }

        review.rating = req.body.rating || review.rating;
        review.content = req.body.content || review.content;
        review.updatedAt = Date.now();

        await review.save();
        
        const updatedReview = await Review.findById(review._id)
            .populate('user', 'username')
            .populate('game', 'title');

        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al actualizar reseña',
            error: error.message 
        });
    }
};

// Eliminar una reseña
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!review) {
            return res.status(404).json({ 
                message: 'Reseña no encontrada o no tienes permiso para eliminarla' 
            });
        }

        res.json({ message: 'Reseña eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al eliminar reseña',
            error: error.message 
        });
    }
}; 