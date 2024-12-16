import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Slidebar from '../../Components/MDashboardComponents/SlideBar/Slidebar';
import Navbar from '../../Components/MDashboardComponents/Navbar/Navbar';
import PieChart from '../../Components/Mealplan/PieChart';
import '../WorkoutPlan/Memberworkout.css';

function Memberassignedplans() {
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noMealPlansModal, setNoMealPlansModal] = useState(false);

  useEffect(() => {
    fetchMealPlans();
  }, []);

  const fetchMealPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/meal-plans/assigned-meal-plans', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMealPlans(response.data);
      if (response.data.length === 0) {
        setNoMealPlansModal(true); // Open "No meal plans" popup if no plans are assigned
      }
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      toast.error('Error fetching meal plans. Please try again later.');
    }
  };

  const requestMealPlan = async () => {
    console.log('Request Meal Plan button clicked'); // Debugging point
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        toast.error('Authorization token is missing. Please log in again.');
        return;
      }
  
      const response = await axios.post(
        '/notifications/meal-plan-requests',
        { requestMessage: 'Please assign me a meal plan.' }, // User ID handled in backend
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log('Response:', response.data); // Debugging point
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error submitting meal plan request:', error);
  
      // Improved error handling
      if (error.response && error.response.data) {
        toast.error(error.response.data.error || 'Failed to submit meal plan request.');
      } else {
        toast.error('Failed to submit meal plan request. Please try again later.');
      }
    }
  };
  



  const handleSelectMealPlan = (plan) => {
    setSelectedMealPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMealPlan(null);
    setIsModalOpen(false);
  };

  const closeNoMealPlansModal = () => {
    setNoMealPlansModal(false);
  };

  return (
    <div className="Mdashboard">
      <Slidebar />
      <div className="Dash-Container">
        <Navbar />
        <div className="MMwrapper">
          <div className="MMcontainer">
            {mealPlans.map((plan, index) => (
              <div key={plan.id}>
                <input type="radio" name="slide" id={`c${index + 1}`} defaultChecked={index === 0} />
                <label htmlFor={`c${index + 1}`} className="MMcard">
                  <div className="check123">
                    <h1>{plan.category_name}</h1>
                    <p>
                      {plan.meal_type} - {new Date(plan.date_created).toLocaleDateString()}
                    </p>
                    <div className="AWTable">
                      <div className="mainMwork">
                        <h1>Meal Plan Details</h1>
                        <button
                          onClick={() => handleSelectMealPlan(plan)}
                          className="Memberfeed bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for meal plan details */}
      {isModalOpen && selectedMealPlan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Meal Plan Details</h3>
            <p>Category: {selectedMealPlan.category_name}</p>
            <p>Meal Type: {selectedMealPlan.meal_type}</p>
            <p>Date Created: {new Date(selectedMealPlan.date_created).toLocaleDateString()}</p>
            <PieChart data={selectedMealPlan} />
            <button onClick={closeModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for "No meal plans assigned" */}
      {noMealPlansModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative">
      {/* Close button in the top-right corner */}
      <button 
        onClick={closeNoMealPlansModal} 
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9.293l4.95-4.95a1 1 0 011.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414l4.95-4.95-4.95-4.95A1 1 0 015.05 4.343L10 9.293z" clipRule="evenodd" />
        </svg>
      </button>

      <h3 className="text-xl font-semibold mb-4 text-red-500">No Meal Plans Assigned</h3>
      <p className="text-black">You have not been assigned any meal plans yet.</p>

      <div className="flex justify-between mt-6">
        <button 
          onClick={() => {
            requestMealPlan();
            closeNoMealPlansModal(); // Close modal after requesting meal plan
          }} 
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Request Meal Plan
        </button>

        <button 
          onClick={closeNoMealPlansModal} 
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Memberassignedplans;
