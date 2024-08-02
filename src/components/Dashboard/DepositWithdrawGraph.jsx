import React from "react";
import Chart from "react-apexcharts";

const DepositWithdrawGraph = () => {
  const options = {
    chart: {
      type: "bar",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "round", // Fully round the columns
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          colors: "#ffffff", // Set month labels to white
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Amount",
        style: {
          color: "#ffffff", // Set y-axis title color to white
          fontSize: "14px",
        },
      },
      labels: {
        style: {
          colors: "#ffffff", // Set y-axis labels to white
          fontSize: "12px",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `$ ${val}`;
        },
      },
    },
    title: {
      text: "Monthly Deposit & Withdraw Report (Last 12 Months)",
      align: "center",
      margin: 10,
      offsetY: 20,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#fff", // Set title color to white
      },
    },
    legend: {
      labels: {
        colors: "#ffffff", // Set legend labels color to white
        fontSize: "14px",
      },
      position: "top",
      horizontalAlign: "center",
    },
    colors: ["#34D399", "#F87171"], // Custom colors for deposit and withdraw
  };

  const series = [
    {
      name: "Deposit",
      data: [
        3000, 4000, 3500, 5000, 4900, 6000, 7000, 8000, 8500, 9000, 10000,
        11000,
      ],
    },
    {
      name: "Withdraw",
      data: [
        2000, 3000, 2500, 1500, 2900, 2000, 3000, 4000, 4500, 5000, 6000, 7000,
      ],
    },
  ];

  return (
    <div className="relative w-full" style={{ height: "50vh" }}>
      <Chart options={options} series={series} type="bar" height="100%" />
    </div>
  );
};

export default DepositWithdrawGraph;
