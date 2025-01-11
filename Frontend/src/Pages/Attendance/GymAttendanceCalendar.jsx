import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../Components/ui/card.jsx';
import { Clock, Calendar, TrendingUp, Timer, ChevronLeft, ChevronRight, User } from 'lucide-react';
import axios from 'axios';

const GymAttendanceCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({
    daysAttended: 0,
    avgDuration: 0,
    peakHour: null
  });

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get('/attendancecalendar/attendance', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/attendancecalendar/attendance/stats', {
        params: { month: selectedMonth + 1, year: selectedYear },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCheckIn = async () => {
    try {
      await axios.post('/attendancecalendar/attendance/check-in', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAttendanceData();
      fetchStats();
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await axios.post('/attendancecalendar/attendance/check-out', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAttendanceData();
      fetchStats();
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
    fetchStats();
  }, [selectedMonth, selectedYear]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const totalDays = getDaysInMonth(selectedYear, selectedMonth);
  const attendedDays = attendanceData.filter(a => {
    const date = new Date(a.date);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  }).length;

  const generateCalendarDays = () => {
    const days = [];
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-32 bg-gray-50/30 rounded-lg border border-gray-100/50" />
      );
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const attendance = attendanceData.find(a => a.date === dateStr);
      const isSelected = selectedDate === dateStr;

      days.push(
        <div 
          key={day} 
          onClick={() => setSelectedDate(dateStr)}
          className={`h-32 rounded-lg border border-gray-100/50 p-3 cursor-pointer transition-all duration-300 
            ${attendance ? 'hover:shadow-lg hover:border-blue-200 bg-gradient-to-br from-blue-50/50 to-white' : 'hover:bg-gray-50'} 
            ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}
          `}
        >
          <div className="flex justify-between items-start">
            <span className={`font-medium text-sm ${attendance ? 'text-blue-600' : 'text-gray-600'}`}>
              {day}
            </span>
            {attendance && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                <span className="h-2 w-2 rounded-full bg-green-500" />
              </span>
            )}
          </div>
          {attendance && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <Clock className="w-3 h-3" />
                {attendance.checkIn.slice(0, 5)}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Timer className="w-3 h-3" />
                {attendance.duration}
              </div>
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'];

  const changeMonth = (delta) => {
    let newMonth = selectedMonth + delta;
    let newYear = selectedYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    setSelectedDate(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Fitness Journey</h2>
            <p className="text-gray-500">Track your gym attendance and progress</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleCheckIn}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Check In
          </button>
          <button
            onClick={handleCheckOut}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Check Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { icon: Calendar, title: "Days Attended", value: attendedDays, subtext: `out of ${totalDays} days`, color: "blue" },
          { icon: TrendingUp, title: "Attendance Rate", value: `${((attendedDays / totalDays) * 100).toFixed(1)}%`, subtext: "monthly average", color: "green" },
          { icon: Timer, title: "Avg. Duration", value: `${Math.round(stats.avgDuration)}m`, subtext: "per session", color: "purple" },
          { icon: Clock, title: "Peak Time", value: stats.peakHour?.slice(0, 5) || "-", subtext: "most active hour", color: "orange" }
        ].map(({ icon: Icon, title, value, subtext, color }) => (
          <Card key={title} className="group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{title}</span>
              </div>
              <div className="text-3xl font-bold tracking-tight group-hover:scale-105 transition-transform duration-300">
                {value}
              </div>
              <div className="text-sm text-gray-500">{subtext}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50/50 to-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-800">
              Attendance Calendar
            </CardTitle>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => changeMonth(-1)}
                className="p-2 rounded-full hover:bg-blue-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-blue-600" />
              </button>
              <span className="text-lg font-medium min-w-[200px] text-center">
                {months[selectedMonth]} {selectedYear}
              </span>
              <button 
                onClick={() => changeMonth(1)}
                className="p-2 rounded-full hover:bg-blue-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center py-2 font-medium text-gray-400 text-sm">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-4">
            {generateCalendarDays()}
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Session Details - {selectedDate}
            </h3>
            <div className="space-y-4">
              {attendanceData.filter(a => a.date === selectedDate).map((session, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Check-in: {session.checkIn}</div>
                      <div className="text-sm text-gray-500">Duration: {session.duration}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Check-out: {session.checkOut || 'In Progress'}</div>
                    <div className="text-sm text-gray-500">Status: {session.checkOut ? 'Completed' : 'Active'}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GymAttendanceCalendar;