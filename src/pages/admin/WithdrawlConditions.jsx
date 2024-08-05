import React from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";

const WithdrawlConditions = () => {
  return (
    <div className=" px-10 rounded py-5 mx-auto max-w-7xl text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">
          Withdraw Conditions
        </h2>
        <button className="flex items-center font-semibold space-x-1 text-white hover:text-primary-100 ">
          <PlusIcon size={16} />
          <span>Add New</span>
        </button>
      </div>
      <div className=" rounded-lg overflow-x-auto">
        <table className=" rounded w-full">
          <thead>
            <tr className="bg-primary-500 text-white">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Profit Sharing</th>
              <th className="py-2 px-4 text-left">Process Time</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "1st Withdraw",
                profitSharing: 50,
                processTime: "After 21 days from 1st Trade",
              },
              {
                name: "2nd Withdraw",
                profitSharing: 70,
                processTime: "After 21 days from 2 withdrawal.",
              },
              {
                name: "3rd Withdraw",
                profitSharing: 80,
                processTime: "After 21 days from 3 withdrawal.",
              },
              {
                name: "4th Withdraw and continue...",
                profitSharing: 90,
                processTime: "After 7 days from 4 withdrawal.",
              },
              {
                name: "5th withdraw",
                profitSharing: 9,
                processTime: "After 10 days from 5 withdrawal.",
              },
              {
                name: "20",
                profitSharing: 20,
                processTime:
                  "After 30 days from last withdrawal and continue...",
              },
            ].map((item, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0 ? "bg-primary-700/50" : "bg-primary-700"
                }
              >
                <td className="py-2 px-4">{item.name}</td>
                <td className="py-2 px-4">{item.profitSharing}</td>
                <td className="py-2 px-4">{item.processTime}</td>
                <td className="py-2 px-4">
                  <div className="flex space-x-4">
                    <button className="text-primary-300 hover:text-primary-400">
                      <PencilIcon size={20} />
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      <TrashIcon size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawlConditions;
