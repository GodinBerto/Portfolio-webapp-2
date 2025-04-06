"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = () => {
  const data = {
    labels: [
      "Presale",
      "Liquidity mining & incentives",
      "Ecosystem growth",
      "Airdrop reserve",
      "Liquidity",
      "Partnerships",
      "Incentives & giveaways",
      "Team & founders",
    ],
    datasets: [
      {
        data: [45.5, 10, 10, 10, 10, 5, 5, 4.5],
        backgroundColor: [
          "#3066BE",
          "#2E8BC0",
          "#3FA7D6",
          "#78C4D4",
          "#BCE6EB",
          "#AEDFF7",
          "#90CAF9",
          "#1442b2",
        ],
        borderWidth: 4,
        cutout: "60%",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="relative w-[400px] h-[400px] mx-auto">
      <Doughnut data={data} options={options} />
      <div className="absolute top-1/2 left-1/2 w-28 h-28 rounded-full transform -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.9),rgba(255,235,59,0.3))] z-10" />
    </div>
  );
};

export default DonutChart;
