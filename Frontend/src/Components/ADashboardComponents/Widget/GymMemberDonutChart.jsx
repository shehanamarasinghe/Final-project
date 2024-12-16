import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, ArrowRight } from 'lucide-react';
import axios from 'axios';

const GymMemberDonutChart = () => {
  const [data, setData] = useState([
    { name: 'Registered Members', value: 0 },
    { name: 'Current Attendance', value: 0 }
  ]);
  const COLORS = ['#3B82F6', '#10B981'];

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
    <div className="w-full max-w-xs mx-auto bg-white shadow-lg rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <Users className="mr-2" /> Gym Membership
        </h2>
      </div>
      
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Registered</p>
          <p className="text-xl font-bold text-blue-600">{data[0].value}</p>
        </div>
        <ArrowRight className="text-gray-400" />
        <div className="text-center">
          <p className="text-sm text-gray-600">Current</p>
          <p className="text-xl font-bold text-green-600">{data[1].value}</p>
        </div>
      </div>
    </div>
  );
};

export default GymMemberDonutChart;
