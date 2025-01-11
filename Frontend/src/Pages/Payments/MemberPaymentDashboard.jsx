import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, Upload, Clock, CheckCircle, AlertCircle, History } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../Components/ui/card.jsx";
import { Button } from "../../Components/ui/button.jsx";
import { Badge } from "../../Components/ui/badge.jsx";
import 'react-toastify/dist/ReactToastify.css';
import { Alert, AlertDescription, AlertTitle } from "../../Components/ui/alert.jsx";
import { toast } from 'react-toastify';

const MemberPaymentDashboard = () => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  const fetchSubscriptionData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/payments/reddamption', {
        headers: { 
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription data');
      }

      const data = await response.json();
      setSubscriptionData(data);
      setIsFirstTime(!data || data.status === 'inactive');
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Failed to load subscription data');
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/payments/history', {
        headers: { 
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }

      const data = await response.json();
      setPaymentHistory(data);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      toast.error('Failed to load payment history');
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
    fetchPaymentHistory();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a JPG, PNG, or PDF file');
        return;
      }
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setUploadedFile(file);
    }
  };

  const handleSubmitPayment = async () => {
    if (!uploadedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('paymentSlip', uploadedFile);
      formData.append('amount', subscriptionData?.amount || '299');

      const response = await fetch('/payments/submit', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit payment');
      }

      const data = await response.json();
      toast.success('Payment slip uploaded successfully');
      setUploadedFile(null);
      
      // Refresh data
      await fetchSubscriptionData();
      await fetchPaymentHistory();
    } catch (error) {
      console.error('Payment submission error:', error);
      toast.error(error.message || 'Failed to upload payment slip');
    } finally {
      setLoading(false);
    }
  };

  // ... Rest of your component rendering code remains the same ...

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Subscription Status Card */}
      <Card className="bg-sky-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300' : 'bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-sky-900">
            {isFirstTime ? 'Complete Your Subscription' : 'Your Premium Subscription'}
          </CardTitle>
          <CardDescription className="text-gray-900">
            {isFirstTime 
              ? 'Submit your first payment to activate your subscription'
              : `Next payment due: ${subscriptionData?.nextPayment}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-sky-900">Premium Plan</p>
                <p className="text-sm text-gray-500">
                  ${subscriptionData?.amount || '100'}/month
                </p>
              </div>
              <Badge variant={isFirstTime ? 'destructive' : 'success'}>
                {isFirstTime ? 'Inactive' : subscriptionData?.status}
              </Badge>
            </div>

            {!isFirstTime && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Period Progress</span>
                  <span>{subscriptionData?.remainingDays} days remaining</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-rose-500 rounded-full transition-all"
                    style={{ 
                      width: `${((subscriptionData?.totalDays - subscriptionData?.remainingDays) / subscriptionData?.totalDays) * 100}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Upload Section */}
      <Card className="bg-sky-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl text-sky-900">{isFirstTime ? 'Submit Initial Payment' : 'Submit Payment'}</CardTitle>
          <CardDescription className="text-gray-900">Upload your payment slip for verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Payment Required</AlertTitle>
              <AlertDescription>
                Please submit ${subscriptionData?.amount || '100'} for your 
                {isFirstTime ? ' subscription activation' : ' next billing period'}
              </AlertDescription>
            </Alert>
            
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                id="payment-slip"
                className="hidden"
                onChange={handleFileUpload}
                accept=".jpg,.jpeg,.png,.pdf"
              />
              <label htmlFor="payment-slip" className="cursor-pointer">
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="text-sm font-medium">
                    {uploadedFile ? uploadedFile.name : "Click to upload payment slip"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Support JPG, PNG or PDF up to 10MB
                  </p>
                </div>
              </label>
            </div>

            <Button 
              className="w-full flex items-center justify-center p-2 space-x-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors"
              disabled={!uploadedFile || loading}
              onClick={handleSubmitPayment}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {loading ? 'Uploading...' : 'Submit Payment for Verification'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment History Section */}
      {paymentHistory.length > 0 && (
        <Card className="bg-sky-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl text-sky-900">Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div 
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <History className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sky-900">${payment.amount}</p>
                      <p className="text-sm text-gray-500">
                      {new Date(payment.payment_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit'
                  }).replace(',', '')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={payment.status === 'approved' ? 'success' : 'secondary'}>
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MemberPaymentDashboard;