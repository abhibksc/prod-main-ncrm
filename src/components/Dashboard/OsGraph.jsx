import React from "react";
import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  RadialLinearScale,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title, RadialLinearScale);

const OsGraph = () => {
  const data = {
    labels: ["Windows", "Linux", "Chrome OS", "Mac"],
    datasets: [
      {
        label: "OS",
        data: [30, 20, 50, 40],
        backgroundColor: [
          "rgba(255, 99, 132, 0.3)",
          "rgba(54, 162, 235, 0.3)",
          "rgba(255, 206, 86, 0.3)",
          "rgba(75, 192, 192, 0.3)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#ffffff", // Set legend text color to white
        },
      },
      title: {
        display: true,
        text: "Login by OS (Last 30 days)",
        color: "#ffffff", // Set title color to white
      },
    },
    scales: {
      r: {
        ticks: {
          backdropColor: "transparent", // Adjust this if you need the backdrop
          color: "#ffffff", // Set tick color to white
        },
        grid: {
          color: "#ffffff", // Set grid color to white
        },
      },
    },
    elements: {
      arc: {
        borderColor: "#d1d5db", // Set border color for arcs to gray
        borderWidth: 2, // Set border width to make the gray ring visible
      },
    },
  };

  return (
    <div className="relative w-full" style={{ height: "50vh" }}>
      <PolarArea
        className="bg-neutral-900 text-white shadow rounded-md overflow-hidden"
        data={data}
        options={options}
      />
    </div>
  );
};

export default OsGraph;
