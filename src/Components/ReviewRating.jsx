import React, { useState, useEffect } from 'react';
import { Star } from 'react-feather';
import apiService from '../services/api';

const ReviewRating = ({ tourId, compact = false }) => {
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    loadRating();
  }, [tourId]);

  const loadRating = async () => {
    try {
      const response = await apiService.request(`/reviews/${tourId}`);
      setAvgRating(response.avgRating || 0);
      setTotalReviews(response.totalReviews || 0);
    } catch (error) {
      console.error('Error loading rating');
    }
  };

  if (totalReviews === 0) {
    return (
      <div className="flex items-center gap-1">
        <Star size={16} className="text-gray-300" />
        <span className="text-gray-500 text-sm">Sin reseñas</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Star size={16} className="text-yellow-400" fill="currentColor" />
      <span className="font-semibold">{avgRating}</span>
      <span className={compact ? "text-gray-600" : ""}>
        ({totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'})
      </span>
    </div>
  );
};

export default ReviewRating;