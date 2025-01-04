import React, { useEffect, useState } from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const WorkoutReviews = ({ planId, isOpen, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!planId || !isOpen) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`/feedback/plan-reviews/${planId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(data);
        setFilteredReviews(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && planId) {
      fetchReviews();
    }
  }, [planId, isOpen]);

  useEffect(() => {
    if (selectedRating === 0) {
      setFilteredReviews(reviews);
    } else {
      const filtered = reviews.filter(review => review.rating === selectedRating);
      setFilteredReviews(filtered);
    }
  }, [selectedRating, reviews]);

  const getFullName = (review) => {
    const firstName = review.Firstname || '';
    const lastName = review.Lastname || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || 'Anonymous User';
  };

  const getInitial = (review) => {
    return review.Firstname?.charAt(0) || 'U';
  };

  const getRatingCount = (rating) => {
    return reviews.filter(review => review.rating === rating).length;
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingPercentage = (rating) => {
    if (reviews.length === 0) return 0;
    return (getRatingCount(rating) / reviews.length) * 100;
  };

  const CloseButton = () => (
    <button 
      onClick={onClose}
      className="absolute -top-3 -right-3 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors z-50 group"
      aria-label="Close dialog"
    >
      <div className="relative w-5 h-5">
        <span className="absolute top-1/2 left-0 w-5 h-0.5 bg-gray-600 group-hover:bg-gray-800 transform -rotate-45 transition-colors"></span>
        <span className="absolute top-1/2 left-0 w-5 h-0.5 bg-gray-600 group-hover:bg-gray-800 transform rotate-45 transition-colors"></span>
      </div>
    </button>
  );

  const RecommendationStatus = ({ isRecommended }) => (
    <div className={`flex items-center gap-1 text-sm ${
      isRecommended ? 'text-green-600' : 'text-red-600'
    }`}>
      {isRecommended ? (
        <>
          <ThumbsUp className="h-4 w-4" />
          <span>Recommended</span>
        </>
      ) : (
        <>
          <ThumbsDown className="h-4 w-4" />
          <span>Not Recommended</span>
        </>
      )}
    </div>
  );

  const RatingSummary = () => (
    <div className="p-6 border-b">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">{getAverageRating()}</div>
          <div className="text-sm text-gray-500">/5</div>
          <div className="text-sm text-gray-500 mt-1">{reviews.length} Ratings</div>
        </div>
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(rating)}
              className="flex items-center w-full mb-1 group cursor-pointer"
            >
              <div className="flex items-center gap-1 w-20">
                <span className="text-sm text-gray-600">{rating}</span>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 group-hover:bg-yellow-500 transition-all"
                  style={{ width: `${getRatingPercentage(rating)}%` }}
                />
              </div>
              <span className="w-12 text-right text-sm text-gray-600 ml-2">
                {getRatingCount(rating)}
              </span>
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => setSelectedRating(0)}
        className={`w-full px-4 py-2 rounded-lg ${
          selectedRating === 0 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Show All Reviews
      </button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[5000px] h-[600px] flex flex-col p-0">
        <div className="relative">
          <CloseButton />
          <DialogHeader className="flex justify-center items-center border-b p-6 bg-white">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Workout Plan Reviews
            </DialogTitle>
          </DialogHeader>
        </div>

        <RatingSummary />

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center p-4 text-gray-500">
              {selectedRating === 0 ? 'No reviews yet' : `No ${selectedRating}-star reviews yet`}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReviews.map((review, index) => (
                <div 
                  key={review.feedback_id || index} 
                  className="bg-slate-50 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {getInitial(review)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {getFullName(review)}
                      </p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 break-words">
                    {review.feedback}
                  </p>
                  <RecommendationStatus isRecommended={review.recommend_status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutReviews;