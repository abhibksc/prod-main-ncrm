import React from "react";
import Chart from "react-apexcharts";

const TransitionReportGraph = () => {
  const options = {
    chart: {
      type: "area",
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
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2023-01-01T00:00:00",
        "2023-02-01T00:00:00",
        "2023-03-01T00:00:00",
        "2023-04-01T00:00:00",
        "2023-05-01T00:00:00",
        "2023-06-01T00:00:00",
      ],
      labels: {
        style: {
          colors: "#ffffff", // Set x-axis labels color to white
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
          colors: "#ffffff", // Set y-axis labels color to white
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
      y: {
        style: {
          color: "#ffffff", // Set tooltip text color to white
        },
      },
    },
    fill: {
      opacity: 0.8,
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.4,
        gradientToColors: undefined,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.2,
        stops: [0, 100],
      },
    },
    colors: ["#34D399", "#F87171"], // Customize colors for positive and negative values
    legend: {
      labels: {
        colors: "#ffffff", // Set legend labels color to white
        fontSize: "14px",
      },
      position: "top",
      horizontalAlign: "center",
    },
    title: {
      text: "Transactions Report (Last 30 Days)",
      align: "center",
      margin: 10,
      offsetY: 20,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#fff", // Set title color to white
      },
    },
  };

  const series = [
    {
      name: "Positive Transitions",
      data: [30, 40, 35, 50, 49, 60],
    },
    {
      name: "Negative Transitions",
      data: [-20, -30, -25, -15, -29, -10],
    },
  ];

  return (
    <div className="relative w-full" style={{ height: "50vh" }}>
      <Chart options={options} series={series} type="area" height="100%" />
    </div>
  );
};

export default TransitionReportGraph;
