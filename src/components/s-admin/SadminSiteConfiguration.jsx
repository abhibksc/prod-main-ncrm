import { useState, useEffect } from "react";
import { Pencil, Check, X, Loader2, ExternalLink, Save } from "lucide-react";
import { backendApi } from "@/utils/apiClients";

const SadminSiteConfiguration = () => {
  const [details, setDetails] = useState({
    serverName: "",
    mt5Digit: "",
    websiteName: "",
    logo: "",
    favicon: "",
    inrUi: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Define UI settings configuration

  const generalSettingsFields = [
    {
      name: "serverName",
      type: "text",
      placeholder: "Enter server name",
    },
    {
      name: "mt5Digit",
      type: "text",
      placeholder: "Enter MT5 digit",
    },
    {
      name: "websiteName",
      type: "text",
      placeholder: "Enter website name",
    },
    // Add any other general settings here
  ];
  const uiSettings = [
    {
      name: "inrUi",
      description: "Enable or disable INR user interface",
    },
    {
      name: "bankDetailsUi",
      description: "Bank details section in account details",
    },
    {
      name: "kycForWithdrawal",
      description: "User can withdrawal only when they are verified",
    },
    {
      name: "emailToAll",
      description: "Admin can send mail to all users",
    },
    {
      name: "ibZone",
      description: "Enable Disable IB from admin and user panel",
    },
  ];
  const mediaAssets = [
    {
      name: "logo",
      type: "image",
      placeholder: "Enter logo URL",
      altText: "Logo",
    },
    {
      name: "favicon",
      type: "image",
      placeholder: "Enter favicon URL",
      altText: "Favicon",
    },
    // You can add more media assets here if needed
  ];

  const fetchData = async () => {
    try {
      const res = await backendApi.get("/site-config");
      const { serverName, mt5Digit, websiteName, logo, favicon, inrUi } =
        res.data.data || {};
      setDetails({
        serverName: serverName || "",
        mt5Digit: mt5Digit || "",
        websiteName: websiteName || "",
        logo: logo || "",
        favicon: favicon || "",
        inrUi: inrUi || false,
      });
    } catch (error) {
      console.error("Error fetching site config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await backendApi.put("/site-config", details);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating site config:", error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper function to format field labels
  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-primary-800/50 backdrop-blur-lg border border-primary-700/50 rounded-2xl mb-6 p-6 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 to-primary-400 bg-clip-text text-transparent">
                Site Configuration
              </h1>
              <p className="text-gray-300/80 mt-1">
                Manage website core settings and appearance
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`px-5 py-2.5 bg-green-500/20  text-green-500 hover:px-6 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg ${
                      saving
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:shadow-green-500/20"
                    }`}
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    <span className="font-medium">Save Changes</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 bg-gray-700/60 hover:bg-gray-600/40 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-gray-600/20"
                  >
                    <X className="w-5 h-5" />
                    <span className="font-medium">Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 bg-blue-600/30 text-blue-500 hover:px-6 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/20"
                >
                  <Pencil className="w-5 h-5" />
                  <span className="font-medium">Edit Settings</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-primary-800/30 backdrop-blur-md rounded-2xl border border-primary-700/30">
            <Loader2 className="w-12 h-12 animate-spin text-primary-400" />
            <p className="text-primary-300 mt-4 font-medium">
              Loading configuration...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Basic Settings */}
            <div className="bg-primary-800/30 backdrop-blur-md rounded-2xl border border-primary-700/30 overflow-hidden shadow-xl">
              <div className="p-6 border-b border-primary-700/50">
                <h2 className="text-xl font-semibold text-primary-200">
                  General Settings
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generalSettingsFields.map((field) => (
                    <div
                      key={field.name}
                      className="bg-primary-700/40 rounded-xl border border-primary-600/30 hover:border-primary-500/50 transition-all duration-300 overflow-hidden shadow-md group"
                    >
                      <div className="px-5 py-4 bg-primary-700/20 border-b border-primary-600/20">
                        <h3 className="text-sm font-medium text-primary-300">
                          {formatLabel(field.name)}
                        </h3>
                      </div>
                      <div className="p-5">
                        {isEditing ? (
                          <input
                            type={field.type}
                            name={field.name}
                            value={details[field.name] || ""}
                            onChange={handleChange}
                            className="w-full bg-primary-800/60 text-white p-3 rounded-lg border border-primary-600/30 focus:border-primary-400 outline-none transition-all duration-200"
                            disabled={saving}
                            placeholder={
                              field.placeholder ||
                              `Enter ${formatLabel(field.name)}`
                            }
                          />
                        ) : (
                          <div className="bg-primary-800/40 p-3 rounded-lg border border-primary-700/30 min-h-12 flex items-center">
                            <span className="text-lg font-medium text-gray-300 break-words">
                              {details[field.name] || (
                                <span className="text-primary-400/60 italic">
                                  Not Set
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* UI Toggle Settings */}
            <div className="bg-primary-800/30 backdrop-blur-md rounded-2xl border border-primary-700/30 overflow-hidden shadow-xl">
              <div className="p-6 border-b border-primary-700/50">
                <h2 className="text-xl font-semibold text-primary-200">
                  UI Settings
                </h2>
                <p className="text-gray-300/80 text-sm mt-1">
                  Configure user interface preferences
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Dynamic Toggle Rendering */}
                  {uiSettings.map((setting) => (
                    <div
                      key={setting.name}
                      className="bg-primary-700/40 rounded-lg border border-primary-600/30 hover:border-primary-500/50 transition-all duration-300 overflow-hidden shadow-md"
                    >
                      <div className="flex items-center justify-between p-4">
                        <div>
                          <h3 className="text-sm font-medium text-primary-200">
                            {formatLabel(setting.name)}
                          </h3>
                          <p className="text-xs text-gray-300 mt-1">
                            {setting.description}
                          </p>
                        </div>

                        {isEditing ? (
                          <div className="flex items-center space-x-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name={setting.name}
                                checked={details[setting.name] || false}
                                onChange={handleChange}
                                className="sr-only peer"
                                disabled={saving}
                              />
                              <div
                                className={`w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer 
                      ${
                        details[setting.name] ? "peer-checked:bg-green-500" : ""
                      } 
                      transition-all duration-300 ${
                        saving ? "opacity-50" : ""
                      }`}
                              >
                                <div
                                  className={`absolute top-1 bg-white rounded-full transition-all duration-300 w-4 h-4 
                        ${details[setting.name] ? "left-6" : "left-1"}`}
                                ></div>
                              </div>
                            </label>
                          </div>
                        ) : (
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              details[setting.name]
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {details[setting.name] ? "Enabled" : "Disabled"}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Media Settings */}
            <div className="bg-primary-800/30 backdrop-blur-md rounded-2xl border border-primary-700/30 overflow-hidden shadow-xl">
              <div className="p-6 border-b border-primary-700/50">
                <h2 className="text-xl font-semibold text-primary-200">
                  Media Assets
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mediaAssets.map((asset) => (
                    <div
                      key={asset.name}
                      className="bg-primary-700/40 rounded-xl border border-primary-600/30 hover:border-primary-500/50 transition-all duration-300 overflow-hidden shadow-md group"
                    >
                      <div className="px-5 py-4 bg-primary-700/20 border-b border-primary-600/20">
                        <h3 className="text-sm font-medium text-primary-300">
                          {formatLabel(asset.name)}
                        </h3>
                      </div>
                      <div className="p-5">
                        {isEditing ? (
                          <div className="space-y-4">
                            {details[asset.name] && (
                              <div className="flex items-start gap-4 bg-primary-800/60 p-4 rounded-lg border border-primary-600/30">
                                <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center bg-primary-900/60 rounded-lg overflow-hidden">
                                  <img
                                    src={details[asset.name]}
                                    alt={formatLabel(asset.name)}
                                    className="max-w-full max-h-full object-contain"
                                  />
                                </div>
                                <div className="flex flex-col justify-between h-full">
                                  <h4 className="text-primary-200 font-medium">
                                    Current {formatLabel(asset.name)}
                                  </h4>
                                  <a
                                    href={details[asset.name]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors mt-2"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    View full size
                                  </a>
                                </div>
                              </div>
                            )}
                            <div>
                              <label className="block text-primary-300 text-sm font-medium mb-2">
                                {details[asset.name] ? "Update" : "Add"}{" "}
                                {formatLabel(asset.name)} URL
                              </label>
                              <input
                                type="text"
                                name={asset.name}
                                value={details[asset.name] || ""}
                                onChange={handleChange}
                                placeholder={
                                  asset.placeholder ||
                                  `Enter ${formatLabel(asset.name)} URL`
                                }
                                className="w-full bg-primary-800/60 text-white p-3 rounded-lg border border-primary-600/30 focus:border-primary-400 outline-none transition-all duration-200"
                                disabled={saving}
                              />
                            </div>
                          </div>
                        ) : details[asset.name] ? (
                          <div className="bg-primary-800/40 p-4 rounded-lg border border-primary-700/30 flex flex-col md:flex-row gap-4 items-start md:items-center">
                            <div className="flex-shrink-0 w-40 h-24 flex items-center justify-center bg-primary-900/60 rounded-lg p-2">
                              <img
                                src={details[asset.name]}
                                alt={formatLabel(asset.name)}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <div>
                              <h4 className="text-gray-300 font-medium">
                                {formatLabel(asset.name)}
                              </h4>
                              <p className="text-primary-400 text-sm mt-1 break-all">
                                {details[asset.name].length > 45
                                  ? `${details[asset.name].substring(0, 45)}...`
                                  : details[asset.name]}
                              </p>
                              <a
                                href={details[asset.name]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors text-sm"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Open in new tab
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-primary-800/40 p-4 rounded-lg border border-primary-700/30 flex items-center justify-center h-24">
                            <p className="text-primary-400/60 italic">
                              No {formatLabel(asset.name)} Set
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SadminSiteConfiguration;
