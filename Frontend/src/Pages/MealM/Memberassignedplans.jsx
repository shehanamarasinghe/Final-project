import React, { useState, useEffect } from 'react';
import { Star, X, AlertTriangle, CheckCircle } from 'lucide-react';
import {ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import Slidebar from '../../Components/MDashboardComponents/SlideBar/Slidebar';
import Navbar from '../../Components/MDashboardComponents/Navbar/Navbar';
 


const NutritionPieChart = ({ data }) => {
  const COLORS = ['#ff9eb3', '#64b5f6', '#ffd54f', '#4caf50'];

  const nutritionData = [
    { name: 'Carbohydrates', value: data.carbs || 63.37 },
    { name: 'Proteins', value: data.protein || 11.8 },
    { name: 'Vitamins', value: data.vitamins || 5.20 },
    { name: 'Calories', value: data.calories || 19.63 }
  ];

  const total = nutritionData.reduce((sum, entry) => sum + entry.value, 0);
  
  const dataWithPercentages = nutritionData.map(entry => ({
    ...entry,
    percentage: ((entry.value / total) * 100).toFixed(2) + '%'
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={dataWithPercentages}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
            label={({ name, percentage }) => `${name}: ${percentage}`}
          >
            {dataWithPercentages.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const Notification = ({ message, type }) => (
  <div className={`fixed top-4 right-4 w-72 p-4 rounded-lg shadow-lg ${
    type === 'error' ? 'bg-red-50' : 'bg-green-50'
  }`}>
    <div className="flex items-center gap-2">
      {type === 'error' ? (
        <AlertTriangle className="h-4 w-4 text-red-600" />
      ) : (
        <CheckCircle className="h-4 w-4 text-green-600" />
      )}
      <p className={type === 'error' ? 'text-red-600' : 'text-green-600'}>
        {message}
      </p>
    </div>
  </div>
);

const MealPlanCard = ({ isMain, onClick, plan, showReviewsModal, showRatingForm }) => {
  if (!plan) {
    return (
      <div className="meal-plan-card main p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-500">Loading meal plan...</p>
      </div>
    );
  }

  if (isMain) {
    return (
      <div className="meal-plan-card main" onClick={onClick}>
        <h2 className="text-xl font-bold mb-2 text-black">Meal Plan Details</h2>
        <p className="text-black"><strong>Category:</strong> {plan?.category_name || 'N/A'}</p>
        <p className="text-black"><strong>Total Calories:</strong> {plan?.total_calories || 'N/A'}</p>
        <p className="text-black"><strong>Date Created:</strong> {plan?.date_created ? new Date(plan.date_created).toLocaleDateString() : 'N/A'}</p>
        <h3 className="mt-4 mb-2 text-black">Foods:</h3>
        <ul className="list-disc list-inside text-black">
          {plan?.foodItems?.map((food, index) => (
            <li key={index}>{food.food_name} - {food.grams}g</li>
          )) || <li>No foods listed</li>}
        </ul>
        <div className="mt-4">
          <NutritionPieChart
            data={{
              carbs: plan?.total_carbs || 0,
              protein: plan?.total_protein || 0,
              vitamins: plan?.total_vitamins || 0,
              calories: plan?.total_calories || 0,
            }}
          />
        </div>
        <div className="flex justify-between mt-4">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105" 
            onClick={(e) => {
              e.stopPropagation();
              showReviewsModal();
            }}
          >
            View Reviews
          </button>
          <button 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105" 
            onClick={(e) => {
              e.stopPropagation();
              showRatingForm();
            }}
          >
            Rate Meal Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="meal-plan-card cursor-pointer bg-white border border-gray-200 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105" onClick={onClick}>
      <h2 className="text-lg font-bold mb-2 text-black">Meal Plan Details</h2>
      <p className="text-black"><strong>Category:</strong> {plan?.category_name || 'N/A'}</p>
      <p className="text-black"><strong>Total Calories:</strong> {plan?.total_calories || 'N/A'}</p>
      <p className="text-black"><strong>Date Created:</strong> {plan?.date_created ? new Date(plan.date_created).toLocaleDateString() : 'N/A'}</p>
    </div>
  );
};

const NoMealPlansModal = ({ isOpen, onClose, onRequest }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-semibold mb-3 text-red-500">No Meal Plans Assigned</h3>
        <p className="text-black text-base mb-4">You have not been assigned any meal plans yet.</p>

        <div className="flex justify-between">
          <button 
            onClick={() => {
              onRequest();
              onClose();
            }} 
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-base font-medium"
          >
            Request Meal Plan
          </button>

          <button 
            onClick={onClose} 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-base font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const StarRating = ({ rating, setRating }) => {
  const handleRating = (rate) => {
    setRating(rate);
  };

  return (
    <div className="flex mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
          onClick={() => handleRating(star)}
        />
      ))}
    </div>
  );
};

const MemberMealPlans = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showNoPlansModal, setShowNoPlansModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [recommendStatus, setRecommendStatus] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: Array(5).fill(0)
  });

  // Fetch reviews when the reviews modal is opened
  useEffect(() => {
    if (showReviewsModal && selectedMealPlan) {
      fetchReviews(selectedMealPlan.meal_plan_id);
    }
  }, [showReviewsModal, selectedMealPlan]);

  const fetchReviews = async (planId) => {
    setReviewsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(`/Mfeedback/plan-reviews/${planId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const reviewsData = await response.json();
      console.log('Fetched Reviews:', reviewsData);

      // Calculate review statistics
      const totalReviews = reviewsData.length;
      const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

      // Calculate rating breakdown
      const breakdown = Array(5).fill(0);
      reviewsData.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
          breakdown[review.rating - 1]++;
        }
      });

      setReviews(reviewsData);
      setReviewStats({
        averageRating,
        totalReviews,
        ratingBreakdown: breakdown
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showNotification('Failed to load reviews', 'error');
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fetch current user data when component mounts
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Fetch meal plans when user data is available
  useEffect(() => {
    if (currentUser) {
      fetchMealPlans();
    }
  }, [currentUser]);

  // Update selected meal plan when index changes or meal plans load
  useEffect(() => {
    if (mealPlans && mealPlans.length > 0) {
      setSelectedMealPlan(mealPlans[selectedIndex]);
    }
  }, [selectedIndex, mealPlans]);

  const handleShowRatingForm = (index) => {
    setSelectedIndex(index);
    setSelectedMealPlan(mealPlans[index]);
    setShowRatingForm(true);
  };

  const handleSelectMealPlan = (index) => {
    setSelectedIndex(index);
    setSelectedMealPlan(mealPlans[index]);
  };

  const submitFeedback = async () => {
    console.log('Current User State:', currentUser);
    console.log('Selected Meal Plan State:', selectedMealPlan);
    
    if (!currentUser || !selectedMealPlan) {
      console.log('Missing Data - Current User:', currentUser);
      console.log('Missing Data - Selected Meal Plan:', selectedMealPlan);
      showNotification("Please wait while we load your information.", "error");
      return;
    }

    // Use userid instead of id for user
    const userId = currentUser.userid;
    // Use meal_plan_id instead of id for meal plan
    const planId = selectedMealPlan.meal_plan_id;

    console.log('Extracted IDs - User ID:', userId);
    console.log('Extracted IDs - Plan ID:', planId);

    if (!userId || !planId) {
      showNotification("Missing user or plan information.", "error");
      return;
    }

    // Match the backend's expected property names
    const feedbackData = {
      user_id: userId,
      plan_id: planId,
      rating: rating,
      feedback: feedback,
      recommend_status: recommendStatus ? 1 : 0  // Convert boolean to 0/1
    };

    console.log('Final Feedback Data:', feedbackData);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification("Authentication token not found. Please log in again.", "error");
        return;
      }

      const response = await fetch("/Mfeedback/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(feedbackData),
      });

      console.log('Feedback Response:', response);

      if (response.ok) {
        showNotification("Feedback submitted successfully!", "success");
        setShowRatingForm(false);
        fetchMealPlans(); // Refresh the meal plans to show updated ratings
      } else {
        const errorText = await response.text(); // Get the raw error text
        console.error('Error Response:', errorText);
        showNotification(errorText || "Failed to submit feedback.", "error");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      showNotification("An error occurred while submitting feedback.", "error");
    }
  };

  const fetchMealPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      if (!token) throw new Error('No token found');

      const response = await fetch('/meals/meal-plans', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Meal Plans Response:', response);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Meal Plans Error:', errorData);
        throw new Error('Failed to fetch meal plans');
      }
      
      const data = await response.json();
      console.log('Fetched Meal Plans:', data); 

      if (Array.isArray(data)) {
        setMealPlans(data);
      } else {
        console.error('Unexpected data format:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      if (!token) throw new Error('No token found');

      const response = await fetch('/members/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Profile Response:', response);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Profile Error:', errorData);
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();
      console.log('User Data:', userData);
      
      setCurrentUser(userData);
    } catch (error) {
      console.error('Error fetching current user:', error);
      showNotification("Error fetching user data", "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="Mdashboard min-h-screen">
      <Slidebar />
      <div className="Dash-Container w-full">
        <Navbar />
        <div className="p-6 max-w-6xl mx-auto">
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
            />
          )}

          {loading ? (
            <div className="text-center text-black text-lg">
              Loading...
            </div>
          ) : (
            mealPlans.length > 0 ? (
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-2/3 p-4 bg-white rounded-lg shadow-md">
                  <MealPlanCard
                    plan={selectedMealPlan}
                    isMain={true}
                    showReviewsModal={() => setShowReviewsModal(true)}
                    showRatingForm={() => handleShowRatingForm(selectedIndex)}
                  />
                </div>

                <div className="flex flex-col gap-4 w-full lg:w-1/3">
                  {mealPlans.map((plan, index) => (
                    index !== selectedIndex && (
                      <div key={index} className="cursor-pointer" onClick={() => handleSelectMealPlan(index)}>
                        <MealPlanCard
                          plan={plan}
                          isMain={false}
                        />
                      </div>
                    )
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-black text-lg">
                No meal plans available.
              </div>
            )
          )}
  
          <NoMealPlansModal
            isOpen={showNoPlansModal}
            onClose={() => setShowNoPlansModal(false)}
            onRequest={() => showNotification('Meal plan request submitted!', 'success')}
          />
  
          {/* Rating Form Modal */}
          {showRatingForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                <button
                  onClick={() => setShowRatingForm(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
                <h3 className="text-xl font-semibold mb-4 text-black">Rate Meal Plan</h3>
                {/* Rating Section */}
                <StarRating rating={rating} setRating={setRating} />
                {/* Recommendation Buttons */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => setRecommendStatus(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      recommendStatus === true
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    } hover:bg-green-50 transition-colors`}
                  >
                    <ThumbsUp size={18} />
                    <span>Recommend</span>
                  </button>
                  <button
                    onClick={() => setRecommendStatus(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      recommendStatus === false
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    } hover:bg-red-50 transition-colors`}
                  >
                    <ThumbsDown size={18} />
                    <span>Not Recommend</span>
                  </button>
                </div>
                {/* Feedback Text Area */}
                <div className="mb-6">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Leave your feedback here..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {/* Submit Button */}
                <button
                  onClick={submitFeedback}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-full flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <Send size={18} />
                  <span>Submit Feedback</span>
                </button>
              </div>
            </div>
          )}
  
          {/* Reviews Modal */}
          {showReviewsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative overflow-y-auto max-h-[90vh]">
                <button
                  onClick={() => setShowReviewsModal(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg text-black">Meal Plan Reviews</h2>
                </div>

                {reviewsLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <>
                    {/* Rating Summary */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{reviewStats.averageRating}</div>
                        <div className="text-sm text-gray-500">/5</div>
                        <div className="text-sm text-gray-500">{reviewStats.totalReviews} Ratings</div>
                      </div>

                      {/* Star Breakdown */}
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((stars, index) => {
                          const count = reviewStats.ratingBreakdown[stars - 1];
                          return (
                            <div key={stars} className="flex items-center gap-2 text-sm">
                              <span className="w-4">{stars}</span>
                              <span className="text-yellow-400">★</span>
                              <div className="flex-1 h-2 bg-gray-200 rounded">
                                <div 
                                  className="h-full bg-yellow-400 rounded" 
                                  style={{ 
                                    width: `${reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0}%` 
                                  }}
                                ></div>
                              </div>
                              <span className="text-gray-500 w-8 text-right">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {reviews.length > 0 ? (
                        reviews.map((review) => (
                          <div key={review.feedback_id} className="border-t pt-4">
                            {/* Review Header */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                {review.Firstname?.charAt(0).toUpperCase() || '?'}
                              </div>
                              <div>
                                <div className="text-sm font-medium">
                                  {review.Firstname} {review.Lastname}
                                </div>
                                <div className="flex">
                                  {[...Array(5)].map((_, index) => (
                                    <span
                                      key={index}
                                      className={`${
                                        index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {/* Review Content */}
                            <p className="text-sm text-gray-600 mb-2">{review.feedback}</p>
                            {review.recommend_status === 1 && (
                              <div className="flex items-center gap-1 text-sm text-green-600">
                                <span>👍</span>
                                <span>Recommended</span>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          No reviews yet. Be the first to review this meal plan!
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default MemberMealPlans;  