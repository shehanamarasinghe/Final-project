// This page is used to display the workout plans assigned to the user. The user can view the workout plans and provide feedback on the workout plans. The user can also view the assigned date of the workout plan. The user can also view the workout plan description. The user can also view the workout plan name

import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Dumbbell } from 'lucide-react';
import PremiumMemberFeedbackForm from '../../Components/Feedbacks/feedback.jsx';

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
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found in localStorage.');

            const response = await fetch(`/assignworkout/assigned-plans`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error(`Failed to fetch workout plans: ${response.statusText}`);
            const data = await response.json();
            setWorkoutPlans(data);
        } catch (error) {
            console.error('Error fetching workout plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleModalSubmit = async (data) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found in localStorage.');
        alert('Authentication error. Please log in again.');
        return;
    }

    try {
        // Hardcoded user_id and plan_id for testing
        const user_id = 38; // Replace with a valid user_id from your database
        const plan_id = 2; // Replace with a valid plan_id from your database

        const feedbackData = {
            ...data,
            user_id,
            plan_id,
        };

        const response = await fetch('/feedback/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(feedbackData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to submit feedback: ${errorData.error || response.statusText}`);
        }

        const result = await response.json();
        alert('Feedback submitted successfully!');
        console.log('Feedback submitted:', result);
        setShowModal(false); // Close modal after successful submission
    } catch (error) {
        console.error('Error submitting feedback:', error.message);
        alert('Failed to submit feedback. Please try again later.');
    }
};


    if (loading) return <div>Loading workout plans...</div>;
    if (workoutPlans.length === 0) return <div>No workout plans assigned.</div>;

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
                                        onClick={() => {
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
                onClose={() => setShowModal(false)}
                onSubmit={(data) => handleModalSubmit(data)}
            />
        </div>
    );
}

export default MemberWorkoutPlansPreview;
