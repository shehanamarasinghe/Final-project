// ExerciseManagement.jsx
import React, { useState, useEffect } from 'react';
import ExerciseDonutChart from './ExerciseDonutChart';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Slidebar from "../../../Components/ADashboardComponents/SlideBar/Slidebar";
import Navbar from '../../../Components/ADashboardComponents/Navbar/Navbar';
import { Link } from 'react-router-dom';
const ExerciseManagement = () => {
  const [exercises, setExercises] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      chest: 0,
      back: 0,
      shoulders: 0,
      biceps: 0,
      triceps: 0,
      legs: 0
    }
  });

  const muscleGroups = watch(['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs']);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get('/exercises');
      setExercises(response.data);
    } catch (err) {
      setError('Failed to fetch exercises');
    }
  };

  const validateTotalPercentage = (data) => {
    const total = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs']
      .reduce((sum, group) => sum + Number(data[group]), 0);
    if (total !== 100) {
      setError('Muscle group percentages must add up to 100%');
      return false;
    }
    setError('');
    return true;
  };

  const onSubmit = async (data) => {
    if (!validateTotalPercentage(data)) return;

    try {
      if (editingId) {
        await axios.put(`/exercises/${editingId}`, data);
      } else {
        await axios.post('/exercises', data);
      }
      fetchExercises();
      reset();
      setEditingId(null);
    } catch (err) {
      setError('Failed to save exercise');
    }
  };

  const handleEdit = (exercise) => {
    setEditingId(exercise.id);
    reset({
      name: exercise.name,
      description: exercise.description,
      chest: exercise.chest,
      back: exercise.back,
      shoulders: exercise.shoulders,
      biceps: exercise.biceps,
      triceps: exercise.triceps,
      legs: exercise.legs
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/exercises/${id}`);
      fetchExercises();
    } catch (err) {
      setError('Failed to delete exercise');
    }
  };

  const formatChartData = (exercise) => {
    return [
      { name: 'Chest', percentage: exercise.chest },
      { name: 'Back', percentage: exercise.back },
      { name: 'Shoulders', percentage: exercise.shoulders },
      { name: 'Biceps', percentage: exercise.biceps },
      { name: 'Triceps', percentage: exercise.triceps },
      { name: 'Legs', percentage: exercise.legs }
    ].filter(item => item.percentage > 0);
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
      <h1 className="text-3xl font-bold mb-8 text-black">Exercise Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Exercise Name
            </label>
            <input
              type="text"
              {...register('name', { required: true })}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
              placeholder="e.g., Dumbbell Curl"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">This field is required</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              {...register('description', { required: true })}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.description ? 'border-red-500' : ''}`}
              rows="3"
              placeholder="Describe the exercise..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">This field is required</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Muscle Group Impact (%)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs'].map((muscle) => (
                <div key={muscle}>
                  <label className="block text-gray-700 text-sm mb-1 capitalize">
                    {muscle}
                  </label>
                  <input
                    type="number"
                    {...register(muscle, { required: true, min: 0, max: 100 })}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors[muscle] ? 'border-red-500' : ''}`}
                    min="0"
                    max="100"
                  />
                  {errors[muscle] && <p className="text-red-500 text-xs mt-1">Enter a value between 0 and 100</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {editingId ? 'Update Exercise' : 'Add Exercise'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { reset(); setEditingId(null); setError(''); }}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-gray-800 font-bold">{exercise.name}</h2>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(exercise)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exercise.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{exercise.description}</p>
            <ExerciseDonutChart muscleData={formatChartData(exercise)} />
          </div>
        ))}
      </div>
    </div>
    </div>
    </div>
  );
};

export default ExerciseManagement;
