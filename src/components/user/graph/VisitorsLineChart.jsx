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

const data = [
  { hours: 0, visitors: 0 },
  { hours: 1, visitors: 1 },
  { hours: 2, visitors: 2 },
  { hours: 3, visitors: 3 },
  { hours: 4, visitors: 8 },
  { hours: 5, visitors: 15 },
  { hours: 6, visitors: 22 },
  { hours: 7, visitors: 25 },
  { hours: 8, visitors: 23 },
  { hours: 9, visitors: 18 },
  { hours: 10, visitors: 14 },
  { hours: 11, visitors: 12 },
  { hours: 12, visitors: 11 },
  { hours: 13, visitors: 10 },
  { hours: 14, visitors: 9 },
  { hours: 15, visitors: 8 },
  { hours: 16, visitors: 7 },
  { hours: 17, visitors: 6 },
  { hours: 18, visitors: 5 },
  { hours: 19, visitors: 4 },
  { hours: 20, visitors: 3 },
  { hours: 21, visitors: 2 },
  { hours: 22, visitors: 1 },
  { hours: 23, visitors: 0 },
];

const VisitorsLineChart = () => {
  return (
    <div className="relative w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="hours" />
          <YAxis type="number" domain={[0, "dataMax"]} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="visitors" stroke="#6CA6CD" />
        </LineChart>
      </ResponsiveContainer>
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-gray-100 to-transparent"></div>
    </div>
  );
};

export default VisitorsLineChart;
