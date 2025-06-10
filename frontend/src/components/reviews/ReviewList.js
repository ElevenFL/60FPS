import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReviewList = ({ gameId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchReviews();
    }, [gameId]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`/api/reviews/game/${gameId}`);
            setReviews(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error al cargar las reseñas');
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
            try {
                await axios.delete(`/api/reviews/${reviewId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                fetchReviews();
            } catch (error) {
                setError('Error al eliminar la reseña');
            }
        }
    };

    if (loading) return <div>Cargando reseñas...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (reviews.length === 0) return <div>No hay reseñas aún</div>;

    return (
        <div className="review-list">
            {reviews.map(review => (
                <div key={review._id} className="review-card">
                    <div className="review-header">
                        <h4>{review.user.username}</h4>
                        <div className="rating">
                            {'⭐'.repeat(review.rating)}
                        </div>
                        <span className="date">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    
                    <p className="review-content">{review.content}</p>
                    
                    {localStorage.getItem('token') && 
                     JSON.parse(localStorage.getItem('user')).id === review.user._id && (
                        <div className="review-actions">
                            <button onClick={() => navigate(`/reviews/${review._id}/edit`)}>
                                Editar
                            </button>
                            <button 
                                onClick={() => handleDelete(review._id)}
                                className="delete-button"
                            >
                                Eliminar
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReviewList; 