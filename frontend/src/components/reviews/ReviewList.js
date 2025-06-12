import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReviewList = ({ gameId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        if (gameId) {
            fetchReviews();
        }
    }, [gameId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get(`/api/reviews/game/${gameId}`);
            setReviews(response.data);
        } catch (error) {
            console.error('Error al cargar las reseñas:', error);
            setError(error.response?.data?.message || 'Error al cargar las reseñas');
        } finally {
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
                console.error('Error al eliminar la reseña:', error);
                setError(error.response?.data?.message || 'Error al eliminar la reseña');
            }
        }
    };

    if (loading) return <div className="loading">Cargando reseñas...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!reviews || reviews.length === 0) return <div className="no-reviews">No hay reseñas aún</div>;

    return (
        <div className="review-list">
            {reviews.map(review => (
                <div key={review.id} className="review-card">
                    <div className="review-header">
                        <h4>{review.user?.username || 'Usuario anónimo'}</h4>
                        <div className="rating">
                            {'⭐'.repeat(review.rating)}
                        </div>
                        <span className="date">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    
                    <p className="review-content">{review.content}</p>
                    
                    {currentUser && review.user && currentUser.id === review.user.id && (
                        <div className="review-actions">
                            <button 
                                onClick={() => navigate(`/reviews/${review.id}/edit`)}
                                className="edit-button"
                            >
                                Editar
                            </button>
                            <button 
                                onClick={() => handleDelete(review.id)}
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