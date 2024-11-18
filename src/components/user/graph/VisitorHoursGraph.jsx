import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const VisitorHoursGraph = () => {
  const data = [
    { hours: 0, visitors: 20 },
    { hours: 5, visitors: 12 },
    { hours: 10, visitors: 18 },
    { hours: 15, visitors: 22 },
    { hours: 20, visitors: 28 },
    { hours: 25, visitors: 18 },
    { hours: 30, visitors: 12 },
  ];

  return (
    <div className="bg-gray-800 text-gray-200 p-6 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Visitors / Hours</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis dataKey="hours" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitorHoursGraph;
