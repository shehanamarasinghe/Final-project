import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AssignMealPlan() {
  const [members, setMembers] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedMealPlan, setSelectedMealPlan] = useState('');

  useEffect(() => {
    fetchMembers();
    fetchMealPlans();
  }, []);

  const fetchMembers = () => {
    axios.get('/getmembers/check')  // API to fetch members from login table
      .then(response => setMembers(response.data))
      .catch(error => console.error(error));
  };

  const fetchMealPlans = () => {
    axios.get('AdminMeal/meal-plans')  // API to fetch meal plans
      .then(response => setMealPlans(response.data))
      .catch(error => console.error(error));
  };

  const handleAssign = () => {
    if (selectedMember && selectedMealPlan) {
      axios.post('/meal-plans/assign', {
        userid: selectedMember,
        meal_plan_id: selectedMealPlan
      })
      .then(() => alert('Meal plan assigned successfully!'))
      .catch(error => console.error(error));
    } else {
      alert('Please select a member and a meal plan.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-black">Assign Meal Plan to Member</h2>

      <div className="mb-4">
        <label className="block text-black mb-2">Select Member:</label>
        <select
          className="border p-2 rounded-lg w-full"
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
        >
          <option value="">-- Select Member --</option>
          {members.map(member => (
            <option key={member.userid} value={member.userid}>
              {member.Firstname} {member.Lastname}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-black mb-2">Select Meal Plan:</label>
        <select
          className="border p-2 rounded-lg w-full"
          value={selectedMealPlan}
          onChange={(e) => setSelectedMealPlan(e.target.value)}
        >
          <option value="">-- Select Meal Plan --</option>
          {mealPlans.map(plan => (
            <option key={plan.id} value={plan.id}>
              {plan.category_name} - {plan.meal_type}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAssign}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
      >
        Assign Meal Plan
      </button>
    </div>
  );
}

export default AssignMealPlan;
