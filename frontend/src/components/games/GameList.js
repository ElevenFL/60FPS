import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const GameList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const response = await axios.get('/api/games');
            setGames(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error al cargar los videojuegos');
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`/api/games/search?query=${searchQuery}`);
            setGames(response.data);
        } catch (error) {
            setError('Error al buscar videojuegos');
        }
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
                    <div key={game._id} className="game-card">
                        <h3>{game.title}</h3>
                        <p>{game.description}</p>
                        <div className="game-info">
                            <span>Género: {game.genre}</span>
                            <span>Plataforma: {game.platform}</span>
                            <div className="rating">
                                Rating: {game.averageRating.toFixed(1)} ⭐
                                ({game.totalReviews} reseñas)
                            </div>
                        </div>
                        <Link to={`/games/${game._id}`} className="view-details">
                            Ver detalles
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameList; 