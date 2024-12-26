// feedback.jsx frontend component

import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Send, CheckCircle2, X } from 'lucide-react';

const COLORS = {
  primary: '#1A73E8',
  secondary: '#6200EE',
  accent: '#03DAC6',
  background: '#F4F7FA',
  text: '#2C3E50',
};

const PremiumRating = ({ rating, setRating, size = 40 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex justify-center items-center space-x-2 mb-4">
      <span className="text-lg font-semibold text-gray-600 mr-4">Rate Experience:</span>
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <Star
            key={index}
            size={size}
            className={`cursor-pointer transform transition-all duration-300 ease-in-out ${
              index <= (hover || rating)
                ? 'text-yellow-500 scale-110 drop-shadow-md'
                : 'text-gray-300 hover:text-yellow-300 hover:scale-105'
            }`}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          />
        );
      })}
    </div>
  );
};

const PremiumMemberFeedbackModal = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [recommendStatus, setRecommendStatus] = useState(null);
  const [submission, setSubmission] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmission(true);
    setTimeout(() => {
      setSubmission(false);
      onClose(); // Close modal after submission
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full mx-4 overflow-hidden">
        <div
          className="h-2 w-full"
          style={{
            background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
          }}
        />
        <div className="p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-extrabold text-gray-800">Your Fitness Journey Feedback</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <PremiumRating rating={rating} setRating={setRating} />

          <div className="flex justify-center space-x-6 mb-6">
            <button
              onClick={() => setRecommendStatus(true)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-full transition-all duration-300 ${
                recommendStatus === true
                  ? 'bg-green-500 text-white scale-105 shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:scale-105'
              }`}
            >
              <ThumbsUp size={24} />
              <span className="font-semibold">Recommend</span>
            </button>
            <button
              onClick={() => setRecommendStatus(false)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-full transition-all duration-300 ${
                recommendStatus === false
                  ? 'bg-red-500 text-white scale-105 shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:scale-105'
              }`}
            >
              <ThumbsDown size={24} />
              <span className="font-semibold">Not Recommend</span>
            </button>
          </div>

          <div className="relative mb-6">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your detailed experience..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[150px] transition-all duration-300 hover:border-blue-300"
            />
            <MessageCircle className="absolute top-4 right-4 text-gray-400" size={24} />
          </div>

          {!submission ? (
            <button
              onClick={handleSubmit}
              disabled={!rating}
              className={`w-full py-4 rounded-full transition-all duration-300 flex items-center justify-center space-x-3 ${
                rating
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send size={24} />
              <span className="font-bold">Submit Feedback</span>
            </button>
          ) : (
            <div className="w-full py-4 rounded-full bg-green-500 text-white flex items-center justify-center space-x-3">
              <CheckCircle2 size={24} />
              <span className="font-bold">Feedback Submitted Successfully!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumMemberFeedbackModal;
