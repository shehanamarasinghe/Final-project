import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReminderPop from '../../Components/Reminder/reminderpop';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Slidebar from "../../Components/MDashboardComponents/SlideBar/Slidebar";
import Navbar from '../../Components/MDashboardComponents/Navbar/Navbar';

function ReminderPage() {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({ title: '', startTime: '', endTime: '' });
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchReminders();
  }, [currentDate]);

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/reminders/getreminder', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      setError('Error fetching reminders. Please try again later.');
      toast.error('Error fetching reminders. Please try again later.');
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleDateClick = (date) => {
    const clickedReminder = reminders.find(reminder => {
      const reminderDate = new Date(reminder.startTime).toISOString().slice(0, 10);
      return reminderDate === date.toISOString().slice(0, 10);
    });

    setSelectedDate(date);

    if (clickedReminder) {
      setNewReminder({
        id: clickedReminder.id,
        title: clickedReminder.title,
        startTime: new Date(clickedReminder.startTime).toISOString().slice(0, 16),
        endTime: new Date(clickedReminder.endTime).toISOString().slice(0, 16),
      });
    } else {
      setNewReminder({
        title: '',
        startTime: `${date.toISOString().slice(0, 10)}T00:00`,
        endTime: `${date.toISOString().slice(0, 10)}T23:59`,
      });
    }

    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setNewReminder({ title: '', startTime: '', endTime: '' });
  };

  const handleInputChange = (e) => {
    setNewReminder({ ...newReminder, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newReminder.title || !newReminder.startTime || !newReminder.endTime) {
      alert('Please fill out all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');  // Retrieve token from localStorage
      if (newReminder.id) {
        // Update an existing reminder
        await axios.put(`/reminders/putreminders/${newReminder.id}`, newReminder, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Reminder updated successfully');
      } else {
        // Create a new reminder (exclude the ID)
        const { id, ...reminderData } = newReminder;
        await axios.post('/reminders/postreminders', reminderData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Reminder created successfully');
      }

      fetchReminders();
      closePopup();
    } catch (error) {
      setError('Error saving reminder. Please try again.');
      toast.error('Error saving reminder. Please try again.');
    }
  };

  const deleteReminder = async () => {
    try {
      const token = localStorage.getItem('token');  // Retrieve token from localStorage
      await axios.delete(`/reminders/Deletereminders/${newReminder.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchReminders();
      closePopup();
      toast.success('Reminder deleted successfully');
    } catch (error) {
      setError('Error deleting reminder. Please try again.');
      toast.error('Error deleting reminder. Please try again.');
    }
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const emptyDays = firstDayOfMonth;

  const renderRemindersForDay = (day) => {
    return reminders
      .filter((reminder) => {
        const reminderDate = new Date(reminder.startTime).toISOString().slice(0, 10);
        const currentDay = day.toISOString().slice(0, 10);
        return reminderDate === currentDay;
      })
      .map((reminder, index) => (
        <div key={index} className="bg-purple-300 text-white text-xs p-1 rounded mt-1">
          {reminder.title} {new Date(reminder.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}~
          {new Date(reminder.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      ));
  };

  return (
    <div className='Mdashboard'>
      <Slidebar />
      <div className="Dash-Container">
        <Navbar />
        <div className="MMwrapper">
          <div className="container mx-auto p-4 w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <button onClick={handlePrevMonth} className="text-gray-400 hover:text-gray-500">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 4.293a1 1 00-1.414 0L5.586 9.586a1 1 000 1.414l5.293 5.293a1 1 001.414-1.414L8.414 10l3.293-3.293a1 1 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <h2 className="text-lg font-semibold text-black">
                {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
              </h2>
              <button onClick={handleNextMonth} className="text-gray-400 hover:text-gray-500">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.707 4.293a1 1 010 1.414L4.414 10l3.293 3.293a1 1-11.414 1.414L2 10l4.293-4.293a1 1 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-4 mt-4">
              {daysOfWeek.map((day, index) => (
                <div key={index} className="text-center font-semibold text-gray-600">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: emptyDays }, (_, index) => (
                <div key={index} className="p-4"></div>
              ))}
              {daysInMonth.map((day, index) => (
                <div
                  key={index}
                  className={`border p-4 ${selectedDate && selectedDate.getTime() === day.getTime() ? 'border-blue-500' : 'border-gray-200'}`}
                  onClick={() => handleDateClick(day)}
                >
                  <div>{day.getDate()}</div>
                  {renderRemindersForDay(day)}
                </div>
              ))}
            </div>
          </div>
          {isPopupOpen && (
            <ReminderPop
              newReminder={newReminder}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              closePopup={closePopup}
              deleteReminder={deleteReminder}
            />
          )}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default ReminderPage;
