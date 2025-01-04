import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const PremiumRating = ({ rating }) => {
  if (!rating) return null;
  
  // Calculate full and partial stars
  const fullStars = Math.floor(rating.average);
  const hasHalfStar = rating.average % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-2 shadow-sm mt-2 w-fit">
      <div className="flex items-center">
        {/* Render full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star 
            key={`star-${i}`}
            className="h-4 w-4 fill-yellow-400 text-yellow-400 transition-transform hover:scale-110"
          />
        ))}
        
        {/* Render half star if needed */}
        {hasHalfStar && (
          <StarHalf 
            className="h-4 w-4 fill-yellow-400 text-yellow-400 transition-transform hover:scale-110"
          />
        )}
        
        {/* Render empty stars */}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star 
            key={`empty-star-${i}`}
            className="h-4 w-4 text-gray-300"
          />
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          {rating.average.toFixed(1)}
        </span>
        <span className="text-xs text-gray-500">
          ({rating.count.toLocaleString()} reviews)
        </span>
      </div>
    </div>
  );
};

export default PremiumRating;