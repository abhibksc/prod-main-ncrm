import React, { useState, useEffect } from "react";
import { Search, UserPlus } from "lucide-react";
import { Link, useParams } from "react-router-dom";

// Existing dummy user data
const dummyUsers = [
  {
    id: 1,
    name: "Awais Sharif",
    username: "@rdDU6k",
    email: "awaissharif17@gmail.com",
    phone: "923048077771",
    country: "PK",
    joinedAt: "2024-07-08 02:26 PM",
    joinedAgo: "3 weeks ago",
    balance: "$0.00",
  },
  {
    id: 2,
    name: "Ashar Sajjad",
    username: "@5R1KZM",
    email: "thetradewolves@gmail.com",
    phone: "923214494497",
    country: "PK",
    joinedAt: "2024-07-07 12:27 AM",
    joinedAgo: "3 weeks ago",
    balance: "$0.00",
  },
  {
    id: 3,
    name: "tt",
    username: "@vXCDJhm",
    email: "test@1.com",
    phone: "910000",
    country: "IN",
    joinedAt: "2024-06-24 08:25 PM",
    joinedAgo: "1 month ago",
    balance: "$100.00",
  },
  {
    id: 4,
    name: "Haseeb Qamar",
    username: "@YUBeIx",
    email: "engr.haseebqamar@gmail.com",
    phone: "923060110061",
    country: "PK",
    joinedAt: "2024-06-23 09:05 PM",
    joinedAgo: "1 month ago",
    balance: "$0.00",
  },
  {
    id: 5,
    name: "Ashar Sajjad",
    username: "@tjO46pS",
    email: "test@gmail.com",
    phone: "910",
    country: "IN",
    joinedAt: "2024-06-20 05:01 PM",
    joinedAgo: "1 month ago",
    balance: "$0.00",
  },
  {
    id: 6,
    name: "John Doe",
    username: "@johndoe",
    email: "johndoe@example.com",
    phone: "1234567890",
    country: "US",
    joinedAt: "2024-05-15 10:15 AM",
    joinedAgo: "2 months ago",
    balance: "$250.00",
  },
  {
    id: 7,
    name: "Jane Smith",
    username: "@janesmith",
    email: "janesmith@example.com",
    phone: "0987654321",
    country: "CA",
    joinedAt: "2024-04-10 11:45 AM",
    joinedAgo: "3 months ago",
    balance: "$150.00",
  },
  {
    id: 8,
    name: "Michael Brown",
    username: "@michaelbrown",
    email: "michaelbrown@example.com",
    phone: "5555555555",
    country: "AU",
    joinedAt: "2024-03-22 02:30 PM",
    joinedAgo: "4 months ago",
    balance: "$300.00",
  },
  {
    id: 9,
    name: "Emily Davis",
    username: "@emilydavis",
    email: "emilydavis@example.com",
    phone: "4444444444",
    country: "GB",
    joinedAt: "2024-02-18 09:00 AM",
    joinedAgo: "5 months ago",
    balance: "$400.00",
  },
  {
    id: 10,
    name: "Daniel Wilson",
    username: "@danielwilson",
    email: "danielwilson@example.com",
    phone: "3333333333",
    country: "NZ",
    joinedAt: "2024-01-12 07:20 PM",
    joinedAgo: "6 months ago",
    balance: "$350.00",
  },
  {
    id: 11,
    name: "Olivia Martinez",
    username: "@oliviamartinez",
    email: "oliviamartinez@example.com",
    phone: "2222222222",
    country: "FR",
    joinedAt: "2023-12-05 04:00 PM",
    joinedAgo: "7 months ago",
    balance: "$500.00",
  },
  {
    id: 12,
    name: "James Anderson",
    username: "@jamesanderson",
    email: "jamesanderson@example.com",
    phone: "1111111111",
    country: "DE",
    joinedAt: "2023-11-01 03:30 PM",
    joinedAgo: "8 months ago",
    balance: "$450.00",
  },
  {
    id: 13,
    name: "Sophia Thomas",
    username: "@sophiathomas",
    email: "sophiathomas@example.com",
    phone: "6666666666",
    country: "IT",
    joinedAt: "2023-10-15 01:15 PM",
    joinedAgo: "9 months ago",
    balance: "$200.00",
  },
  {
    id: 14,
    name: "Liam Jackson",
    username: "@liamjackson",
    email: "liamjackson@example.com",
    phone: "7777777777",
    country: "ES",
    joinedAt: "2023-09-20 10:00 AM",
    joinedAgo: "10 months ago",
    balance: "$350.00",
  },
  {
    id: 15,
    name: "Ava White",
    username: "@avawhite",
    email: "avawhite@example.com",
    phone: "8888888888",
    country: "BE",
    joinedAt: "2023-08-12 08:45 PM",
    joinedAgo: "11 months ago",
    balance: "$275.00",
  },
  {
    id: 16,
    name: "Noah Harris",
    username: "@noahharris",
    email: "noahharris@example.com",
    phone: "9999999999",
    country: "SE",
    joinedAt: "2023-07-07 06:30 PM",
    joinedAgo: "1 year ago",
    balance: "$220.00",
  },
  {
    id: 17,
    name: "Isabella Clark",
    username: "@isabellaclark",
    email: "isabellaclark@example.com",
    phone: "0000000000",
    country: "NO",
    joinedAt: "2023-06-10 05:00 PM",
    joinedAgo: "1 year ago",
    balance: "$310.00",
  },
  {
    id: 18,
    name: "Ethan Lewis",
    username: "@ethanlewis",
    email: "ethanlewis@example.com",
    phone: "1111111111",
    country: "DK",
    joinedAt: "2023-05-25 04:15 PM",
    joinedAgo: "1 year ago",
    balance: "$290.00",
  },
  {
    id: 19,
    name: "Mia Walker",
    username: "@miawalker",
    email: "miawalker@example.com",
    phone: "2222222222",
    country: "FI",
    joinedAt: "2023-04-18 03:00 PM",
    joinedAgo: "1 year ago",
    balance: "$330.00",
  },
  {
    id: 20,
    name: "Alexander Scott",
    username: "@alexanderscott",
    email: "alexanderscott@example.com",
    phone: "3333333333",
    country: "IE",
    joinedAt: "2023-03-15 02:30 PM",
    joinedAgo: "1 year ago",
    balance: "$280.00",
  },
  {
    id: 21,
    name: "Amelia Young",
    username: "@ameliayoung",
    email: "ameliayoung@example.com",
    phone: "4444444444",
    country: "PT",
    joinedAt: "2023-02-12 01:00 PM",
    joinedAgo: "1 year ago",
    balance: "$320.00",
  },
  {
    id: 22,
    name: "Benjamin King",
    username: "@benjaminking",
    email: "benjaminking@example.com",
    phone: "5555555555",
    country: "GR",
    joinedAt: "2023-01-08 12:30 PM",
    joinedAgo: "1 year ago",
    balance: "$270.00",
  },
  {
    id: 23,
    name: "Charlotte Wright",
    username: "@charlottewright",
    email: "charlottewright@example.com",
    phone: "6666666666",
    country: "CH",
    joinedAt: "2022-12-01 11:00 AM",
    joinedAgo: "1 year ago",
    balance: "$350.00",
  },
  {
    id: 24,
    name: "Oliver Green",
    username: "@olivergreen",
    email: "olivergreen@example.com",
    phone: "7777777777",
    country: "AT",
    joinedAt: "2022-11-05 10:45 AM",
    joinedAgo: "1 year ago",
    balance: "$290.00",
  },
  {
    id: 25,
    name: "Sophia Adams",
    username: "@sophiaadams",
    email: "sophiaadams@example.com",
    phone: "8888888888",
    country: "HU",
    joinedAt: "2022-10-15 09:30 AM",
    joinedAgo: "1 year ago",
    balance: "$310.00",
  },
];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const ManageUsers = () => {
  const { subList } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(dummyUsers);

  useEffect(() => {
    setUsers(shuffleArray([...dummyUsers]));
  }, [subList]);

  const filteredUsers = searchTerm
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

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
              placeholder="Username / Email / Name"
              className="pl-10 pr-4 py-2 bg-neutral-800/60  border-primary-500 border-2 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <button className=" bg-primary-300 hover:bg-primary-400 text-white px-4 py-2 rounded-lg flex items-center">
            <UserPlus size={20} className="mr-2" />
            Add User
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead className="bg-primary-400 text-white">
            <tr className=" rounded">
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Email-Phone</th>
              <th className="py-3 px-4 text-left">Country</th>
              <th className="py-3 px-4 text-left">Joined At</th>
              <th className="py-3 px-4 text-left">Balance</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b bg-primary-700 hover:bg-primary-700/90 text-white"
              >
                <td className="py-3 px-4">
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <Link
                      to={`/admin/user-detail/${user.name}`}
                      className="text-sm cursor-pointer text-blue-400"
                    >
                      {user.username}
                    </Link>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>{user.email}</div>
                  <div className="text-sm text-gray-300">{user.phone}</div>
                </td>
                <td className="py-3 px-4">{user.country}</td>
                <td className="py-3 px-4">
                  <div>{user.joinedAt}</div>
                  <div className="text-sm text-gray-300">{user.joinedAgo}</div>
                </td>
                <td className="py-3 px-4">{user.balance}</td>
                <td className="py-3 px-4">
                  <Link
                    to={`/admin/user-detail/${user.name}`}
                    className="text-blue-400 hover:text-blue-300"
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
