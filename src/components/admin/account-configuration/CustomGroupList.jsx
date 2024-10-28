import axios from "axios";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CustomGroupList({ refresh, setRefresh }) {
  const [customGroups, setCustomGroups] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-custom-groups`
      );
      // console.log("custom group list @@@@---", res.data.data);
      setCustomGroups(res.data.data);
    } catch (error) {
      console.log("error in custom list group", error);
    }
  };
  const deleteHandler = async (id) => {
    try {
      const res = await axios.delete(
        `${
          import.meta.env.VITE_BECKEND_END_POINT
        }/api/auth/delete-custom-group?id=${id}`
      );
      setRefresh(!refresh);
      toast.success("Group deleted successfully");
    } catch (error) {
      console.log("error in custom list group", error);
    }
  };
  console.log("refreshh---", refresh);

  useEffect(() => {
    fetchData();
  }, [refresh]);
  return (
    <div className="container mx-auto p-6">
<<<<<<< HEAD
      <h2 className="text-white text-3xl font-bold mb-4">Lists</h2>
=======
>>>>>>> origin/main
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-primary-400 text-white uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-center">Sr. No.</th>
              <th className="py-3 px-6 text-center">API Group</th>
              <th className="py-3 px-6 text-center">Custom Group</th>
              {/* <th className="py-3 px-6 text-center">Action</th> */}
            </tr>
          </thead>
          <tbody className=" text-sm">
            {customGroups?.map((value, index) => (
              <tr
                key={index}
                className="border-b border-gray-500 bg-primary-700 text-white hover:bg-primary-700/10"
              >
                <td className="py-3 px-6 text-center whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="py-3 px-6 text-center">{value?.apiGroup}</td>
                <td className="py-3 px-6">
                  <div className=" flex justify-center items-center">
                    <p>{value.customGroup}</p>
                  </div>
                </td>
                {/* <td className="py-3 px-6 text-center ">
                  <div className=" flex items-center text-red-500 hover:text-red-800 hover:scale-110 transition-all justify-center">
                    <button onClick={() => deleteHandler(value._id)}>
                      <Trash></Trash>
                    </button>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
