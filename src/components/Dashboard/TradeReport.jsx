import {
  Users,
  UserCheck,
  Mail,
  Smartphone,
  Percent,
  ShieldX,
  Loader,
  BadgeDollarSign,
  Scissors,
  ArrowRightCircleIcon,
  ArrowLeftCircle,
  ShoppingBasket,
} from "lucide-react";

const MetricItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between p-3 border-b last:border-b-0">
    <div className="flex items-center">
      <Icon className="w-5 h-4 mr-3 text-primary-200" />
      <span className="text-xs font-medium text-white">{label}</span>
    </div>
    <span className="text-sm font-semibold text-white">{value}</span>
  </div>
);

const TradeReport = () => {
  const metrics = [
    { icon: Scissors, label: "Total Withdrawn", value: 12 },
    { icon: ShoppingBasket, label: "Total IB accounts", value: 9 },
    { icon: ArrowLeftCircle, label: "Pending Withdraw", value: 4 },
    { icon: ArrowRightCircleIcon, label: "Total MT5 Accounts", value: 24 },
  ];

  return (
    <div className=" bg-neutral-900 h-[15rem] text-white shadow rounded-md overflow-hidden max-w-lg">
      <h2 className="text-xl font-semibold p-3 bg-primary-500">
        Trade accounts and Withdrawal
      </h2>
      <div className="divide-y divide-primary-200">
        {metrics.map((metric, index) => (
          <MetricItem key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default TradeReport;
