import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, Filter } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

function MemberNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/member-notifications/member', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'all') return true;
    return notification.status.toLowerCase() === filter;
  });

  const StatusBadge = ({ status }) => {
    const getStatusStyles = () => {
      switch (status) {
        case 'Approved':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'Rejected':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      }
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles()} 
        transition-all duration-200 hover:shadow-md`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-8 px-4">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Notifications..!!</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-3">
            <Bell className="h-12 w-12 text-gray-400" />
            <p className="text-gray-500 text-lg">No notifications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <tr
                    key={notification.id}
                    className="transform transition-colors duration-200 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {notification.id}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {notification.request_message}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <StatusBadge status={notification.status} />
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(notification.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemberNotifications;
