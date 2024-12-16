import React from 'react';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { Line } from "react-chartjs-2"; 
import revenueData from "./revenueData.json";

const Charts = () => {
  return (
    <div className='flex-2 shadow-md rounded-lg p-2.5 h-96 w-[550px]'> {/* Set the desired width here */}
      <div className="flex items-center justify-between text-gray-500">
        <h1 className="text-gray-500 text-lg font-normal">Line Chart</h1> 
        <MoreVertRoundedIcon fontSize='small'/>
      </div>
      <div className="w-full h-[calc(100%-40px)]">
        <Line 
          data={{
            labels: revenueData.map((data) => data.label),
            datasets: [
              {
                label: "Members",
                data: revenueData.map((data) => data.crowd),
                backgroundColor: "rgba(6, 79, 240, 0.2)",
                borderColor: "#064FF0",
                borderWidth: 2,
                pointBackgroundColor: "#064FF0",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverBackgroundColor: "#ffffff",
                pointHoverBorderColor: "#064FF0",
                pointHoverBorderWidth: 2,
                tension: 0.4, // Adjust curvature here
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false, 
            plugins: {
              legend: {
                display: true,
                position: 'bottom', 
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1, // Set the step size to 1
                  max: 7 // Set the maximum value to extend the y-axis
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Charts;
