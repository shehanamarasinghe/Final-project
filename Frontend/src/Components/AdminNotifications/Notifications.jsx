import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminMealPlanRequests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('Pending'); // Default to Pending

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  // Fetch notifications based on the selected filter
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`notifications/meal-plan-requests?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  // Handle the action (Approve or Reject) for a specific request
  const handleRequestAction = async (id, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `notifications/meal-plan-requests/${id}`,
        { status: action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests(); // Refresh the list for the current filter
    } catch (error) {
      console.error(`Error updating request status to ${action}:`, error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-12">
      <h2 className="text-center text-4xl font-bold text-gray-800 mb-8">Notifications...!</h2>

      {/* Filter Buttons */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 mx-2 rounded ${
            filter === 'Pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setFilter('Pending')}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${
            filter === 'Approved' ? 'bg-green-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setFilter('Approved')}
        >
          Approved
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${
            filter === 'Rejected' ? 'bg-red-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setFilter('Rejected')}
        >
          Rejected
        </button>
      </div>

      {/* Notifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {request.Firstname} {request.Lastname}
            </h3>
            <p className="text-gray-600 mb-4">{request.request_message}</p>
            <p className="text-gray-500 mb-4">
              Status: <span className="font-bold">{request.status}</span>
            </p>
            {/* Action Buttons only for Pending notifications */}
            {filter === 'Pending' && (
              <div className="flex justify-between">
                <button
                  onClick={() => handleRequestAction(request.id, 'Approved')}
                  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRequestAction(request.id, 'Rejected')}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminMealPlanRequests;
