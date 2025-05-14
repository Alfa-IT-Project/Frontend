import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = ({ data }) => {
  return (
    <div className="w-full h-64">
      <Doughnut
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }} />
    </div>
  );
};

export default Chart; 