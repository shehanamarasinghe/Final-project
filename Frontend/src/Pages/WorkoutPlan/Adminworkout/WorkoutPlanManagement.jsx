// WorkoutPlanManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Multiselect from 'multiselect-react-dropdown';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the datalabels plugin
import Slidebar from "../../../Components/ADashboardComponents/SlideBar/Slidebar";
import Navbar from '../../../Components/ADashboardComponents/Navbar/Navbar';
import { Link } from 'react-router-dom';

// Register Chart.js components and the datalabels plugin
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const WorkoutPlanManagement = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseData, setExerciseData] = useState([]); // To store sets and reps
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [muscleImpact, setMuscleImpact] = useState({
    chest: 0,
    back: 0,
    shoulders: 0,
    biceps: 0,
    triceps: 0,
    legs: 0
  });

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchWorkoutPlans();
    fetchExercises();
  }, []);

  const fetchWorkoutPlans = async () => {
    try {
      const response = await axios.get('/workout-plans');
      setWorkoutPlans(response.data);
    } catch (err) {
      console.error('Error fetching workout plans:', err);
      setError('Failed to fetch workout plans');
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await axios.get('/exercises');
      setExercises(response.data);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError('Failed to fetch exercises');
    }
  };

  /**
   * Updated Function to Calculate Muscle Impact as Percentages
   */
  const calculateMuscleImpact = (selectedExercises) => {
    const totalImpact = {
      chest: 0,
      back: 0,
      shoulders: 0,
      biceps: 0,
      triceps: 0,
      legs: 0
    };

    selectedExercises.forEach((exercise) => {
      totalImpact.chest += exercise.chest || 0;
      totalImpact.back += exercise.back || 0;
      totalImpact.shoulders += exercise.shoulders || 0;
      totalImpact.biceps += exercise.biceps || 0;
      totalImpact.triceps += exercise.triceps || 0;
      totalImpact.legs += exercise.legs || 0;
    });

    // Calculate the grand total of all muscle impacts
    const grandTotal = Object.values(totalImpact).reduce((acc, val) => acc + val, 0);

    // If grand total is zero, set all percentages to zero
    if (grandTotal === 0) {
      setMuscleImpact({
        chest: 0,
        back: 0,
        shoulders: 0,
        biceps: 0,
        triceps: 0,
        legs: 0
      });
      return;
    }

    // Calculate percentage for each muscle group and fix to 2 decimal places
    const percentageImpact = {
      chest: parseFloat(((totalImpact.chest / grandTotal) * 100).toFixed(2)),
      back: parseFloat(((totalImpact.back / grandTotal) * 100).toFixed(2)),
      shoulders: parseFloat(((totalImpact.shoulders / grandTotal) * 100).toFixed(2)),
      biceps: parseFloat(((totalImpact.biceps / grandTotal) * 100).toFixed(2)),
      triceps: parseFloat(((totalImpact.triceps / grandTotal) * 100).toFixed(2)),
      legs: parseFloat(((totalImpact.legs / grandTotal) * 100).toFixed(2))
    };

    setMuscleImpact(percentageImpact);
  };

  const onSelect = (selectedList) => {
    if (Array.isArray(selectedList)) {
      selectedList.forEach(item => {
        console.log("Item in selectedList:", item);
        if (!item || !item.id) {
          console.error("Item is undefined or missing the 'id' property.");
        }
      });
    }
    setSelectedExercises(selectedList);
    setExerciseData(selectedList.map(ex => ({ id: ex.id, sets: '', reps: '' })));
    calculateMuscleImpact(selectedList);
  };
  
  
  const onRemove = (selectedList) => {
    console.log("Selected List on Remove: ", selectedList); 
    if (!Array.isArray(selectedList)) {
      console.error("selectedList is not an array or is undefined.");
      return;
    }
    if (selectedList.length === 0) {
      console.warn("selectedList is empty.");
    }
    setSelectedExercises(selectedList);
    setExerciseData(selectedList.map(ex => ({ id: ex.id, sets: '', reps: '' })));
    calculateMuscleImpact(selectedList);
  };
  
  

  const handleInputChange = (index, field, value) => {
    const updatedData = [...exerciseData];
    updatedData[index][field] = value;
    setExerciseData(updatedData);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (selectedExercises.length === 0) {
      setError('Please select at least one exercise');
      return;
    }

    // Validate that sets and reps are filled for each exercise
    for (let i = 0; i < exerciseData.length; i++) {
      if (!exerciseData[i].sets || !exerciseData[i].reps) {
        setError('Please provide sets and reps for all selected exercises');
        return;
      }
    }

    const data = {
      ...formData,
      exercises: exerciseData
    };

    try {
      if (editingId) {
        await axios.put(`/workout-plans/${editingId}`, data);
      } else {
        await axios.post('/workout-plans', data);
      }
      fetchWorkoutPlans();
      resetForm();
      setEditingId(null);
      setError('');
    } catch (err) {
      console.error('Error saving workout plan:', err);
      setError(err.response?.data?.message || 'Failed to save workout plan');
    }
  };

  const handleEdit = (workoutPlan) => {
    setEditingId(workoutPlan.id);
    setFormData({
      name: workoutPlan.name,
      description: workoutPlan.description
    });
    const selected = exercises.filter(ex => workoutPlan.exercises.some(e => e.id === ex.id));
    setSelectedExercises(selected);
    setExerciseData(workoutPlan.exercises.map(ex => ({ id: ex.id, sets: ex.sets, reps: ex.reps })));
    calculateMuscleImpact(selected);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/workout-plans/${id}`);
      fetchWorkoutPlans();
    } catch (err) {
      console.error('Error deleting workout plan:', err);
      setError('Failed to delete workout plan');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setSelectedExercises([]);
    setExerciseData([]);
    setError('');
    setMuscleImpact({
      chest: 0,
      back: 0,
      shoulders: 0,
      biceps: 0,
      triceps: 0,
      legs: 0
    });
  };

  /**
   * Updated Chart Data to Use Percentage Values
   */
  const chartData = {
    labels: ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs'],
    datasets: [
      {
        label: 'Muscle Impact (%)',
        data: [
          muscleImpact.chest,
          muscleImpact.back,
          muscleImpact.shoulders,
          muscleImpact.biceps,
          muscleImpact.triceps,
          muscleImpact.legs
        ],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  };

  /**
   * Chart Options Including Data Labels
   */
  const chartOptions = {
    plugins: {
      datalabels: {
        formatter: (value) => `${value}%`,
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14
        }
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 20,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    }
  };

  return (
    <div className='Mdashboard'>
      <Slidebar />
      <div className="Dash-Container">
        <Navbar />
        <div className="MMwrapper"></div>
        <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto flex space-x-4 py-4 pl-6"> {/* Added pl-6 for left padding */}
      <Link to="/ExerciseManagement" className="text-gray-800 hover:text-blue-500 font-semibold">Exercises</Link>
      <Link to="/workout-plans" className="text-gray-800 hover:text-blue-500 font-semibold">Workout Plans</Link>
      <Link to="/Assignworkout" className='text-gray-800 hover:text-blue-500 font-semibold'>Assign Workout</Link>
       </div>
      </nav>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-black">Workout Plan Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
        <form onSubmit={onSubmit}>
          {/* Workout Plan Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Workout Plan Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="e.g., Upper Body Blast"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
              placeholder="Describe the workout plan..."
            />
          </div>

          {/* Select Exercises */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Exercises
            </label>
            <Multiselect
              options={exercises} // List of exercises
              selectedValues={selectedExercises} // Preselected exercises
              onSelect={onSelect} // Function on selecting exercise
              onRemove={onRemove} // Function on removing exercise
              displayValue="name" // Property to display in the dropdown
              placeholder="Select exercises..."
              className="multiselect"
              avoidHighlightFirstOption
            />
          </div>

          {/* Sets and Reps */}
          {selectedExercises && selectedExercises.length > 0 && (
  <div className="mb-6">
    <label className="block text-gray-700 text-sm font-bold mb-2">Sets and Reps</label>
    {exerciseData && exerciseData.map((data, index) => (
      <div key={index} className="flex space-x-4 mb-4">
        <div className="flex-1">
          <label className="block text-gray-700 text-sm mb-2">{selectedExercises[index]?.name}</label>
          <input
            type="number"
            min="1"
            value={data.sets}
            onChange={(e) => handleInputChange(index, 'sets', e.target.value)}
            placeholder="Sets"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 text-sm mb-2">Reps</label>
          <input
            type="number"
            min="1"
            value={data.reps}
            onChange={(e) => handleInputChange(index, 'reps', e.target.value)}
            placeholder="Reps"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
      </div>
    ))}
  </div>
)}

          {/* Total Muscle Impact */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Total Muscle Impact (%)
            </label>
            <div className="w-64 h-64"> {/* Adjust chart size as needed */}
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {editingId ? 'Update Plan' : 'Create Plan'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Workout Plans List */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-black">Workout Plans</h2>
        {workoutPlans.length === 0 ? (
          <p>No workout plans available.</p>
        ) : (
          <ul>
            {workoutPlans.map((plan) => (
              <li key={plan.id} className="mb-4 text-black">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                  <h3 className="text-xl font-bold text-black">{plan.name}</h3>
                  <p className="mb-4 text-black">{plan.description}</p>
                  <h4 className="font-semibold text-black">Exercises:</h4>
                  <ul className="list-disc list-inside text-black">
                    {plan.exercises.map((exercise) => (
                      <li key={exercise.id} className="mb-2">
                        {exercise.name} - Sets: {exercise.sets}, Reps: {exercise.reps}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center mt-4">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </div>
    </div>
  );
};

export default WorkoutPlanManagement;
