import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  Palette,
  ToggleLeft,
  Loader2,
  ToggleRight,
} from "lucide-react";
import axios from "axios";
import { Textarea } from "@headlessui/react";
import toast from "react-hot-toast";
import { color } from "framer-motion";

const RulesManagement = () => {
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({
    text: "",
    color: "#ffffff",
    status: true,
  });
  const [editingRule, setEditingRule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // console.log("new rule form--", newRule);

  // Fetch rules ---------------
  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-rules`
      );
      setRules(response.data.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch data");
      setLoading(false);
      console.log(err);
      setRules([]);
    }
  };

  // Add rule ------------------
  const handleAddRule = async () => {
    if (newRule.text === "") {
      toast("Text can't be empty", { icon: `⚠️` });
    } else if (newRule.text !== "") {
      setLoading(true);

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/add-rule`,
          {
            text: newRule.text,
            color: newRule.color,
            status: newRule.status,
          }
        );
        setNewRule({ text: "", color: "#ffffff", status: true });
        await fetchRules();
        setLoading(false);
        toast.success("New rule added");
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong");
        setLoading(false);
      }
    }
  };

  // Update rule ---------------
  const handleUpdateRule = async (id) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-rule`,
        {
          id: id,
          text: editingRule.text,
          color: editingRule.color,
          status: editingRule.status,
        }
      );
      console.log("updated res--", res.data);
      setEditingRule(null);
      toast.success("Rule Updated");
      await fetchRules();
    } catch (err) {
      toast.error("Something Went Wrong!!");
      console.log(err);
      setLoading(false);
    }
  };

  // Delete rule with confirmation -----------------
  const handleDeleteRule = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${
          import.meta.env.VITE_BECKEND_END_POINT
        }/api/auth/delete-rule?id=${id}`
      );
      console.log("delete res---", res);
      toast.success("Rule Deleted");
      await fetchRules();
    } catch (err) {
      console.log(err);
      toast.error("something went wrong!!");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return (
    <div className="min-h-screen  from-primary-800 p-4 md:p-8">
      <div className="  mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-100 tracking-tight">
          Rules Management
        </h1>

        {/* Add New Rule Form */}
        <div className="bg-primary-700/40  rounded-xl shadow-sm border border-primary-500/40 p-6 mb-8 backdrop-blur-sm backdrop-filter">
          <h2 className="text-2xl font-semibold mb-6 text-gray-100 flex items-center space-x-2">
            <PlusCircle className="h-6 w-6 text-gray-100" />
            <span>Add New Rule</span>
          </h2>

          <div className="grid items-center grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative col-span-1 md:col-span-2">
              <Textarea
                type="text"
                placeholder="Enter rule text"
                value={newRule.text}
                onChange={(e) => {
                  setNewRule({ ...newRule, text: e.target.value });
                  setFormErrors({ ...formErrors, text: "" });
                }}
                className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                  formErrors.text ? "border-red-300" : "border-gray-200"
                } focus:outline-none w-full col-span-1 row-span-1 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition duration-200`}
              />
              {formErrors.text && (
                <p className="mt-1 text-sm text-red-500">{formErrors.text}</p>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <input
                    type="color"
                    value={newRule.color}
                    onChange={(e) => {
                      setNewRule({ ...newRule, color: e.target.value });
                      setFormErrors({ ...formErrors, color: "" });
                    }}
                    className="w-full h-11 rounded-lg cursor-pointer"
                  />
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <Palette className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600 font-mono">
                    {newRule.color}
                  </span>
                </div>
              </div>
              {formErrors.color && (
                <p className="mt-1 text-sm text-red-500">{formErrors.color}</p>
              )}
            </div>

            <div>
              <select
                value={newRule.status}
                onChange={(e) => {
                  const selectedValue = e.target.value === "true"; // true if the string is "true"
                  setNewRule({ ...newRule, status: selectedValue });
                  setFormErrors({ ...formErrors, status: "" });
                }}
                className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                  formErrors.status ? "border-red-300" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition duration-200`}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              {formErrors.status && (
                <p className="mt-1 text-sm text-red-500">{formErrors.status}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleAddRule}
            disabled={loading}
            className="mt-6 bg-blue-600/90 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition duration-200 flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <PlusCircle className="h-5 w-5" />
            )}
            <span>Add Rule</span>
          </button>
        </div>

        {/* Rules List */}
        <div className="bg-primary-700/40 rounded-xl shadow-sm border border-primary-500/40 p-6 backdrop-blur-sm backdrop-filter">
          <h2 className="text-2xl font-semibold mb-6 text-gray-100">
            Existing Rules
          </h2>

          {loading && !rules?.length ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {rules?.map((rule) => (
                <div
                  key={rule._id}
                  className="border border-primary-500/40 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-primary-700"
                >
                  {editingRule?.id === rule._id ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="md:col-span-3 max-w-full">
                        <Textarea
                          type="text"
                          value={editingRule?.text}
                          onChange={(e) =>
                            setEditingRule({
                              ...editingRule,
                              text: e.target.value,
                            })
                          }
                          className="w-full px-2 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={editingRule.color}
                          onChange={(e) =>
                            setEditingRule({
                              ...editingRule,
                              color: e.target.value,
                            })
                          }
                          className=" outline-none border-none rounded-lg cursor-copy"
                        />
                        <span className="font-mono text-gray-100">
                          {editingRule.color}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <select
                          value={editingRule.status}
                          onChange={(e) => {
                            const selectedValue = e.target.value === "true";
                            setEditingRule({
                              ...editingRule,
                              status: selectedValue,
                            });
                          }}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                        <div className="flex ml-4 space-x-2">
                          <button
                            onClick={() => handleUpdateRule(rule._id)}
                            className="p-2 text-green-600 hover:bg-green-500/20 rounded-full"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setEditingRule(null)}
                            className="p-2 text-gray-600 hover:bg-red-500/20 rounded-full"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="md:col-span-3 max-w-full">
                        <p className="text-gray-100 font-medium break-words whitespace-normal">
                          {rule.text}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-6 h-6 rounded-full border border-gray-500"
                          style={{ backgroundColor: `${rule?.color}` }}
                        />
                        <span className="text-gray-100 font-mono">
                          {rule.color}
                        </span>
                      </div>
                      <div
                        className={` flex items-center gap-4 justify-between w-fit ${
                          rule.status === true
                            ? "text-green-600 bg-green-600/30"
                            : "text-red-600 bg-red-600/10"
                        } px-3 py-1 rounded-full text-sm font-medium`}
                      >
                        {rule.status ? (
                          <ToggleRight size={25} />
                        ) : (
                          <ToggleLeft size={25} />
                        )}
                        <p className=" text-white">
                          {rule.status ? "Active" : "Inactive"}
                        </p>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() =>
                            setEditingRule({ ...rule, id: rule._id })
                          }
                          className="p-2 text-indigo-500 hover:bg-indigo-500/30 rounded-full transition-colors duration-200"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this rule?"
                              )
                            ) {
                              handleDeleteRule(rule._id);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-400/20 rounded-full transition-colors duration-200"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {!loading && rules?.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No rules found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default RulesManagement;
