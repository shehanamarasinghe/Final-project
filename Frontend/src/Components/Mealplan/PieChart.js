// src/components/PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

function PieChart({ data }) {
    const chartData = {
        labels: ['Carbohydrates', 'Proteins', 'Vitamins', 'Calories'],
        datasets: [
            {
                data: [data.carbohydrates, data.protein, data.vitamins, data.calories],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#00FF00'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#00FF00'],
            },
        ],
    };

    const options = {
        maintainAspectRatio: false, 
    };

    return (
        <div style={{ width: '300px', height: '300px' }}> {/* Set desired width and height */}
            <Pie data={chartData} options={options} />
        </div>
    );
}

export default PieChart;
