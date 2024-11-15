import UseAdminHook from "@/hooks/admin/UseAdminHook";
import BrowserGraph from "../../components/admin/Dashboard/BrowserGraph";
import CountryGraph from "../../components/admin/Dashboard/CountryGraph";
import DepositWithdrawReport from "../../components/admin/Dashboard/DepositWithdrawReport";
import InvestmentReport from "../../components/admin/Dashboard/InvestmentReport";
import OsGraph from "../../components/admin/Dashboard/OsGraph";
import TradeReport from "../../components/admin/Dashboard/TradeReport";

import CompactHexagonalMetricRow from "@/components/admin/Dashboard/UserMatric2";
import { useEffect } from "react";

export default function Dashboard() {
  const { getUsers, getDeposits, getWithdrawals } = UseAdminHook();

  useEffect(() => {
    getUsers();
    getDeposits();
    getWithdrawals();
  }, []);
  return (
    <div className=" container mx-auto">
      <h2 className=" text-neutral-300  text-3xl px-10 py-5 font-bold">
        Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-2 px-16">
        <CompactHexagonalMetricRow></CompactHexagonalMetricRow>
        <DepositWithdrawReport></DepositWithdrawReport>
        <InvestmentReport></InvestmentReport>
        <TradeReport></TradeReport>
      </div>
      <div className=" px-5 grid grid-cols-1 md:grid-cols-3 my-10 gap-2">
        <BrowserGraph></BrowserGraph>
        <OsGraph></OsGraph>
        <CountryGraph></CountryGraph>
      </div>
    </div>
  );
}
