import React from 'react';

function ReminderList({ reminders }) {
  return (
    <ul className="mt-6">
      {reminders.map((reminder) => (
        <li key={reminder.id} className="bg-gray-100 p-2 mb-2 rounded shadow">
          <h3 className="font-semibold text-black">{reminder.title}</h3>
          <p>
            From: {new Date(reminder.startTime).toLocaleString()} To: {new Date(reminder.endTime).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default ReminderList;
