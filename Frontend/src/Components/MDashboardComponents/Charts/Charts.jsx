import React from 'react'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {Chart as ChartJS} from "chart.js/auto";
import {Bar} from "react-chartjs-2";
import revenueData from "./revenueData.json"

const Charts = () => {
  return (
    <div className='w-full md:w-[600px] lg:w-[600px] shadow-lg rounded-lg p-4 h-[400px]'>
      <div className="flex items-center justify-between text-gray-500 mb-4">
        <h1 className="text-lg font-medium">Chart</h1>
        <MoreVertRoundedIcon fontSize='small'/>
      </div>
      <div className="h-full">
        <Bar
          data={{
            labels: revenueData.map((data) => data.label),
            datasets: [
              {
                label: "Members",
                data: revenueData.map((data) => data.crowd),
                backgroundColor: "#0097a7",
                borderColor: "#064FF0",
              },
            ],
          }}
          options={{
            maintainAspectRatio: false, 
            elements: {
              bar: {
                tension: 0.5,
              },
            },
          }}
        />
      </div>
    </div>
  )
}

export default Charts
