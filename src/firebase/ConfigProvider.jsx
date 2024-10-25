// import React, { createContext, useContext, useState, useEffect } from "react";
// import { fetchAndActivate, getValue } from "firebase/remote-config";
// import { remoteConfig } from "./config";

// const ConfigContext = createContext();

// export const useConfig = () => useContext(ConfigContext);

// export const ConfigProvider = ({ children }) => {
//   const [config, setConfig] = useState({
//     isEnabled: true,
//     message: "",
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const loadConfig = async () => {
//       try {
//         await fetchAndActivate(remoteConfig);
//         setConfig({
//           isEnabled: getValue(remoteConfig, "app_enabled").asBoolean(),
//           message: getValue(remoteConfig, "maintenance_message").asString(),
//         });
//       } catch (error) {
//         console.error("Error loading remote config:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadConfig();
//   }, []);

//   return (
//     <ConfigContext.Provider value={{ config, isLoading }}>
//       {children}
//     </ConfigContext.Provider>
//   );
// };
