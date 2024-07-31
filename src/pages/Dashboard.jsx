import DashboardGraph from "../components/Dashboard/DashboardGraph";
import DashboardManu from "../components/Dashboard/DashboardManu";

export default function Dashboard() {
  return (
    <div className="p-5">
      <div className="grid grid-cols-2 gap-y-10 gap-2 px-10">
        <DashboardManu />
        <DashboardManu />
        <DashboardManu />
        <DashboardManu />
        <DashboardManu />
        <DashboardManu />
        <DashboardGraph></DashboardGraph>
        <DashboardGraph></DashboardGraph>
      </div>
    </div>
  );
}
