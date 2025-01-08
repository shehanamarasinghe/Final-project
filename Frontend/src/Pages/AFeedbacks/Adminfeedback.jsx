import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, BarChart2, Award, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const COLORS = {
  primary: '#1A73E8',
  secondary: '#6200EE',
  accent: '#03DAC6',
  background: '#F4F7FA',
  text: '#2C3E50'
};

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-gray-50 p-6 rounded-xl flex items-center space-x-4 transform transition-all hover:scale-105 hover:shadow-lg">
    <div className={`bg-${color}-100 p-3 rounded-full`}>
      <Icon className={`text-${color}-600`} size={32} />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
    </div>
  </div>
);

const PlanStatsCard = ({ planStats }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-xl font-bold text-gray-800 mb-4">{planStats.planName}</h3>
    <div className="grid grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-gray-500">Total Feedbacks</p>
        <p className="text-lg font-bold text-blue-600">{planStats.totalFeedbacks}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Average Rating</p>
        <p className="text-lg font-bold text-yellow-600">{planStats.averageRating} ★</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Recommendation</p>
        <p className="text-lg font-bold text-green-600">{planStats.recommendationRate}%</p>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    recommendationRate: 0
  });
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [planStats, setPlanStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, feedbacksRes, planStatsRes] = await Promise.all([
        axios.get('/admin/feedback/stats'),
        axios.get('/admin/feedback/recent'),
        axios.get('/admin/feedback/stats/plans')
      ]);

      setStats(statsRes.data);
      setRecentFeedbacks(feedbacksRes.data);
      setPlanStats(planStatsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
      {/* Header Gradient */}
      <div 
        className="h-2 w-full mb-6"
        style={{
          background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
        }}
      />

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
        >
          <RefreshCw className={`${refreshing ? 'animate-spin' : ''}`} size={20} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard
          icon={BarChart2}
          title="Total Feedbacks"
          value={stats.total}
          color="blue"
        />
        <StatCard
          icon={Star}
          title="Average Rating"
          value={stats.averageRating}
          color="yellow"
        />
        <StatCard
          icon={Award}
          title="Recommendation Rate"
          value={`${stats.recommendationRate}%`}
          color="green"
        />
      </div>

      {/* Plan Stats */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Plan Statistics</h2>
        <div className="grid grid-cols-2 gap-6">
          {planStats.map((plan) => (
            <PlanStatsCard key={plan.planId} planStats={plan} />
          ))}
        </div>
      </div>

      {/* Recent Feedbacks */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <TrendingUp className="mr-3 text-purple-600" size={28} />
          Recent Member Feedback
        </h2>
        {recentFeedbacks.map((feedback) => (
          <div 
            key={feedback.id} 
            className="bg-gray-50 p-5 rounded-xl hover:bg-gray-100 transition-all duration-300"
          >
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {feedback.userName}
                </h3>
                <span className="text-sm text-gray-500">| {feedback.planName}</span>
              </div>
              <div className="flex items-center space-x-1 my-2">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={20}
                    className={`${
                      index < feedback.rating 
                        ? 'text-yellow-500' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">{feedback.feedback}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm text-gray-500">{feedback.date}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className={`text-sm ${feedback.recommendStatus ? 'text-green-500' : 'text-red-500'}`}>
                  {feedback.recommendStatus ? 'Recommends' : 'Does Not Recommend'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;