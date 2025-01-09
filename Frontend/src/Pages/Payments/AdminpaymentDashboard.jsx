import React, { useState, useEffect } from 'react';
import {   LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {   CreditCard, Users, TrendingUp, DollarSign, Clock, CheckCircle, XCircle, FileText,   Download, Search, Filter} from 'lucide-react';
import {   Alert,  AlertDescription,  AlertTitle,} from "../../Components/ui/alert.jsx";
import {  Card,  CardContent,  CardDescription,  CardHeader,  CardTitle,} from "../../Components/ui/card.jsx";
import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "../../Components/ui/select.jsx";
import { Button } from "../../Components/ui/button.jsx";
import { Input } from "../../Components/ui/input.jsx";
import { Badge } from "../../Components/ui/badge.jsx";

// API service for handling all API calls
const api = {
  async fetchSlips() {
    try {
      const response = await fetch('/shehan/payment-slips');
      if (!response.ok) throw new Error('Failed to fetch payment slips');
      return await response.json();
    } catch (error) {
      console.error('Error fetching payment slips:', error);
      throw error;
    }
  },

  async fetchStats() {
    try {
      const response = await fetch('/shehan/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  async fetchChartData() {
    try {
      const response = await fetch('/shehan/dashboard/charts');
      if (!response.ok) throw new Error('Failed to fetch chart data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw error;
    }
  },

  async approveSlip(slipId) {
    try {
      const response = await fetch(`/shehan/payment-slips/${slipId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to approve payment slip');
      return await response.json();
    } catch (error) {
      console.error('Error approving slip:', error);
      throw error;
    }
  },

  async rejectSlip(slipId) {
    try {
      const response = await fetch(`/shehan/payment-slips/${slipId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to reject payment slip');
      return await response.json();
    } catch (error) {
      console.error('Error rejecting slip:', error);
      throw error;
    }
  },

  async generateReport() {
    try {
      const response = await fetch('/shehan/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to generate report');
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },
};

const PaymentSlipCard = ({ slip, onApprove, onReject }) => (
  <Card className="mb-4 hover:shadow-lg transition-all">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div>
        <CardTitle className="text-lg font-semibold">Payment Slip #{slip.id}</CardTitle>
        <CardDescription>{new Date(slip.date).toLocaleDateString()}</CardDescription>
      </div>
      <Badge 
        variant={slip.status === 'pending' ? 'secondary' : slip.status === 'approved' ? 'success' : 'destructive'}
      >
        {slip.status}
      </Badge>
    </CardHeader>
    <CardContent>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Member Details</p>
            <p className="text-sm text-gray-500">{slip.memberName}</p>
            <p className="text-sm text-gray-500">{slip.memberEmail}</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-sm font-medium">Payment Details</p>
            <p className="text-sm text-gray-500">Amount: ${slip.amount.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Plan: {slip.planName}</p>
          </div>
        </div>
        <div>
          <img 
            src={slip.slipUrl} 
            alt="Payment Slip" 
            className="w-full h-40 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = "/api/placeholder/400/200";
            }}
          />
          {slip.status === 'pending' && (
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={() => onApprove(slip.id)}
                className="flex-1"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => onReject(slip.id)}
                className="flex-1"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const StatsCard = ({ title, value, icon: Icon, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <p className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}% from last month
        </p>
      )}
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [slips, setSlips] = useState([]);
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [slipsData, statsData, chartData] = await Promise.all([
        api.fetchSlips(),
        api.fetchStats(),
        api.fetchChartData()
      ]);
      
      setSlips(slipsData);
      setStats(statsData);
      setChartData(chartData);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (slipId) => {
    try {
      await api.approveSlip(slipId);
      // Refresh the slips data after approval
      const updatedSlips = await api.fetchSlips();
      setSlips(updatedSlips);
    } catch (error) {
      setError('Failed to approve payment slip. Please try again.');
    }
  };

  const handleReject = async (slipId) => {
    try {
      await api.rejectSlip(slipId);
      // Refresh the slips data after rejection
      const updatedSlips = await api.fetchSlips();
      setSlips(updatedSlips);
    } catch (error) {
      setError('Failed to reject payment slip. Please try again.');
    }
  };

  const handleGenerateReport = async () => {
    try {
      const blob = await api.generateReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError('Failed to generate report. Please try again.');
    }
  };

  const filteredSlips = slips.filter(slip => {
    const matchesStatus = filterStatus === 'all' || slip.status === filterStatus;
    const matchesSearch = slip.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         slip.memberEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue?.toLocaleString()}`}
          icon={DollarSign}
          trend={stats.revenueTrend}
        />
        <StatsCard
          title="Active Members"
          value={stats.activeMembers}
          icon={Users}
          trend={stats.membersTrend}
        />
        <StatsCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon={Clock}
        />
        <StatsCard
          title="Approval Rate"
          value={`${stats.approvalRate}%`}
          icon={CheckCircle}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="payments" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payment Slips Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Payment Slips</CardTitle>
            <Button onClick={handleGenerateReport}>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <Input
                placeholder="Search by member name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSlips.map((slip) => (
              <PaymentSlipCard
                key={slip.id}
                slip={slip}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;