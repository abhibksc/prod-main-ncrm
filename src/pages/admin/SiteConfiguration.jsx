import { useState, useEffect } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { backendApi } from "@/utils/apiClients";

const SiteConfiguration = () => {
  const [details, setDetails] = useState({
    dollarDepositRate: "",
    dollarWithdrawalRate: "",
    serverName: "",
    themeColor: "#F23645", // Default Theme Color
    mt5Digit: "",
    websiteName: "",
    logo: "",
    favicon: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await backendApi.get(`/site-config`);
      const data = res.data.data;
      if (data) {
        setDetails({
          dollarDepositRate: data.dollarDepositRate || "",
          dollarWithdrawalRate: data.dollarWithdrawalRate || "",
          serverName: data.serverName || "",
          themeColor: data.themeColor || "#F23645",
          mt5Digit: data.mt5Digit || "",
          websiteName: data.websiteName || "",
          logo: data.logo || "",
          favicon: data.favicon || "",
        });
      }
    } catch (error) {
      console.error("Error fetching site config:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  // Save Updated Data
  const handleSave = async () => {
    setSaving(true);
    try {
      await backendApi.put(`/site-config`, details);
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

  return (
    <div className="text-white p-5 flex min-h-screen">
      <div className="w-full h-fit bg-gray-800/30 shadow-lg backdrop-blur-lg border border-gray-700/40 p-6 rounded-xl">
        <div className="flex justify-between items-center border-b border-gray-500/50 pb-4 mb-4">
          <h2 className="text-xl md:text-3xl text-primary-300 font-bold">
            Site Configuration
          </h2>
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`p-2 bg-green-600 hover:bg-green-700 hover:px-4 rounded-full transition-all ${
                  saving && "opacity-50 cursor-not-allowed"
                }`}
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 bg-red-600 hover:bg-red-700 hover:px-4 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 bg-blue-600 hover:bg-blue-700 hover:px-4 rounded-full transition-all"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(details).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                {isEditing ? (
                  key === "themeColor" ? (
                    // Theme Color Picker
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className="w-10 h-10 border-none bg-transparent cursor-pointer"
                        disabled={saving}
                      />
                      <span className="text-gray-200">{value}</span>
                    </div>
                  ) : key === "logo" || key === "favicon" ? (
                    // Image Upload Fields
                    <div className="flex items-center gap-3">
                      {value && (
                        <img
                          src={value}
                          alt={key}
                          className="w-12 h-12 rounded border border-gray-600"
                        />
                      )}
                      <input
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleChange}
                        placeholder="Enter image URL"
                        className="bg-gray-700/10 text-white p-2 rounded border border-gray-600/40 focus:border-primary-400 outline-none"
                        disabled={saving}
                      />
                    </div>
                  ) : (
                    // Default Input Fields
                    <input
                      name={key}
                      value={value}
                      onChange={handleChange}
                      className="bg-gray-700/10 text-white p-2 rounded border border-gray-600/40 focus:border-primary-400 outline-none"
                      disabled={saving}
                    />
                  )
                ) : (
                  <p className="text-lg font-semibold text-gray-200">
                    {key === "dollarDepositRate" ||
                    key === "dollarWithdrawalRate" ? (
                      `₹ ${value}`
                    ) : key === "themeColor" ? (
                      <span
                        className="px-3 py-1 rounded text-black font-bold"
                        style={{ backgroundColor: value }}
                      >
                        {value}
                      </span>
                    ) : key === "logo" || key === "favicon" ? (
                      value ? (
                        <img
                          src={value}
                          alt={key}
                          className="w-12 h-12 rounded border border-gray-600"
                        />
                      ) : (
                        "No Image"
                      )
                    ) : (
                      value
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteConfiguration;
