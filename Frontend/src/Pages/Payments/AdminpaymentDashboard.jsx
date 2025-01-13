import React, { useState, useEffect } from 'react';
import {   LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {   CreditCard, Users, TrendingUp, DollarSign, Clock, CheckCircle, XCircle, FileText,   Download, Search, Filter} from 'lucide-react';
import {   Alert,  AlertDescription,  AlertTitle,} from "../../Components/ui/alert.jsx";
import {  Card,  CardContent,  CardDescription,  CardHeader,  CardTitle,} from "../../Components/ui/card.jsx";
import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "../../Components/ui/select.jsx";
import { Button } from "../../Components/ui/button.jsx";
import { Input } from "../../Components/ui/input.jsx";
import { Badge } from "../../Components/ui/badge.jsx";
import Slidebar from "../../Components/ADashboardComponents/SlideBar/Slidebar";
import Navbar from '../../Components/ADashboardComponents/Navbar/Navbar';
//import { Dialog, DialogContent, DialogTrigger } from "../../Components/ui/dialog.jsx";

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
      const data = await response.json();
      
      // Ensure data for all months
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      
      // Create full year dataset with 0s for missing months
      const fullYearData = months.map(month => {
        const monthData = data.find(d => d.month === month);
        return monthData || {
          month,
          revenue: 0,
          payments: 0
        };
      });
      
      return fullYearData;
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw error;
    }
  },
  async sendThankYouEmail(memberEmail, slipId) {
    try {
      const response = await fetch(`/email/thank-you`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberEmail,
          slipId
        })
      });
      if (!response.ok) throw new Error('Failed to send thank you email');
      return await response.json();
    } catch (error) {
      console.error('Error sending thank you email:', error);
      throw error;
    }
  },

  async approveSlip(slipId,memberEmail) {
    try {
      const response = await fetch(`/shehan/payment-slips/${slipId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to approve payment slip');
      await api.sendThankYouEmail(memberEmail, slipId);
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


const PaymentSlipCard = ({ slip, onApprove, onReject }) => {
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const ImageModal = () => {
    if (!showModal) return null;

    return (
      <div 
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={() => setShowModal(false)}
      >
        <div 
          className="relative bg-white rounded-lg max-w-4xl w-full"
          onClick={e => e.stopPropagation()}
        >
          <img 
            src={imageError ? "/api/placeholder/800/600" : `http://localhost:5000/${slip.slip_url}`}
            alt="Payment Slip Full View" 
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            onError={() => setImageError(true)}
          />
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <Card className="mb-4 hover:shadow-lg transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">Payment Slip #{slip.id}</CardTitle>
          <CardDescription>{new Date(slip.date).toLocaleDateString()}</CardDescription>
        </div>
        <Badge 
          variant={getStatusVariant(slip.status)}
          className="capitalize"
        >
          {slip.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">Member Details</p>
              <p className="text-sm text-gray-500">{slip.memberName}</p>
              <p className="text-sm text-gray-500">{slip.memberEmail}</p>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-sm font-medium text-gray-900">Payment Details</p>
              <p className="text-sm text-gray-500">Amount: ${slip.amount.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Plan: {slip.planName}</p>
            </div>
          </div>
          <div>
            <div 
              className="cursor-pointer relative group"
              onClick={() => setShowModal(true)}
            >
              <img 
                src={imageError ? "/api/placeholder/400/320" : `http://localhost:5000/${slip.slip_url}`}
                alt="Payment Slip" 
                className="w-full h-48 object-contain rounded-lg border border-gray-200 transition-all group-hover:opacity-90"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                <span className="text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                  Click to enlarge
                </span>
              </div>
            </div>

            {slip.status === 'pending' && (
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={() => onApprove(slip.id,slip.memberEmail)}
                  className="flex-1 bg-sky-950 hover:bg-sky-700 text-white"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => onReject(slip.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <ImageModal />
    </Card>
  );
};


const AdminDashboard = () => {
  const [slips, setSlips] = useState([]);
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
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

  const StatsCard = ({ title, value, icon: Icon, trend }) => (
    <Card className="bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-900">{title}</CardTitle>
        <div className="bg-blue-50 p-2 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-sky-900">{value}</div>
        {trend && (
          <p className={`text-xs flex items-center mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-4 w-4 mr-1 ${trend < 0 && 'transform rotate-180'}`} />
            {trend > 0 ? '+' : ''}{trend}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
  const handleApprove = async (slipId, memberEmail) => {
    try {
      setError(null);
      setSuccess(null);
      await api.approveSlip(slipId, memberEmail);
      // Refresh the slips data after approval
      setSuccess('Payment slip approved and thank you email sent successfully.');
      const updatedSlips = await api.fetchSlips();
      setSlips(updatedSlips);
   
    } catch (error) {
      setError('Failed to approve payment slip. Please try again.');
    }
  };

  const handleReject = async (slipId) => {
    try {
      setError(null);
      setSuccess(null);
      await api.rejectSlip(slipId);
      setSuccess('Payment slip rejected successfully.');
      // Refresh the slips data after rejection
      const updatedSlips = await api.fetchSlips();
      setSlips(updatedSlips);
    } catch (error) {
      setError('Failed to reject payment slip. Please try again.');
    }
  };

  const [generatingReport, setGeneratingReport] = useState(false);

const handleGenerateReport = async () => {
  try {
    setGeneratingReport(true);
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
  } finally {
    setGeneratingReport(false);
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
          title ="Total Revenue"
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
            <CardTitle className={"text-black font-bold"}>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#9d174d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={"text-black font-bold"}>Payment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="payments" fill="#9d174d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payment Slips Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className={"text-black font-bold"}>Payment Slips</CardTitle>
            <Button className={"bg-sky-950 hover:bg-sky-700 text-white"}
  onClick={handleGenerateReport} 
  disabled={generatingReport}
>
  <FileText className="mr-2 h-4 w-4" />
  {generatingReport ? 'Generating...' : 'Generate Report'}
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