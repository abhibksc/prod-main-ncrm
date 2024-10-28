import AccountGroup from "@/components/admin/account-configuration/AccountGroup";
import AccountTypes from "@/components/admin/account-configuration/AccountType";
import CustomGroupList from "@/components/admin/account-configuration/CustomGroupList";
import PlatformConfiguration from "@/components/admin/account-configuration/PlatformConfiguration";
import { Divider } from "@/components/admin/Divider";
import { useEffect, useState } from "react";
import { MainDivider } from "@/lib/MainDevider";
export default function AccountConfiguration() {
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {}, [refresh]);
  return (
    <div>
      <PlatformConfiguration></PlatformConfiguration>
<<<<<<< HEAD
      <MainDivider></MainDivider>
      <AccountGroup refresh={refresh} setRefresh={setRefresh}></AccountGroup>
      <CustomGroupList
        refresh={refresh}
        setRefresh={setRefresh}
      ></CustomGroupList>
      <MainDivider></MainDivider>
=======
      <Divider></Divider>
      <div className=" bg-primary-700/40  shadow-2xl">
        <AccountGroup refresh={refresh} setRefresh={setRefresh}></AccountGroup>
        <CustomGroupList
          refresh={refresh}
          setRefresh={setRefresh}
        ></CustomGroupList>
      </div>
      <Divider></Divider>
>>>>>>> origin/main

      <AccountTypes></AccountTypes>
    </div>
  );
}
