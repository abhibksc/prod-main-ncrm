import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserLineChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Sample Data",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "#42A5F5",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white", // Set legend text color to white
        },
      },
      title: {
        display: true,
        text: "Line Chart Example",
        color: "white", // Set title text color to white
      },
      tooltip: {
        titleColor: "white", // Set tooltip title color to white
        bodyColor: "white", // Set tooltip body color to white
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white", // Set x-axis text color to white
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Optional: Set x-axis grid line color to a lighter white
        },
      },
      y: {
        ticks: {
          color: "white", // Set y-axis text color to white
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Optional: Set y-axis grid line color to a lighter white
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default UserLineChart;
