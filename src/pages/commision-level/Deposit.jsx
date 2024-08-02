import React, { useState } from "react";

const Deposit = () => {
  const [levels, setLevels] = useState([]);
  const [newLevel, setNewLevel] = useState({
    commissionPercentage: 0,
    personalInvestment: 0,
    teamDeposit: 0,
    groupDeposit: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLevel((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleAddLevel = () => {
    setLevels((prev) => [...prev, { ...newLevel, id: Date.now() }]);
    setNewLevel({
      commissionPercentage: 0,
      personalInvestment: 0,
      teamDeposit: 0,
      groupDeposit: 0,
    });
  };

  return (
    <div className=" w-full p-5 text-white  container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Commissions</h2>

      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary-400 text-white">
              <th className="p-2 text-left font-semibold">Level #</th>
              <th className="p-2 text-left font-semibold">
                Commission Percentage
              </th>
              <th className="p-2 text-left font-semibold">
                Personal Investment
              </th>
              <th className="p-2 text-left font-semibold">Team Deposit</th>
              <th className="p-2 text-left font-semibold">Group Deposit</th>
            </tr>
          </thead>
          <tbody>
            {levels.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-2 text-center text-gray-500">
                  No levels added yet.
                </td>
              </tr>
            ) : (
              levels.map((level, index) => (
                <tr key={level.id} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{level.commissionPercentage}%</td>
                  <td className="p-2">${level.personalInvestment}</td>
                  <td className="p-2">${level.teamDeposit}</td>
                  <td className="p-2">${level.groupDeposit}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-primary-700 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">
          Add Commission Level {levels.length + 1}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Commission Percentage
            </label>
            <input
              type="number"
              name="commissionPercentage"
              value={newLevel.commissionPercentage}
              onChange={handleInputChange}
              className="w-full text-black p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white  mb-1">
              Personal Investment
            </label>
            <input
              type="number"
              name="personalInvestment"
              value={newLevel.personalInvestment}
              onChange={handleInputChange}
              className="w-full text-black p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white  mb-1">
              Team Deposit
            </label>
            <input
              type="number"
              name="teamDeposit"
              value={newLevel.teamDeposit}
              onChange={handleInputChange}
              className="w-full text-black p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white  mb-1">
              Group Deposit
            </label>
            <input
              type="number"
              name="groupDeposit"
              value={newLevel.groupDeposit}
              onChange={handleInputChange}
              className="w-full text-black p-2 border rounded"
            />
          </div>
        </div>
        <button
          onClick={handleAddLevel}
          className="mt-4 bg-green-600 text-white font-semibold px-10 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Deposit;
