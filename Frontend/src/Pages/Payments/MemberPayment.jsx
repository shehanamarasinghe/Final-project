import React, { useState, useEffect } from "react";
import Slidebar from "../../Components/MDashboardComponents/SlideBar/Slidebar";
import Navbar from "../../Components/MDashboardComponents/Navbar/Navbar";
import Paypal from "../../Images/Paypalogo.png";
import Master from "../../Images/Master.png";
import American from "../../Images/American.png";
import Visa from "../../Images/visa.png";
import axios from "axios";

function MemberPayment() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    amount: "",
  });
  const [transactions, setTransactions] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/pay/transaction-history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Failed to fetch transactions");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let key in formData) {
      if (!formData[key]) {
        setPaymentStatus("Please fill all the fields");
        setIsModalOpen(true);
        return;
      }
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/pay/create-payment-intent",
        {
          amount: formData.amount,
          currency: "usd",
          name: formData.fullName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zipCode,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { clientSecret } = response.data;

      const paymentVerification = await axios.get(
        `http://localhost:5000/api/pay/verify-payment-intent/${clientSecret}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (paymentVerification.data.status === "succeeded") {
        setPaymentStatus("Payment Complete");
      } else {
        setPaymentStatus("Payment Pending or Invalid Details");
      }

      setIsModalOpen(true);
      fetchTransactions();
    } catch (error) {
      setPaymentStatus("Payment Failed");
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="Mdashboard">
      <Slidebar />
      <div className="Dash-Container">
        <Navbar />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="MMwrapper">
              <div className="MMcontainer">
                <h1>Payment Gateway</h1>
                <form onSubmit={handleSubmit} className="bg-white p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-6">
                    <h2 className="text-gray-700 font-semibold text-lg">BILLING ADDRESS</h2>
                    <div>
                      <label htmlFor="fullName" className="block text-gray-600 text-sm mb-1">Full Name:</label>
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-600 text-sm mb-1">Email:</label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-gray-600 text-sm mb-1">Address:</label>
                      <input
                        type="text"
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter your address"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-gray-600 text-sm mb-1">City:</label>
                        <input
                          type="text"
                          id="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full border px-3 py-2 rounded"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-gray-600 text-sm mb-1">State:</label>
                        <input
                          type="text"
                          id="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full border px-3 py-2 rounded"
                          placeholder="State"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-gray-600 text-sm mb-1">Zip Code:</label>
                      <input
                        type="text"
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Zip Code"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-gray-700 font-semibold text-lg">PAYMENT</h2>
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">Cards Accepted:</label>
                      <div className="flex gap-2">
                        <img src={Paypal} alt="PayPal" className="h-8" />
                        <img src={Master} alt="Mastercard" className="h-8" />
                        <img src={American} alt="American Express" className="h-8" />
                        <img src={Visa} alt="Visa" className="h-8" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="cardName" className="block text-gray-600 text-sm mb-1">Name On Card:</label>
                      <input
                        type="text"
                        id="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Name on card"
                      />
                    </div>
                    <div>
                      <label htmlFor="cardNumber" className="block text-gray-600 text-sm mb-1">Credit Card Number:</label>
                      <input
                        type="text"
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="1111-2222-3333-4444"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardExpiry" className="block text-gray-600 text-sm mb-1">Expiry Date:</label>
                        <input
                          type="text"
                          id="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          className="w-full border px-3 py-2 rounded"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label htmlFor="cardCVV" className="block text-gray-600 text-sm mb-1">CVV:</label>
                        <input
                          type="text"
                          id="cardCVV"
                          value={formData.cardCVV}
                          onChange={handleChange}
                          maxLength="3"
                          className="w-full border px-3 py-2 rounded"
                          placeholder="123"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="amount" className="block text-gray-600 text-sm mb-1">Amount:</label>
                      <input
                        type="text"
                        id="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Amount"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-pink-700 to-red-600 text-white px-4 py-2 rounded hover:bg-emerald-600"
                  >
                    Pay Now
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Transaction History</h2>
            <ul>
              {transactions.map((transaction) => (
                <li key={transaction.id} className="mb-2">
                  <p>
                    <span className="font-semibold text-black">Name:</span>
                    <span className="text-gray-500">{transaction.name}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-black">Amount:</span>
                    <span className="text-gray-500">${transaction.amount}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-black">Status:</span>
                    <span className="text-gray-500">{transaction.status}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Payment Status</h2>
              <p className="text-gray-600">{paymentStatus}</p>
              <button
                onClick={closeModal}
                className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemberPayment;
