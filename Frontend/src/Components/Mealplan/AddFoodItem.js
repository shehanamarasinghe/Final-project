import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@mui/material';

const FoodForm = ({ onFoodAdded, onClose }) => {
    const [foodName, setFoodName] = useState('');
    const [macronutrients, setMacronutrients] = useState([]);
    const [macronutrientId, setMacronutrientId] = useState('');
    const [caloriesPerGram, setCaloriesPerGram] = useState('');
    const [proteinPerGram, setProteinPerGram] = useState('');
    const [carbsPerGram, setCarbsPerGram] = useState('');
    const [vitaminPerGram, setVitaminPerGram] = useState('');

    
    useEffect(() => {
        axios.get('AdminMeal/food-items/macronutrients')
            .then(response => {
                if (response.data.length > 0) {
                    setMacronutrients(response.data);
                } else {
                    toast.error('No macronutrients found.');
                }
            })
            .catch(error => {
                toast.error('Error fetching macronutrients.');
            });
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();

        const foodItem = {
            food_name: foodName,
            macronutrient_id: macronutrientId,
            calories_per_gram: parseFloat(caloriesPerGram),
            protein_per_gram: parseFloat(proteinPerGram),
            carbs_per_gram: parseFloat(carbsPerGram),
            vitamin_per_gram: parseFloat(vitaminPerGram)
        };

        axios.post('AdminMeal/food-items/', foodItem)
            .then(response => {
                const newFoodItem = response.data; // Assuming the API returns the created food item
                toast.success('Food item added successfully!');
                // Notify parent component
                if (onFoodAdded) {
                    onFoodAdded(newFoodItem);
                }
                // Clear form after submission
                setFoodName('');
                setMacronutrientId('');
                setCaloriesPerGram('');
                setProteinPerGram('');
                setCarbsPerGram('');
                setVitaminPerGram('');
                // Close modal
                if (onClose) {
                    onClose();
                }
            })
            .catch(error => {
                console.error(error);
                toast.error('Error adding food item.');
            });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Add New Food Item</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Food Name</label>
                    <input
                        type="text"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Macronutrient</label>
                    <select
                        value={macronutrientId}
                        onChange={(e) => setMacronutrientId(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    >
                        <option value="">Select Macronutrient</option>
                        {macronutrients.map(macro => (
                            <option key={macro.id} value={macro.id}>
                                {macro.macronutrient_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Calories Per Gram</label>
                    <input
                        type="number"
                        value={caloriesPerGram}
                        onChange={(e) => setCaloriesPerGram(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                        step="0.01"
                        min="0"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Protein Per Gram</label>
                    <input
                        type="number"
                        value={proteinPerGram}
                        onChange={(e) => setProteinPerGram(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                        step="0.01"
                        min="0"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Carbs Per Gram</label>
                    <input
                        type="number"
                        value={carbsPerGram}
                        onChange={(e) => setCarbsPerGram(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                        step="0.01"
                        min="0"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Vitamin Per Gram</label>
                    <input
                        type="number"
                        value={vitaminPerGram}
                        onChange={(e) => setVitaminPerGram(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                        step="0.01"
                        min="0"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Add Food Item
                    </button>
                </div>
            </form>

            <ToastContainer />
        </div>
    );
};

export default FoodForm;
