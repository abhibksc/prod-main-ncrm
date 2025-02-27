import { useState, useEffect } from "react";
import { Pencil, Check, X, Loader2, ExternalLink } from "lucide-react";
import { backendApi } from "@/utils/apiClients";

const SiteConfiguration = () => {
  const [details, setDetails] = useState({
    dollarDepositRate: "",
    dollarWithdrawalRate: "",
    serverName: "",
    themeColor: "#F23645",
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

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

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
    <div className="text-white p-6 flex min-h-screen bg-primary-900">
      <div className="w-full max-w-4xl mx-auto bg-gray-800/20 shadow-xl backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl">
        <div className="flex justify-between items-center border-b border-gray-600/50 pb-5 mb-6">
          <h2 className="text-2xl md:text-3xl text-primary-300 font-bold tracking-tight">
            Site Configuration
          </h2>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`p-2.5 bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    saving && "opacity-60 cursor-not-allowed"
                  }`}
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  <span className="hidden md:block text-sm">Save</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2.5 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  <span className="hidden md:block text-sm">Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <Pencil className="w-5 h-5" />
                <span className="hidden md:block text-sm">Edit</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-primary-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(details).map(([key, value]) => (
              <div
                key={key}
                className="bg-gray-800/20 p-4 rounded-lg border border-gray-700/30 hover:border-gray-600/50 transition-colors"
              >
                <label className="text-sm text-gray-400 capitalize font-medium mb-2 block">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                {key === "themeColor" ? (
                  isEditing ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          name="themeColor"
                          value={value}
                          onChange={handleChange}
                          className="w-12 h-12 rounded-md border border-gray-600 cursor-pointer"
                          disabled={saving}
                        />
                        <input
                          name="themeColor"
                          value={value}
                          onChange={handleChange}
                          placeholder="Enter custom hashcode (e.g., #FF5733)"
                          className="w-full bg-gray-700/20 text-white p-2.5 rounded-md border border-gray-600/40 focus:border-primary-400 outline-none transition-colors"
                          disabled={saving}
                        />
                      </div>
                    </div>
                  ) : (
                    <span
                      className="px-3 py-1 rounded text-black font-bold inline-block"
                      style={{ backgroundColor: value }}
                    >
                      {value}
                    </span>
                  )
                ) : isEditing ? (
                  key === "logo" || key === "favicon" ? (
                    <div className="space-y-2">
                      {value && (
                        <div className="flex items-center gap-3">
                          <img
                            src={value}
                            alt={key}
                            className="w-12 h-12 rounded-md border border-gray-600 object-contain bg-gray-700"
                          />
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Full
                          </a>
                        </div>
                      )}
                      <input
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleChange}
                        placeholder="Enter image URL"
                        className="w-full bg-gray-700/20 text-white p-2.5 rounded-md border border-gray-600/40 focus:border-primary-400 outline-none transition-colors"
                        disabled={saving}
                      />
                    </div>
                  ) : (
                    <input
                      name={key}
                      value={value}
                      onChange={handleChange}
                      className="w-full bg-gray-700/20 text-white p-2.5 rounded-md border border-gray-600/40 focus:border-primary-400 outline-none transition-colors"
                      disabled={saving}
                    />
                  )
                ) : (
                  <div className="text-gray-200">
                    {key === "dollarDepositRate" ||
                    key === "dollarWithdrawalRate" ? (
                      <span className="text-lg font-semibold">₹ {value}</span>
                    ) : key === "logo" || key === "favicon" ? (
                      value ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={value}
                            alt={key}
                            className="w-12 h-12 rounded-md border border-gray-600 object-contain bg-gray-700"
                          />
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Full
                          </a>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No Image</span>
                      )
                    ) : (
                      <span className="text-lg font-semibold break-words">
                        {value || "Not set"}
                      </span>
                    )}
                  </div>
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
