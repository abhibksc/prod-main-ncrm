import { useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Home,
  User,
  Settings,
  Info,
  ContactIcon,
  ArrowRightCircle,
} from "lucide-react";
import SetupChallenges from "../pages/admin/SetupChallenges";

const Sidebar = () => {
  const [openSections, setOpenSections] = useState(new Set());

  const toggleSection = (section) => {
    setOpenSections((prev) => {
      const newOpenSections = new Set(prev);
      if (newOpenSections.has(section)) {
        newOpenSections.delete(section);
      } else {
        newOpenSections.add(section);
      }
      return newOpenSections;
    });
  };

  const menuItems = [
    { label: "Dashboard", icon: <Home />, route: "/admin/dashboard" },
    {
      label: "Commission Lavels",
      icon: <ContactIcon />,
      nested: [
        { label: "Deposit", route: "/admin/deposit" },
        { label: "Withdraw", route: "/admin/withdraw" },
      ],
    },
    {
      label: "Setup challenges",
      icon: <ArrowRightCircle />,
      route: "/admin/setup-challenges",
    },

    {
      label: "Settings",
      icon: <Settings />,
      nested: [
        { label: "Account", route: "/settings/account" },
        { label: "Privacy", route: "/settings/privacy" },
      ],
    },
    { label: "About", icon: <Info />, route: "/about" },
  ];

  return (
    <aside className="h-screen w-64 pt-3 bg-primary-800 text-white">
      <motion.div
        className="overflow-y-auto"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ul className="space-y-2 text-sm px-4 py-1">
          {menuItems.map((item, index) => (
            <li key={index} className="relative">
              {item.route ? (
                <NavLink
                  to={item.route}
                  className={({ isActive }) =>
                    `flex items-center w-full p-2 text-left rounded transition-colors duration-200 ${
                      isActive ? "bg-primary-600" : "hover:bg-primary-600"
                    }`
                  }
                >
                  {item.icon}
                  <span className="ml-3 text-sm">{item.label}</span>
                </NavLink>
              ) : (
                <button
                  onClick={() => item.nested && toggleSection(item.label)}
                  className="flex items-center w-full p-2 text-left hover:bg-primary-600 rounded transition-colors duration-200"
                >
                  {item.icon}
                  <span className="ml-3 text-sm">{item.label}</span>
                  {item.nested && (
                    <span className="ml-auto">
                      {openSections.has(item.label) ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </span>
                  )}
                </button>
              )}
              {item.nested && openSections.has(item.label) && (
                <motion.ul
                  className="ml-6 mt-1 space-y-1 bg-primary-700 rounded-lg shadow-md"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.nested.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <NavLink
                        to={subItem.route}
                        className={({ isActive }) =>
                          `flex items-center p-2 text-left text-gray-300 hover:bg-primary-600 rounded-lg transition-colors duration-200 ${
                            isActive ? "bg-primary-600" : ""
                          }`
                        }
                      >
                        <span className="ml-2 text-sm">{subItem.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </motion.ul>
              )}
            </li>
          ))}
        </ul>
      </motion.div>
    </aside>
  );
};

export default Sidebar;
