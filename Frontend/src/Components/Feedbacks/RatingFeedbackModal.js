import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Dumbbell } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';


function MemberWorkoutPlansPreview() {
    const [expandedPlan, setExpandedPlan] = useState(null);
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    const COLORS = [
        '#FF4B4B',  
        '#FF8C3B', 
        '#FFD93D',  
        '#4BC0C0',   
        '#4B7BFF',  
        '#9B4BFF'  
      ];

    useEffect(() => {
        fetchWorkoutPlans();
    }, []);
        const fetchWorkoutPlans = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token'); // Replace with the token key you're using
        
                if (!token) {
                    throw new Error('No token found');
                }
        
                const response = await fetch(`/assignworkout/assigned-plans`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Correct format for Authorization header
                    },
                });
        
                if (!response.ok) {
                    throw new Error(`Failed to fetch workout plans: ${response.statusText}`);
                }
        
                const data = await response.json();
                setWorkoutPlans(data);
            } catch (error) {
                console.error('Failed to fetch workout plans:', error);
            } finally {
                setLoading(false);
            }
        };
        

    const calculatePlanMuscleImpact = (exercises) => {
        const impact = {
            chest: 0, back: 0, shoulders: 0,
            biceps: 0, triceps: 0, legs: 0,
        };

        exercises.forEach((exercise) => {
            Object.keys(impact).forEach((muscle) => {
                impact[muscle] += exercise[muscle] * exercise.sets;
            });
        });

        return Object.entries(impact)
            .map(([name, value]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                value: value,
            }))
            .filter((item) => item.value > 0);
    };

    const getExerciseImpactData = (exercise) => {
        return [
            { name: 'Chest', value: exercise.chest },
            { name: 'Back', value: exercise.back },
            { name: 'Shoulders', value: exercise.shoulders },
            { name: 'Biceps', value: exercise.biceps },
            { name: 'Triceps', value: exercise.triceps },
            { name: 'Legs', value: exercise.legs },
        ].filter((item) => item.value > 0);
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border rounded shadow">
                    <p className="text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return <div>Loading workout plans...</div>;
    }

    if (workoutPlans.length === 0) {
        return <div>No workout plans assigned.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                <Dumbbell className="mr-2" />
                My Workout Plans
            </h1>

            <div className="space-y-4 text-gray-800">
                {workoutPlans.map((plan) => (
                    <div
                        key={plan.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        <div
                            className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                            onClick={() =>
                                setExpandedPlan(expandedPlan === plan.id ? null : plan.id)
                            }
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
                                    <div className="mb-6">
                                        <h3 className="font-semibold mb-3 text-black">Overall Workout Impact</h3>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={calculatePlanMuscleImpact(plan.exercises)}
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {calculatePlanMuscleImpact(plan.exercises).map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={COLORS[index % COLORS.length]}
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <h3 className="font-semibold mb-3">Exercises</h3>
                                    <div className="space-y-6">
                                        {plan.exercises.map((exercise) => (
                                            <div
                                                key={exercise.id}
                                                className="bg-gray-50 p-4 rounded-lg"
                                            >
                                                <div className="flex flex-col lg:flex-row lg:gap-6">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">{exercise.name}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {exercise.description}
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-2">
                                                            {exercise.sets} sets × {exercise.reps} reps
                                                        </p>
                                                    </div>
                                                    <div className="mt-4 lg:mt-0 h-48 lg:h-64 w-full lg:w-64">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <PieChart>
                                                                <Pie
                                                                    data={getExerciseImpactData(exercise)}
                                                                    dataKey="value"
                                                                    nameKey="name"
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    outerRadius={80}
                                                                >
                                                                    {getExerciseImpactData(exercise).map(
                                                                        (entry, index) => (
                                                                            <Cell
                                                                                key={`cell-${index}`}
                                                                                fill={
                                                                                    COLORS[
                                                                                        index % COLORS.length
                                                                                    ]
                                                                                }
                                                                            />
                                                                        )
                                                                    )}
                                                                </Pie>
                                                                <Tooltip content={<CustomTooltip />} />
                                                                <Legend />
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MemberWorkoutPlansPreview;
