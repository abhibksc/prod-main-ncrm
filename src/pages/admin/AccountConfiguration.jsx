import AccountGroup from "@/components/admin/account-configuration/AccountGroup";
import AccountTypes from "@/components/admin/account-configuration/AccountType";
import CustomGroupList from "@/components/admin/account-configuration/CustomGroupList";
import PlatformConfiguration from "@/components/admin/account-configuration/PlatformConfiguration";
import { useEffect, useState } from "react";
import { MainDivider } from "@/lib/MainDevider";
export default function AccountConfiguration() {
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {}, [refresh]);
  return (
    <div>
      <PlatformConfiguration></PlatformConfiguration>
      <MainDivider></MainDivider>
      <AccountGroup refresh={refresh} setRefresh={setRefresh}></AccountGroup>
      <CustomGroupList
        refresh={refresh}
        setRefresh={setRefresh}
      ></CustomGroupList>
      <MainDivider></MainDivider>

      <AccountTypes></AccountTypes>
    </div>
  );
}
