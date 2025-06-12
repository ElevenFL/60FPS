import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ gameId, onReviewSubmit }) => {
    const [formData, setFormData] = useState({
        rating: 5,
        content: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rating' ? parseInt(value) : value
        }));
        setError(''); // Limpiar error al cambiar el valor
    };

    const validateForm = () => {
        if (!formData.content.trim()) {
            setError('La reseña no puede estar vacía');
            return false;
        }
        if (formData.content.trim().length < 10) {
            setError('La reseña debe tener al menos 10 caracteres');
            return false;
        }
        if (formData.rating < 1 || formData.rating > 5) {
            setError('La calificación debe estar entre 1 y 5');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Debes iniciar sesión para escribir una reseña');
            return;
        }

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `/api/reviews/game/${gameId}`,
                {
                    rating: formData.rating,
                    content: formData.content.trim()
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setFormData({ rating: 5, content: '' });
            if (onReviewSubmit) onReviewSubmit();
        } catch (error) {
            console.error('Error al crear la reseña:', error);
            const errorMessage = error.response?.data?.message || 'Error al crear la reseña';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="review-form">
            <h3>Escribir Reseña</h3>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Calificación:</label>
                    <select
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        {[5, 4, 3, 2, 1].map(num => (
                            <option key={num} value={num}>
                                {num} {num === 1 ? 'estrella' : 'estrellas'}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Reseña:</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        minLength="10"
                        placeholder="Escribe tu reseña aquí (mínimo 10 caracteres)..."
                        disabled={loading}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Publicando...' : 'Publicar Reseña'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm; 