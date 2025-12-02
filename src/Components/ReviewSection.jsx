import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, User, Trash2 } from 'react-feather';
import { useAuthContext } from '../context/AuthContext';
import apiService from '../services/api';

const ReviewSection = ({ tourId }) => {
  const { user } = useAuthContext();
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReviews();
    if (user) loadUserReview();
  }, [tourId, user]);

  const loadReviews = async () => {
    try {
      const response = await apiService.request(`/reviews/${tourId}`);
      setReviews(response.reviews || []);
      setAvgRating(response.avgRating || 0);
      setTotalReviews(response.totalReviews || 0);
    } catch (error) {
      console.error('Error loading reviews');
    }
  };

  const loadUserReview = async () => {
    try {
      const response = await apiService.request(`/reviews/${tourId}/user`);
      setUserReview(response.review);
      if (response.review) {
        setFormData({ rating: response.review.rating, comment: response.review.comment || '' });
      }
    } catch (error) {
      console.error('Error loading user review');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.request('/reviews', {
        method: 'POST',
        body: JSON.stringify({ tourId, ...formData })
      });
      setShowForm(false);
      loadReviews();
      loadUserReview();
    } catch (error) {
      alert('Error al enviar reseña');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar tu reseña?')) return;
    
    setLoading(true);
    try {
      await apiService.request(`/reviews/${tourId}`, { method: 'DELETE' });
      setUserReview(null);
      loadReviews();
    } catch (error) {
      alert('Error al eliminar reseña');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, readonly = false }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={20}
          className={`${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${!readonly ? 'cursor-pointer' : ''}`}
          fill={star <= rating ? 'currentColor' : 'none'}
          onClick={() => !readonly && onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Reseñas</h2>
        <div className="flex items-center gap-2">
          <Star size={20} className="text-yellow-400" fill="currentColor" />
          <span className="font-semibold">
            {avgRating > 0 ? `${avgRating} • ${totalReviews} reseñas` : 'Sin reseñas aún'}
          </span>
        </div>
      </div>

      {user && !userReview && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 mb-3">¿Ya tomaste este tour? ¡Comparte tu experiencia!</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Escribir reseña
          </button>
        </div>
      )}

      {user && userReview && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-green-800">Tu reseña</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(true)}
                className="text-green-600 text-sm hover:underline"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 text-sm hover:underline flex items-center gap-1"
              >
                <Trash2 size={12} />
                Eliminar
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={userReview.rating} readonly />
            <span className="text-sm text-gray-600">({userReview.rating}/5)</span>
          </div>
          {userReview.comment && (
            <p className="text-gray-700 italic">"{userReview.comment}"</p>
          )}
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="font-semibold mb-4">{userReview ? 'Editar' : 'Escribir'} reseña</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Calificación</label>
              <StarRating 
                rating={formData.rating} 
                onRatingChange={(rating) => setFormData({...formData, rating})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Comentario (opcional)</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                className="w-full p-3 border rounded-lg"
                rows="3"
                placeholder="Comparte tu experiencia..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar reseña'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.filter(review => review.user_id !== user?.id).map(review => (
            <div key={review.id} className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-start gap-4">
                {review.user_profile_image ? (
                  <img 
                    src={review.user_profile_image} 
                    alt={review.user_name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold">
                      {review.user_name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={review.rating} readonly />
                    <span className="text-sm text-gray-600">({review.rating}/5)</span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 leading-relaxed italic">"{review.comment}"</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="mx-auto mb-3" size={48} />
          <p>Sé el primero en dejar una reseña para este tour</p>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;