import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GameSearch from './GameSearch';
import './AddGame.css';

const AddGame = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        genre: '',
        platform: '',
        releaseDate: '',
        imageUrl: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGameSelect = (gameData) => {
        setFormData(prev => ({
            ...prev,
            ...gameData
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!localStorage.getItem('token')) {
            setError('Debes iniciar sesión para agregar un videojuego');
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/games', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            navigate('/games');
        } catch (error) {
            setError(error.response?.data?.message || 'Error al agregar el videojuego');
            setLoading(false);
        }
    };

    return (
        <div className="add-game-container">
            <h2>Agregar Nuevo Videojuego</h2>
            {error && <div className="error-message">{error}</div>}

            <GameSearch onGameSelect={handleGameSelect} />

            <form onSubmit={handleSubmit} className="add-game-form">
                <div className="form-group">
                    <label>Título:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Ingrese el título del videojuego"
                    />
                </div>

                <div className="form-group">
                    <label>Descripción:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Ingrese la descripción del videojuego"
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label>Género:</label>
                    <select
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un género</option>
                        <option value="Acción">Acción</option>
                        <option value="Aventura">Aventura</option>
                        <option value="RPG">RPG</option>
                        <option value="Estrategia">Estrategia</option>
                        <option value="Deportes">Deportes</option>
                        <option value="Carreras">Carreras</option>
                        <option value="Puzzle">Puzzle</option>
                        <option value="Simulación">Simulación</option>
                        <option value="Terror">Terror</option>
                        <option value="Multijugador">Multijugador</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Plataforma:</label>
                    <select
                        name="platform"
                        value={formData.platform}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione una plataforma</option>
                        <option value="PC">PC</option>
                        <option value="PlayStation 5">PlayStation 5</option>
                        <option value="PlayStation 4">PlayStation 4</option>
                        <option value="Xbox Series X/S">Xbox Series X/S</option>
                        <option value="Xbox One">Xbox One</option>
                        <option value="Nintendo Switch">Nintendo Switch</option>
                        <option value="Mobile">Mobile</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Fecha de Lanzamiento:</label>
                    <input
                        type="date"
                        name="releaseDate"
                        value={formData.releaseDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>URL de la Imagen:</label>
                    <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="Ingrese la URL de la imagen del videojuego"
                    />
                    {formData.imageUrl && (
                        <div className="image-preview">
                            <img
                                src={formData.imageUrl}
                                alt="Vista previa"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Agregando...' : 'Agregar Videojuego'}
                    </button>
                    <button 
                        type="button" 
                        className="cancel-button"
                        onClick={() => navigate('/games')}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddGame; 