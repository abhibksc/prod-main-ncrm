import React, { useState } from "react";

const Withdraw = () => {
  const [levels, setLevels] = useState([
    {
      id: 1,
      commissionPercentage: 10,
      personalInvestment: 20.0,
      teamDeposit: 30.0,
      groupDeposit: 40.0,
    },
    {
      id: 2,
      commissionPercentage: 1,
      personalInvestment: 2.0,
      teamDeposit: 3.0,
      groupDeposit: 4.0,
    },
  ]);

  const handleInputChange = (id, field, value) => {
    setLevels((prevLevels) =>
      prevLevels.map((level) =>
        level.id === id ? { ...level, [field]: parseFloat(value) || 0 } : level
      )
    );
  };

  const handleAddLevel = () => {
    const newLevel = {
      id: levels.length + 1,
      commissionPercentage: 0,
      personalInvestment: 0,
      teamDeposit: 0,
      groupDeposit: 0,
    };
    setLevels([...levels, newLevel]);
  };

  const handleUpdateAll = () => {
    // Implement update logic here
    console.log("Updating all levels");
  };

  const handleDeleteLast = () => {
    if (levels.length > 0) {
      setLevels((prevLevels) => prevLevels.slice(0, -1));
    }
  };

  return (
    <div className=" w-full container py-5 px-10 mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Commissions</h2>

      <div className="bg-pri rounded-lg shadow-sm mb-6">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-500 text-white">
              <th className="p-3 text-left font-semibold">Level #</th>
              <th className="p-3 text-left font-semibold">
                Commission Percentage
              </th>
              <th className="p-3 text-left font-semibold">
                Personal Investment
              </th>
              <th className="p-3 text-left font-semibold">Team Deposit</th>
              <th className="p-3 text-left font-semibold">Group Deposit</th>
            </tr>
          </thead>
          <tbody className="">
            {levels.map((level, index) => (
              <tr key={level.id} className="">
                <td className=" pl-7 text-white">{index + 1}</td>
                <td className="p-3">
                  <input
                    type="number"
                    value={level.commissionPercentage}
                    onChange={(e) =>
                      handleInputChange(
                        level.id,
                        "commissionPercentage",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded text-white bg-neutral-800/60"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    value={level.personalInvestment}
                    onChange={(e) =>
                      handleInputChange(
                        level.id,
                        "personalInvestment",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded text-white bg-neutral-800/60"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    value={level.teamDeposit}
                    onChange={(e) =>
                      handleInputChange(level.id, "teamDeposit", e.target.value)
                    }
                    className="w-full p-2 border rounded text-white bg-neutral-800/60"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    value={level.groupDeposit}
                    onChange={(e) =>
                      handleInputChange(
                        level.id,
                        "groupDeposit",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded text-white bg-neutral-800/60"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 bg-primary-700 flex justify-start space-x-2">
          <button
            onClick={handleUpdateAll}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Update All
          </button>
          <button
            onClick={handleDeleteLast}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Delete Last
          </button>
        </div>
      </div>

      <div className="bg-primary-700 rounded-lg shadow-sm p-4">
        <h3 className="text-xl text-white font-semibold mb-4">
          Add Commission Level {levels.length + 1}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Commission Percentage*
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded text-white bg-neutral-800/60"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Personal Investment*
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded text-white bg-neutral-800/60"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Team Deposit*
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded text-white bg-neutral-800/60"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Group Deposit*
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded text-white bg-neutral-800/60"
              placeholder="0"
            />
          </div>
        </div>
        <button
          onClick={handleAddLevel}
          className="mt-4 bg-green-500 text-white px-10 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Withdraw;
