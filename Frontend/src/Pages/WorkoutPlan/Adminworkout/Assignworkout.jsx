import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

function AssignWorkoutPlan() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWorkoutPlans();
    fetchMembers();
  }, []);

  const fetchWorkoutPlans = () => {
    axios.get('/workout-plans')
      .then(response => setWorkoutPlans(response.data))
      .catch(error => console.error(error));
  };

  const fetchMembers = () => {
    axios.get('/getmembers/check')
      .then(response => setMembers(response.data))
      .catch(error => console.error(error));
  };

  const handleAssign = () => {
    if (!selectedPlan || selectedMembers.length === 0) {
      setMessage('Please select a workout plan and members.');
      return;
    }

    axios.post('/assignworkout/assign', {
      workout_plan_id: selectedPlan,
      memberIds: selectedMembers,
    })
    .then(() => {
      setMessage('Workout plan assigned successfully!');
      setSelectedPlan('');
      setSelectedMembers([]);
    })
    .catch(error => {
      console.error(error);
      setMessage('Failed to assign workout plan.');
    });
  };

  const handleMemberToggle = (userId) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const filteredMembers = members
      .filter(member => 
        `${member.Firstname} ${member.Lastname}`.toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .map(member => member.userid);
    
    setSelectedMembers(
      selectedMembers.length === filteredMembers.length ? [] : filteredMembers
    );
  };

  const filteredMembers = members.filter(member =>
    `${member.Firstname} ${member.Lastname}`.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-black">Assign Workout Plan to Members</h2>

      {message && (
        <div className={`p-4 mb-4 ${message.includes('successfully') ? 'bg-green-100' : 'bg-red-100'} text-black rounded`}>
          {message}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-black mb-2">Select Workout Plan:</label>
        <select
          className="border p-2 rounded-lg w-full bg-white"
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value)}
        >
          <option value="">-- Select Workout Plan --</option>
          {workoutPlans.map(plan => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-black mb-2">Select Members:</label>
        <div className="mb-2 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search members..."
              className="border p-2 pl-8 rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={handleSelectAll}
            className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
          >
            {selectedMembers.length === filteredMembers.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        
        <div className="border rounded-lg max-h-60 overflow-y-auto">
          {filteredMembers.map(member => (
            <div
              key={member.userid}
              className="flex items-center p-2 hover:bg-gray-50 border-b last:border-b-0"
            >
              <input
                type="checkbox"
                id={`member-${member.userid}`}
                checked={selectedMembers.includes(member.userid)}
                onChange={() => handleMemberToggle(member.userid)}
                className="mr-2"
              />
              <label
                htmlFor={`member-${member.userid}`}
                className="flex-1 cursor-pointer"
              >
                {member.Firstname} {member.Lastname}
              </label>
            </div>
          ))}
          {filteredMembers.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No members found
            </div>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {selectedMembers.length} members selected
        </div>
      </div>

      <button
        onClick={handleAssign}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        disabled={!selectedPlan || selectedMembers.length === 0}
      >
        Assign Workout Plan
      </button>
    </div>
  );
}

export default AssignWorkoutPlan;