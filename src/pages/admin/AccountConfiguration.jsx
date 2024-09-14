import MethodConfiguration from "@/components/admin/account-configuration/MethodConfiguration";
import PlatformConfiguration from "@/components/admin/account-configuration/PlatformConfiguration";

export default function AccountConfiguration() {
  return (
    <div>
      <PlatformConfiguration></PlatformConfiguration>
      <MethodConfiguration></MethodConfiguration>
    </div>
  );
}
