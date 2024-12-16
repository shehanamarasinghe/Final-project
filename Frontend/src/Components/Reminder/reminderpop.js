import React from 'react';

function ReminderPop({ newReminder, handleInputChange, handleSubmit, closePopup, deleteReminder }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">{newReminder.id ? 'Edit Reminder' : 'New Reminder'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={newReminder.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={newReminder.startTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={newReminder.endTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">
              {newReminder.id ? 'Update' : 'Create'}
            </button>
            {newReminder.id && (
              <button type="button" onClick={deleteReminder} className="bg-red-500 text-white px-4 py-2 rounded-lg mx-2">
                Delete
              </button>
            )}
            <button type="button" onClick={closePopup} className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-2">
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReminderPop;
