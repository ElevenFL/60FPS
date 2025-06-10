import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditGame.css';

const EditGame = () => {
    const { id } = useParams();
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
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState('');
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        fetchGame();
    }, [id]);

    const fetchGame = async () => {
        try {
            const response = await axios.get(`/api/games/${id}`);
            const game = response.data;
            setFormData({
                title: game.title,
                description: game.description,
                genre: game.genre,
                platform: game.platform,
                releaseDate: new Date(game.releaseDate).toISOString().split('T')[0],
                imageUrl: game.imageUrl || ''
            });
            if (game.imageUrl) {
                setImagePreview(game.imageUrl);
            }
            setLoading(false);
        } catch (error) {
            setError('Error al cargar el videojuego');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'imageUrl') {
            setImagePreview(value);
            setImageError(false);
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const validateImageUrl = (url) => {
        if (!url) return true;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!localStorage.getItem('token')) {
            setError('Debes iniciar sesión para editar un videojuego');
            return;
        }

        if (formData.imageUrl && !validateImageUrl(formData.imageUrl)) {
            setError('La URL de la imagen no es válida');
            return;
        }

        try {
            await axios.put(`/api/games/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            navigate(`/games/${id}`);
        } catch (error) {
            setError(error.response?.data?.message || 'Error al actualizar el videojuego');
        }
    };

    if (loading) return <div className="loading">Cargando...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="edit-game-container">
            <h2>Editar Videojuego</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="edit-game-form">
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
                            {imageError ? (
                                <div className="image-error">
                                    No se pudo cargar la imagen
                                </div>
                            ) : (
                                <img
                                    src={imagePreview}
                                    alt="Vista previa"
                                    onError={handleImageError}
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-button">
                        Guardar Cambios
                    </button>
                    <button 
                        type="button" 
                        className="cancel-button"
                        onClick={() => navigate(`/games/${id}`)}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditGame; 