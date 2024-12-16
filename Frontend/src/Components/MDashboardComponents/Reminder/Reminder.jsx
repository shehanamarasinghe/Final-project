import React, { useState, useEffect } from 'react';
import "./Reminder.css";
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ReminderPop from '../../Reminder/reminderpop';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reminder = () => {
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    title: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    fetchReminders();
  }, []);

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
      toast.error('Error fetching reminders. Please try again later.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReminder(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (newReminder.id) {
        await axios.put(`/reminders/putreminders/${newReminder.id}`, newReminder, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Reminder updated successfully');
      } else {
        const { id, ...reminderData } = newReminder;
        await axios.post('/reminders/postreminders', reminderData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Reminder created successfully');
      }
      setShowAddReminder(false);
      fetchReminders();
    } catch (error) {
      toast.error('Error saving reminder. Please try again.');
    }
  };

  const deleteReminder = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/reminders/Deletereminders/${newReminder.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowAddReminder(false);
      fetchReminders();
      toast.success('Reminder deleted successfully');
    } catch (error) {
      toast.error('Error deleting reminder. Please try again.');
    }
  };

  const openAddReminderPopup = () => {
    setNewReminder({
      title: '',
      startTime: '',
      endTime: ''
    });
    setShowAddReminder(true);
  };

  const getClosestReminders = () => {
    const sortedReminders = [...reminders].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    return sortedReminders.slice(0, 3);
  };

  const closestReminders = getClosestReminders();

  return (
    <div className='Reminders'>
      <div className="top-R">
        <h1 className="title-R">Reminders</h1>
        <NotificationsActiveRoundedIcon fontSize='small'/>
      </div>
      <div className="bottom-R">
        {closestReminders.map((reminder, index) => (
          <div key={index} className="notifications">
            <div className="n-icon">
              {reminder.title === "Workshop" ? (
                <VolumeUpRoundedIcon />
              ) : (
                <CreateRoundedIcon />
              )}
            </div>
            <div className="n-content">
              <div className="n-info">
                <h3 className="n-header">{reminder.title}</h3>
                <small className="text_muted">
                  {new Date(reminder.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(reminder.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </small>
              </div>
              <MoreVertRoundedIcon />
            </div>
          </div>
        ))}

        <div className="notifications add-reminder">
          <div onClick={openAddReminderPopup} className="add-icon">
            <AddRoundedIcon/>
            <h3 className='add-reminder'>Add Reminder</h3>
          </div>
        </div>
      </div>
      
      {showAddReminder && (
        <ReminderPop 
          newReminder={newReminder}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          closePopup={() => setShowAddReminder(false)}
          deleteReminder={deleteReminder}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default Reminder;
