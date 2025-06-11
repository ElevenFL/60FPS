import React, { useState } from 'react';
import axios from 'axios';
import './GameSearch.css';

const RAWG_API_KEY = '40f2404561e14fd7b9fae177d4aeacbc';

const GameSearch = ({ onGameSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const searchGames = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`https://api.rawg.io/api/games`, {
                params: {
                    key: RAWG_API_KEY,
                    search: searchQuery,
                    page_size: 5
                }
            });

            setSearchResults(response.data.results);
        } catch (error) {
            setError('Error al buscar juegos');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGameSelect = async (gameId) => {
        try {
            const response = await axios.get(`https://api.rawg.io/api/games/${gameId}`, {
                params: {
                    key: RAWG_API_KEY
                }
            });

            const gameData = response.data;
            
            // Mapear los datos de RAWG a nuestro formato
            const mappedGame = {
                title: gameData.name,
                description: gameData.description_raw || gameData.description,
                genre: gameData.genres?.[0]?.name || '',
                platform: gameData.platforms?.[0]?.platform?.name || '',
                releaseDate: gameData.released,
                imageUrl: gameData.background_image
            };

            onGameSelect(mappedGame);
            setSearchResults([]);
            setSearchQuery('');
        } catch (error) {
            setError('Error al obtener detalles del juego');
            console.error('Error:', error);
        }
    };

    return (
        <div className="game-search">
            <form onSubmit={searchGames} className="search-form">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar juego..."
                    className="search-input"
                />
                <button type="submit" className="search-button" disabled={loading}>
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {searchResults.length > 0 && (
                <div className="search-results">
                    {searchResults.map(game => (
                        <div 
                            key={game.id} 
                            className="search-result-item"
                            onClick={() => handleGameSelect(game.id)}
                        >
                            {game.background_image && (
                                <img 
                                    src={game.background_image} 
                                    alt={game.name}
                                    className="game-thumbnail"
                                />
                            )}
                            <div className="game-info">
                                <h3>{game.name}</h3>
                                <p>Plataformas: {game.platforms?.map(p => p.platform.name).join(', ')}</p>
                                <p>Fecha de lanzamiento: {game.released}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GameSearch; 