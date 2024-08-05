import BrowserGraph from "../../components/admin/Dashboard/BrowserGraph";
import CountryGraph from "../../components/admin/Dashboard/CountryGraph";
import DepositWithdrawGraph from "../../components/admin/Dashboard/DepositWithdrawGraph";
import DepositWithdrawReport from "../../components/admin/Dashboard/DepositWithdrawReport";
import InvestmentReport from "../../components/admin/Dashboard/InvestmentReport";
import OsGraph from "../../components/admin/Dashboard/OsGraph";
import TradeReport from "../../components/admin/Dashboard/TradeReport";
import TransitionReportGraph from "../../components/admin/Dashboard/TransitionReportGraph";
import UserMetricReport from "../../components/admin/Dashboard/UserMetricReport";

export default function Dashboard() {
  return (
    <div className=" container mx-auto p-5">
      <h2 className=" text-neutral-300 text-3xl px-10 py-5 font-bold">
        Deshboard
      </h2>
      <div className="grid grid-cols-2 gap-y-5 gap-2 px-16">
        <UserMetricReport></UserMetricReport>
        <DepositWithdrawReport></DepositWithdrawReport>
        <InvestmentReport></InvestmentReport>
        <TradeReport></TradeReport>
        <DepositWithdrawGraph></DepositWithdrawGraph>
        <TransitionReportGraph></TransitionReportGraph>
      </div>
      <div className=" px-5 grid grid-cols-3 my-20 gap-2">
        <BrowserGraph></BrowserGraph>
        <OsGraph></OsGraph>
        <CountryGraph></CountryGraph>
      </div>
    </div>
  );
}
