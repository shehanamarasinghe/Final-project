import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Dumbbell } from 'lucide-react';
import PremiumMemberFeedbackForm from '../../Components/Feedbacks/feedback.jsx';
import axios from 'axios';

function MemberWorkoutPlansPreview() {
    const [expandedPlan, setExpandedPlan] = useState(null);
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        fetchWorkoutPlans();
    }, []);

    const fetchWorkoutPlans = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const response = await fetch('/assignworkout/assigned-plans', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch workout plans');
            const data = await response.json();
            setWorkoutPlans(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleModalSubmit = async (feedbackData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !selectedPlan?.id) {
                throw new Error('Missing required data');
            }

            const response = await axios.post('/feedback/submit', {
                plan_id: selectedPlan.id,
                rating: feedbackData.rating,
                feedback: feedbackData.feedback,
                recommend_status: feedbackData.recommend_status
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert(response.data || 'Feedback submitted successfully!');
            setShowModal(false);
            setSelectedPlan(null);
        } catch (error) {
            console.error('Error:', error);
            alert(error.response?.data || 'Failed to submit feedback');
        }
    };

    if (loading) return <div>Loading workout plans...</div>;
    if (!workoutPlans.length) return <div>No workout plans assigned.</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                <Dumbbell className="mr-2" />
                My Workout Plans
            </h1>

            <div className="space-y-4 text-gray-800">
                {workoutPlans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div
                            className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                            onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                        >
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">{plan.name}</h2>
                                <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Assigned: {new Date(plan.assigned_at).toLocaleDateString()}
                                </div>
                            </div>
                            {expandedPlan === plan.id ? (
                                <ChevronUp className="h-6 w-6 text-gray-400" />
                            ) : (
                                <ChevronDown className="h-6 w-6 text-gray-400" />
                            )}
                        </div>

                        {expandedPlan === plan.id && (
                            <div className="border-t">
                                <div className="p-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPlan(plan);
                                            setShowModal(true);
                                        }}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Rate & Feedback
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <PremiumMemberFeedbackForm
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedPlan(null);
                }}
                onSubmit={handleModalSubmit}
                planData={selectedPlan}
            />
        </div>
    );
}

export default MemberWorkoutPlansPreview;