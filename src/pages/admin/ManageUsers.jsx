import { useState, useEffect } from "react";
import { CircleUser, ExternalLink, Search, User, User2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { setLoggedUser } from "@/redux/user/userSlice";
import UseUserHook from "@/hooks/user/UseUserHook";

const ManageUsers = () => {
  const { subList } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const { getReset } = UseUserHook();
  const fetchUsersData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-users`
      );
      const resData = res.data.data.reverse();
      if (subList === "email-verified") {
        const data = resData.filter((value) => value.emailVerified === true);
        setUsers(data);
      } else if (subList === "email-unverified") {
        const data = resData.filter((value) => value.emailVerified === false);
        setUsers(data);
      } else if (subList === "kyc-verified") {
        const data = resData.filter((value) => value.kycVerified === true);
        setUsers(data);
      } else if (subList === "kyc-unverified") {
        const data = resData.filter((value) => value.kycVerified === false);
        setUsers(data);
      } else {
        setUsers(resData);
      }
      // console.log("users res--", users);
    } catch (error) {
      console.log("erroe in fetching users--", error);
    }
  };

  const filteredUsers = searchTerm
    ? users?.filter(
        (user) =>
          user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);

    const formattedDate = date.toLocaleDateString("en-GB", {
      year: "numeric",
      day: "2-digit",
      month: "2-digit",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // 12-hour format with AM/PM
    });

    return `${formattedDate}, ${formattedTime}`;
  }

  function calculateTimeSinceJoined(isoDateString) {
    const joinDate = new Date(isoDateString);
    const today = new Date();

    // Calculate the difference in time (in milliseconds)
    const timeDifference = today - joinDate;

    // Calculate different time units
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    // Build the time string
    let timeString = [];

    if (days > 0) {
      timeString.push(`${days} day${days !== 1 ? "s" : ""}`);
    }
    if (hours > 0) {
      timeString.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    }
    if (minutes > 0) {
      timeString.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
    }

    // Handle case when less than a minute
    if (timeString.length === 0) {
      return "less than a minute ago";
    }

    return timeString.join(", ") + " ago";
  }

  const userRedirectHandler = (user) => {
    getReset();
    dispatch(setLoggedUser(user));
    window.open("/user/dashboard", "_blank");
  };

  // useEfeect --------------------

  useEffect(() => {
    fetchUsersData();
  }, [subList]);

  return (
    <div className="container mx-auto px-10 py-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-white font-bold">
          {capitalizeFirstLetter(subList)}
        </h1>
        <div className="flex items-center">
          <div className="relative mr-2">
            <input
              type="text"
              placeholder="Email / Name"
              className="pl-10 pr-4 py-2 bg-neutral-800/60 text-white  border-primary-500 border-2 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead className="bg-primary-400 text-white">
            <tr className=" rounded">
              <th className="py-3 px-4 text-left">User/Email</th>
              <th className="py-3 px-4 text-left">Country</th>
              <th className="py-3 px-4 text-left">Email Verified</th>
              <th className="py-3 px-4 text-left">Kyc Verified</th>
              <th className="py-3 px-4 text-left">MT5 account</th>
              <th className="py-3 px-4 pl-10 text-left">Joined At</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.map((user) => (
              <tr
                key={user?._id}
                className="border-b bg-primary-700 hover:bg-primary-700/90 text-white"
              >
                <td className="py-3 flex items-center gap-2 px-4">
                  {subList === "all-users" && (
                    <Button
                      onClick={() => userRedirectHandler(user)}
                      className=" text-blue-400 hover:shadow-lg hover:text-blue-500 hover:scale-110 transition-all"
                    >
                      <User></User>
                    </Button>
                  )}
                  <div>
                    <div className="font-semibold">{user?.firstName}</div>
                    <Link
                      to={`/admin/user-detail/${user?._id}`}
                      className="text-sm cursor-pointer text-gray-300"
                    >
                      {user?.email}
                    </Link>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>{user?.country}</div>
                </td>
                <td className="py-3 px-4">
                  {user?.emailVerified ? "Active" : "Inactive"}
                </td>
                <td className="py-3 px-4">
                  {user?.kycVerified ? "Active" : "Inactive"}
                </td>
                <td className="py-3 px-4 text-center">{user?.mt5Account}</td>
                <td className="py-3 px-4">
                  <div>{formatDate(user?.createdAt)}</div>
                  <div className="text-sm text-gray-400">
                    {calculateTimeSinceJoined(user?.createdAt)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Link
                    to={`/admin/user-detail/${user?._id}`}
                    className="text-blue-400 hover:text-blue-600 transition-all hover:scale-110"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
