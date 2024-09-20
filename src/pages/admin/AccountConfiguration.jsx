import AccountGroup from "@/components/admin/account-configuration/AccountGroup";
import AccountTypes from "@/components/admin/account-configuration/AccountType";
import CustomGroupList from "@/components/admin/account-configuration/CustomGroupList";
import MethodConfiguration from "@/components/admin/account-configuration/MethodConfiguration";
import PlatformConfiguration from "@/components/admin/account-configuration/PlatformConfiguration";
import { useEffect, useState } from "react";

export default function AccountConfiguration() {
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {}, [refresh]);
  return (
    <div>
      <PlatformConfiguration></PlatformConfiguration>
      <MethodConfiguration></MethodConfiguration>
      <AccountGroup refresh={refresh} setRefresh={setRefresh}></AccountGroup>
      <CustomGroupList
        refresh={refresh}
        setRefresh={setRefresh}
      ></CustomGroupList>
      <AccountTypes></AccountTypes>
    </div>
  );
}
