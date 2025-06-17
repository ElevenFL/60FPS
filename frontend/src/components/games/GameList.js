import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ReviewForm from '../reviews/ReviewForm';
import ReviewList from '../reviews/ReviewList';
import './GameList.css';

const GameList = () => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGame, setSelectedGame] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const response = await axios.get('/api/games');
            console.log('Respuesta de la API inicial:', response.data); // Log para depurar

            if (Array.isArray(response.data)) {
                setGames(response.data);
            } else {
                console.warn('La respuesta de la API inicial no es un array:', response.data);
                setGames([]); // Prevenir crash
            }
        } catch (error) {
            console.error('Error al cargar los videojuegos:', error);
            setError('Error al cargar los videojuegos. Ver la consola para más detalles.');
        } finally {
            setLoading(false); // Asegurarse de que loading siempre termine
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`/api/games/search?query=${searchQuery}`);
            console.log('Respuesta de la API de búsqueda:', response.data); // Mantenemos esto para depurar

            // Verificación defensiva: asegurar que la respuesta sea un array
            if (Array.isArray(response.data)) {
                setGames(response.data);
            } else {
                console.warn('La respuesta de la API no es un array:', response.data);
                setGames([]); // Establecer un array vacío para prevenir el crash
            }
        } catch (error) {
            console.error('Error al buscar videojuegos:', error); // Registrar el objeto de error completo
            setError('Error al buscar videojuegos. Ver la consola para más detalles.');
        }
    };

    const handleGameClick = (gameId, e) => {
        // Evitar la navegación si se hizo clic en el botón de reseña
        if (e.target.closest('.review-button')) {
            return;
        }
        navigate(`/games/${gameId}`);
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="game-list">
            <div className="search-bar">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar videojuegos..."
                    />
                    <button type="submit">Buscar</button>
                </form>
            </div>

            <div className="games-grid">
                {games.map(game => (
                    <div 
                        key={game._id} 
                        className="game-card"
                        onClick={(e) => handleGameClick(game._id, e)}
                    >
                        <h3>{game.title}</h3>

                        {game.imageUrl ? (
                            <div className="game-image">
                                <img 
                                    src={game.imageUrl} 
                                    alt={game.title}
                                    onError={(e) => e.currentTarget.style.display = 'none'} // oculta si falla imagen
                                    loading="lazy"
                                />
                            </div>
                        ) : null}

                        <p>{game.description}</p>
                        <div className="game-info">
                            <span>Género: {game.genre}</span>
                            <span>Plataforma: {game.platform}</span>
                            <div className="rating">
                                Rating: {game.averageRating.toFixed(1)} ⭐
                                ({game.totalReviews} reseñas)
                            </div>
                        </div>
                        <div className="game-actions">
                            {user && (
                                <button 
                                    onClick={() => {
                                        setSelectedGame(game);
                                        setShowReviewForm(true);
                                    }}
                                    className="review-button"
                                >
                                    Escribir Reseña
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {user && showReviewForm && selectedGame && (
                <div className="review-section">
                    <h3>Escribir Reseña para {selectedGame.title}</h3>
                    <ReviewForm 
                        gameId={selectedGame._id} 
                        onReviewSubmit={() => {
                            setShowReviewForm(false);
                            setSelectedGame(null);
                            fetchGames();
                        }} 
                    />
                    <button 
                        onClick={() => {
                            setShowReviewForm(false);
                            setSelectedGame(null);
                        }}
                        className="cancel-button"
                    >
                        Cancelar
                    </button>
                </div>
            )}
        </div>
    );
};

export default GameList; 