import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PieChart from './PieChart';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// MUI Imports
import { SpeedDial, SpeedDialAction } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FoodForm from './AddFoodItem'; // Ensure correct import path
import { Modal, Box } from '@mui/material';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 600,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
};

function MealPlanForm() {
    const [categories, setCategories] = useState([]);
    const [mealTypes, setMealTypes] = useState([]);
    const [foodItems, setFoodItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedMealType, setSelectedMealType] = useState('');
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [newFood, setNewFood] = useState({ food_item_id: '', grams: '' });
    const [pieData, setPieData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for Modal

    // Fetch categories, meal types, and food items
    useEffect(() => {
        // Fetch Categories
        axios.get('/AdminMeal/meal-plans')
            .then(response => {
                setCategories([
                    { id: 1, category_name: 'Muscle Gain' },
                    { id: 2, category_name: 'Weight Loss' },
                    { id: 3, category_name: 'Fat Loss' }
                ]);
            })
            .catch(error => console.error(error));

        // Fetch Meal Types
        axios.get('AdminMeal/meal-plans')
            .then(response => {
                setMealTypes([
                    { id: 1, meal_type: 'Breakfast' },
                    { id: 2, meal_type: 'Lunch' },
                    { id: 3, meal_type: 'Dinner' }
                ]);
            })
            .catch(error => console.error(error));

        // Fetch Food Items
        axios.get('AdminMeal/food-items')
            .then(response => {
                setFoodItems(response.data);
            })
            .catch(error => console.error(error));
    }, []);

    // Function to calculate pie chart data
    const calculatePieData = (foods) => {
        let totalCarbs = 0;
        let totalProtein = 0;
        let totalVitamins = 0;
        let totalCalories = 0;

        foods.forEach(food => {
            const item = foodItems.find(f => f.id === parseInt(food.food_item_id));
            if (item) {
                totalCarbs += item.carbs_per_gram * parseFloat(food.grams);
                totalProtein += item.protein_per_gram * parseFloat(food.grams);
                totalVitamins += item.vitamin_per_gram * parseFloat(food.grams);
                totalCalories += item.calories_per_gram * parseFloat(food.grams);
            }
        });

        const total = totalCarbs + totalProtein + totalVitamins + totalCalories;
        if (total === 0) {
            setPieData(null);
        } else {
            setPieData({
                carbohydrates: ((totalCarbs / total) * 100).toFixed(2),
                protein: ((totalProtein / total) * 100).toFixed(2),
                vitamins: ((totalVitamins / total) * 100).toFixed(2),
                calories: ((totalCalories / total) * 100).toFixed(2)
            });
        }
    };

    // Handle adding food and calculating pie data immediately
    const handleAddFood = () => {
        if (newFood.food_item_id && newFood.grams) {
            const updatedFoods = [...selectedFoods, newFood];
            setSelectedFoods(updatedFoods);  // Update selected foods
            calculatePieData(updatedFoods);  // Calculate pie data immediately after adding the food
            setNewFood({ food_item_id: '', grams: '' });  // Reset input fields
            toast.success("Food added successfully!");
        }
    };

    const handleRemoveFood = (index) => {
        const updatedFoods = [...selectedFoods];
        updatedFoods.splice(index, 1);
        setSelectedFoods(updatedFoods);
        calculatePieData(updatedFoods);  // Recalculate pie data after removing food
        toast.info("Food removed!");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedCategory || !selectedMealType || selectedFoods.length === 0) {
            toast.error('Please fill in all fields and add at least one food item.');
            return;
        }

        const payload = {
            category_id: selectedCategory,
            meal_type_id: selectedMealType,
            foods: selectedFoods
        };

        axios.post('AdminMeal/meal-plans/create-meal-plan', payload)
            .then(response => {
                toast.success('Meal plan created successfully!');
                setSelectedCategory('');
                setSelectedMealType('');
                setSelectedFoods([]);
                setPieData(null);
            })
            .catch(error => {
                console.error(error);
                toast.error('Failed to create meal plan.');
            });
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

   
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleNewFoodAdded = (newFoodItem) => {
        setFoodItems(prevItems => [...prevItems, newFoodItem]);
        toast.success('New food item added and available for selection!');
    };

    return (
        <div className="relative bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">Create Meal Plan</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category Selection */}
                    <div>
                        <label className="block text-gray-700">Category</label>
                        <select
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.category_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Meal Type Selection */}
                    <div>
                        <label className="block text-gray-700">Meal Type</label>
                        <select
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={selectedMealType}
                            onChange={(e) => setSelectedMealType(e.target.value)}
                            required
                        >
                            <option value="">Select Meal Type</option>
                            {mealTypes.map(meal => (
                                <option key={meal.id} value={meal.id}>{meal.meal_type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Add Food Items */}
                <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-2">Add Food Items</h3>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <select
                            className="block w-full md:w-1/2 border border-gray-300 rounded-md p-2"
                            value={newFood.food_item_id}
                            onChange={(e) => setNewFood({ ...newFood, food_item_id: e.target.value })}
                        >
                            <option value="">Select Food Item</option>
                            {foodItems.map(food => (
                                <option key={food.id} value={food.id}>{food.food_name}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            min="1"
                            placeholder="Grams"
                            className="block w-full md:w-1/4 border border-gray-300 rounded-md p-2"
                            value={newFood.grams}
                            onChange={(e) => setNewFood({ ...newFood, grams: e.target.value })}
                        />
                        <button
                            type="button"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            onClick={handleAddFood}
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Selected Foods List */}
                {selectedFoods.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-xl font-semibold mb-2">Selected Foods</h3>
                        <ul>
                            {selectedFoods.map((food, index) => {
                                const foodItem = foodItems.find(f => f.id === parseInt(food.food_item_id));
                                return (
                                    <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md mb-2">
                                        <span>{foodItem ? foodItem.food_name : ''} - {food.grams} grams</span>
                                        <button
                                            type="button"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleRemoveFood(index)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                <button
                    type="submit"
                    className="mt-6 bg-green-500 text-white px-4 py-2 rounded-md"
                >
                    Create Meal Plan
                </button>

            </form>

            {/* Pie Chart Display (Optional) */}
            {/* {pieData && <PieChart data={pieData} />} */}

            {/* Toast Container for notifications */}
            <ToastContainer />

            {/* Speed Dial Button */}
            <SpeedDial
                ariaLabel="Add Food Item"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<AddIcon />}
            >
                <SpeedDialAction
                    key="Add Food Item"
                    icon={<AddIcon />}
                    tooltipTitle="Add New Food Item"
                    onClick={handleOpenModal}
                />
            </SpeedDial>

            {/* Modal for FoodForm */}
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="add-food-modal"
                aria-describedby="modal-to-add-new-food-item"
            >
                <Box sx={modalStyle}>
                    <FoodForm onFoodAdded={handleNewFoodAdded} onClose={handleCloseModal} />
                </Box>
            </Modal>
        </div>
    );
}

export default MealPlanForm;
