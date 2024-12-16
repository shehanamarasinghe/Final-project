import React, { useEffect, useState, useContext } from 'react';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import AuthContext from '../../../Context/authContext'; 
import { format } from 'date-fns'; 
const Charts = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext); 

  useEffect(() => {

    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get('/attendance/daily-attendance', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setAttendanceData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Prepare the data for the chart
  const labels = attendanceData.map((data) => format(new Date(data.date), 'dd MMM')); // Format to get only date and month (e.g., "12 Oct")
  const counts = attendanceData.map((data) => data.count); // Attendance count per day

  return (
    <div className="flex-1 p-4 shadow-lg rounded-lg h-96 bg-white w-[400px]"> {/* Set desired width here */}
      <div className="flex items-center justify-between text-gray-500 mb-4">
        <h1 className="text-lg font-medium text-black">Attendance for the Last 7 Days</h1>
        <MoreVertRoundedIcon fontSize="small" />
      </div>
      <div className="h-64">
        <Bar
          data={{
            labels: labels, // X-axis labels (formatted dates)
            datasets: [
              {
                label: 'Daily Attendance',
                data: counts, // Y-axis values (attendance counts)
                backgroundColor: '#064FF0',
                borderColor: '#064FF0',
              },
            ],
          }}
          options={{
            elements: {
              bar: {
                tension: 0.5,
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Attendance Count',
                },
                beginAtZero: true,
                ticks: {
                  precision: 0, // Ensure only real (integer) numbers on Y-axis
                  stepSize: 1,  // Ensure step size is 1 for whole numbers
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Charts;
