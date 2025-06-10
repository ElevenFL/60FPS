import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ gameId, onReviewSubmit }) => {
    const [formData, setFormData] = useState({
        rating: 5,
        content: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rating' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!localStorage.getItem('token')) {
            setError('Debes iniciar sesión para escribir una reseña');
            return;
        }

        try {
            await axios.post('/api/reviews', {
                gameId,
                ...formData
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setFormData({ rating: 5, content: '' });
            if (onReviewSubmit) onReviewSubmit();
        } catch (error) {
            setError(error.response?.data?.message || 'Error al crear la reseña');
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
                        placeholder="Escribe tu reseña aquí..."
                    />
                </div>

                <button type="submit">Publicar Reseña</button>
            </form>
        </div>
    );
};

export default ReviewForm; 