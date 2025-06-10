import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewList from '../reviews/ReviewList';
import ReviewForm from '../reviews/ReviewForm';
import './GameDetail.css';

const GameDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [imageError, setImageError] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        fetchGame();
    }, [id]);

    const fetchGame = async () => {
        try {
            const response = await axios.get(`/api/games/${id}`);
            setGame(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error al cargar el videojuego');
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este videojuego?')) {
            try {
                await axios.delete(`/api/games/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                navigate('/games');
            } catch (error) {
                setError('Error al eliminar el videojuego');
            }
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    if (loading) return <div className="loading">Cargando...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!game) return <div>Videojuego no encontrado</div>;

    return (
        <div className="game-detail">
            <div className="game-header">
                <h1>{game.title}</h1>
                <div className="game-meta">
                    <span>Género: {game.genre}</span>
                    <span>Plataforma: {game.platform}</span>
                    <span>Fecha de lanzamiento: {new Date(game.releaseDate).toLocaleDateString()}</span>
                </div>
                <div className="game-rating">
                    <h3>Rating Promedio: {game.averageRating.toFixed(1)} ⭐</h3>
                    <p>Total de reseñas: {game.totalReviews}</p>
                </div>
            </div>

            {game.imageUrl && !imageError && (
                <div className="game-image">
                    <img 
                        src={game.imageUrl} 
                        alt={game.title}
                        onError={handleImageError}
                        loading="lazy"
                    />
                </div>
            )}

            {imageError && (
                <div className="image-error">
                    <p>No se pudo cargar la imagen del videojuego</p>
                </div>
            )}

            <div className="game-description">
                <h2>Descripción</h2>
                <p>{game.description}</p>
            </div>

            <div className="game-actions">
                {user && (
                    <>
                        <button 
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="review-button"
                        >
                            {showReviewForm ? 'Cancelar Reseña' : 'Escribir Reseña'}
                        </button>
                        <button 
                            onClick={() => navigate(`/games/${id}/edit`)}
                            className="edit-button"
                        >
                            Editar Videojuego
                        </button>
                        <button 
                            onClick={handleDelete} 
                            className="delete-button"
                        >
                            Eliminar Videojuego
                        </button>
                    </>
                )}
            </div>

            {showReviewForm && <ReviewForm gameId={id} onReviewSubmit={fetchGame} />}
            
            <div className="reviews-section">
                <h2>Reseñas</h2>
                <ReviewList gameId={id} />
            </div>
        </div>
    );
};

export default GameDetail; 