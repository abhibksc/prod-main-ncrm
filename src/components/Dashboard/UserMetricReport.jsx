import { Users, UserCheck, Mail, Smartphone } from "lucide-react";

const MetricItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between p-3 border-b last:border-b-0">
    <div className="flex items-center">
      <Icon className="w-5 h-4 mr-3 text-primary-200" />
      <span className=" text-xs font-medium text-white">{label}</span>
    </div>
    <span className="text-sm font-semibold text-white">{value}</span>
  </div>
);

const UserMetricReport = () => {
  const metrics = [
    { icon: Users, label: "Total Users", value: 5 },
    { icon: UserCheck, label: "Active Users", value: 5 },
    { icon: Mail, label: "Email Unverified Users", value: 0 },
    { icon: Smartphone, label: "Mobile Unverified Users", value: 0 },
  ];

  return (
    <div className=" bg-neutral-900  h-[15rem] text-white shadow rounded-md overflow-hidden max-w-lg">
      <h2 className="text-xl font-semibold p-2 bg-primary-500">User Metrics</h2>
      <div className="divide-y divide-primary-200">
        {metrics.map((metric, index) => (
          <MetricItem key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default UserMetricReport;
