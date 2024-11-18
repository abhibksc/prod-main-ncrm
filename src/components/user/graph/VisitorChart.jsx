import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement
);

const VisitorChart = () => {
  const data = {
    labels: [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
    ],
    datasets: [
      {
        label: "Visitors",
        data: [5, 8, 12, 15, 20, 23, 25, 20, 18, 16, 12, 10, 8, 6, 4], // Example data
        borderColor: "#00bcd4",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, "rgba(0, 188, 212, 0)");
          gradient.addColorStop(1, "rgba(0, 188, 212, 0.3)");

          return gradient;
        },
        fill: true,
        tension: 0.4, // Smooth curve
        pointBackgroundColor: "#fff",
        pointBorderColor: "#00bcd4",
        pointHoverBackgroundColor: "#00bcd4",
        pointHoverBorderColor: "#fff",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            return `${context.raw} visitors at ${context.label}:00`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Hours",
          color: "#aaa",
        },
      },
      y: {
        display: true,
        min: 0,
        max: 30,
        title: {
          display: true,
          text: "Visitors",
          color: "#aaa",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default VisitorChart;
