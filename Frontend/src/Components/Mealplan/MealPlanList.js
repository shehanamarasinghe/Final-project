import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import PieChart from './PieChart';

function MealPlanList() {
    const [mealPlans, setMealPlans] = useState([]);
    const [selectedMealPlan, setSelectedMealPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [mealPlanToDelete, setMealPlanToDelete] = useState(null);

    useEffect(() => {
        fetchMealPlans();
    }, []);

    const fetchMealPlans = () => {
        axios.get('AdminMeal/meal-plans')
            .then(response => {
                setMealPlans(response.data);
            })
            .catch(error => console.error(error));
    };

    const handleSelectMealPlan = (id) => {
        axios.get(`AdminMeal/meal-plans/${id}`)
            .then(response => {
                setSelectedMealPlan(response.data);
                setIsModalOpen(true);
            })
            .catch(error => console.error(error));
    };

    const openDeleteModal = (id) => {
        setMealPlanToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteMealPlan = () => {
        if (mealPlanToDelete) {
            axios.delete(`AdminMeal/meal-plans/${mealPlanToDelete}`)
                .then(() => {
                    fetchMealPlans(); // Refetch meal plans after deletion
                    closeDeleteModal(); // Close the delete modal after deletion
                })
                .catch(error => console.error(error));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMealPlan(null);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setMealPlanToDelete(null);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-black">Existing Meal Plans</h2>
            <ul>
                {mealPlans.map(plan => (
                    <li key={plan.id} className="mb-2 flex justify-between items-center">
                        <button
                            className="text-left p-4 bg-gray-100 rounded-md hover:bg-gray-200 w-full"
                            onClick={() => handleSelectMealPlan(plan.id)}
                        >
                            {plan.category_name} - {plan.meal_type} - {new Date(plan.date_created).toLocaleString()}
                        </button>
                        <button
                            className="ml-4 text-red-500 hover:text-red-600  p-4 bg-gray-100 rounded-md hover:bg-gray-200"
                            onClick={() => openDeleteModal(plan.id)}
                        >
                            <FontAwesomeIcon icon={faTrash} size="lg" />
                        </button>
                    </li>
                ))}
            </ul>

            {/* Modal for meal plan details */}
            {isModalOpen && selectedMealPlan && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-2/3 md:w-1/2 lg:w-[600px] p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-2 text-black">Meal Plan Details</h3>
                            <div className="bg-gray-50 p-4 rounded-md text-black">
                            <p className="text-black"><strong>Category:</strong> {selectedMealPlan.mealPlan.category_name}</p>
                            <p className="text-black"><strong>Meal Type:</strong> {selectedMealPlan.mealPlan.meal_type}</p>
                            <p className="text-black"><strong>Date Created:</strong> {new Date(selectedMealPlan.mealPlan.date_created).toLocaleString()}</p>


                            <h4 className="mt-4 font-semibold">Foods:</h4>
                            <ul className="list-disc list-inside">
                                {selectedMealPlan.items.map((item, index) => (
                                    <li key={index}>
                                        {item.food_name} - {item.grams}g
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-4">
                                <PieChart
                                    data={{
                                        carbohydrates: ((selectedMealPlan.mealPlan.total_carbs / (selectedMealPlan.mealPlan.total_carbs + selectedMealPlan.mealPlan.total_protein + selectedMealPlan.mealPlan.total_vitamins)) * 100).toFixed(2),
                                        protein: ((selectedMealPlan.mealPlan.total_protein / (selectedMealPlan.mealPlan.total_carbs + selectedMealPlan.mealPlan.total_protein + selectedMealPlan.mealPlan.total_vitamins)) * 100).toFixed(2),
                                        vitamins: ((selectedMealPlan.mealPlan.total_vitamins / (selectedMealPlan.mealPlan.total_carbs + selectedMealPlan.mealPlan.total_protein + selectedMealPlan.mealPlan.total_vitamins)) * 100).toFixed(2),
                                        calories: ((selectedMealPlan.mealPlan.total_calories / (selectedMealPlan.mealPlan.total_carbs + selectedMealPlan.mealPlan.total_protein + selectedMealPlan.mealPlan.total_vitamins)) * 100).toFixed(2),
                                    }}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={closeModal} 
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Modal for delete confirmation */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 text-black">Are you sure you want to delete this meal plan?</h3>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleDeleteMealPlan}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MealPlanList;
