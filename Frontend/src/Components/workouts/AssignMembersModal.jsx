import React, { useEffect, useState } from 'react';
import axios from 'axios';

{isAssignModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Assign Members</h2>
        <ul className="max-h-40 overflow-y-auto mb-4">
          {members.map((member) => (
            <li key={member.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`member-${member.id}`}
                value={member.id}
                onChange={() => handleMemberSelect(member.id)}
                checked={selectedMembers.includes(member.id)}
              />
              <label htmlFor={`member-${member.id}`} className="ml-2">
                {member.name}
              </label>
            </li>
          ))}
        </ul>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-4 rounded"
            onClick={closeAssignModal}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded"
            onClick={assignWorkoutPlan}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  )}
  