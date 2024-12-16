import React, { useState, useEffect } from 'react';
import Slidebar from "../../Components/ADashboardComponents/SlideBar/Slidebar";
import Navbar from '../../Components/ADashboardComponents/Navbar/Navbar';

import {
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown,
  LayoutDashboard,
  Users,
  UserPlus,
  Percent,
} from 'lucide-react';

function Adminpayment() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [financialMetrics, setFinancialMetrics] = useState({});
  const [membershipMetrics, setMembershipMetrics] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchFinancialMetrics();
    fetchMembershipMetrics();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pay/payments', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchFinancialMetrics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pay/financial-metrics', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setFinancialMetrics(data);
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
    }
  };

  const fetchMembershipMetrics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pay/membership-metrics', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setMembershipMetrics(data);
    } catch (error) {
      console.error('Error fetching membership metrics:', error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const results = customers.filter((customer) =>
      customer.name.toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term) ||
      customer.id.toLowerCase().includes(term)
    );
    setFilteredCustomers(results);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="Mdashboard">
      <Slidebar />
      <div className="Dash-Container">
        <Navbar />
        <div className="MMwrapper">
          <main className="container mx-auto p-6">
            <div className="bg-white shadow rounded-lg mb-6 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-black">Customer Search</h2>
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Filter size={16} className="mr-2" />
                  Filters
                </button>
              </div>
              <div className="relative mt-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search by name, email, or customer ID..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-black">Financial Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 text-black"><DollarSign size={24} /></span>
                      <span className="text-sm text-blue-600">Gross Revenue</span>
                    </div>
                    <p className="text-2xl font-bold mt-2 text-black">${financialMetrics.grossRevenue?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-green-600"><DollarSign size={24} /></span>
                      <span className="text-sm text-green-600">Net Revenue</span>
                    </div>
                    <p className="text-2xl font-bold mt-2 text-black">${financialMetrics.netRevenue?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600"><TrendingDown size={24} /></span>
                      <span className="text-sm text-red-600">Refunds</span>
                    </div>
                    <p className="text-2xl font-bold mt-2 text-black">${financialMetrics.refunds?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-600"><TrendingUp size={24} /></span>
                      <span className="text-sm text-purple-600">Growth</span>
                    </div>
                    <p className="text-2xl font-bold mt-2 text-black">+{financialMetrics.previousMonthGrowth || 0}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Membership Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-600"><UserPlus size={24} /></span>
                      <span className="text-sm text-indigo-600">New Members</span>
                    </div>
                    <p className="text-2xl font-bold mt-2 text-black">{membershipMetrics.newMembers || 0}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-green-600"><Percent size={24} /></span>
                      <span className="text-sm text-green-600">Retention Rate</span>
                    </div>
                    <p className="text-2xl font-bold mt-2 text-black">{membershipMetrics.retentionRate || 0}%</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600"><Users size={24} /></span>
                      <span className="text-sm text-blue-600">Total Members</span>
                    </div>
                    <p className="text-2xl font-bold mt-2 text-black">{membershipMetrics.totalMembers || 0}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-600"><TrendingUp size={24} /></span>
                      <span className="text-sm text-purple-600">Growth Rate</span>
                    </div>
                    <p className="text-2xl font-bold mt-2 text-black">+{membershipMetrics.growthRate || 0}%</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Adminpayment;
