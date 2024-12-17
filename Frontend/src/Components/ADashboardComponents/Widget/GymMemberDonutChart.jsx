import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Users } from 'lucide-react';
import axios from 'axios';

const GymMemberDonutChart = () => {
  const [data, setData] = useState([
    { name: 'Registered Members', value: 0 },
    { name: 'Current Attendance', value: 0 }
  ]);

  const COLORS = ['#d81b60', '#039be5'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersResponse, attendanceResponse] = await Promise.all([
          axios.get('/dashboard-widget/count'),
          axios.get('/dashboard-widget/live-count')
        ]);
        setData([
          { name: 'Registered Members', value: membersResponse.data.count },
          { name: 'Current Attendance', value: attendanceResponse.data.count }
        ]);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-between">
      <div className="w-2/3 h-full flex flex-col justify-center">
        
        
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie 
              data={data} 
              cx="50%" 
              cy="50%" 
              innerRadius="50%" 
              outerRadius="80%" 
              paddingAngle={5} 
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="w-1/3 pl-4 flex flex-col justify-center">
        <div className="mb-4">
          <p className="text-sm text-gray-500">Total Registered</p>
          <p className="text-2xl font-bold text-pink-600">{data[0].value}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Current</p>
          <p className="text-2xl font-bold text-cyan-600">{data[1].value}</p>
        </div>
      </div>
    </div>
  );
};

export default GymMemberDonutChart;