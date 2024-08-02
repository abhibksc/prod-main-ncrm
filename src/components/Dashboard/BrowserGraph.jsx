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

const BrowserGraph = () => {
  const data = {
    labels: ["Chrome", "Edge", "Firefox", "Safari", "Opera", "Brave"],
    datasets: [
      {
        label: "Browser",
        data: [30, 20, 50, 40, 60],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
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
        text: "Login by browser (Last 30 days)",
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
        borderColor: "#fff", // Set border color for arcs to white
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

export default BrowserGraph;
