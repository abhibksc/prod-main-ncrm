import { motion, AnimatePresence } from "framer-motion";
import { BookOpenIcon, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { useState, useEffect } from "react";

const DefinitionAccordion = ({ title, content, isOpen, toggle }) => {
  return (
    <div className="border border-gray-200 rounded-md">
      <button
        className="w-full px-4 py-3 text-left focus:outline-none flex justify-between items-center"
        onClick={toggle}
      >
        <span className="font-medium">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 bg-secondary-800/60">{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UserRules = () => {
  const [expandedDefinition, setExpandedDefinition] = useState(
    "What is Forex Trading?"
  );
  const [visibleRules, setVisibleRules] = useState([]);

  const toggleDefinition = (definition) => {
    setExpandedDefinition(
      expandedDefinition === definition ? null : definition
    );
  };

  const rules = [
    {
      color: "bg-red-500",
      text: "Beta funded don't have any IP address related issues ,like other firms have. You can trade with multiple devices and from multiple locations.",
    },
    {
      color: "bg-yellow-500",
      text: "You may hold trades over the weekend during the Challenge phases. You cannot hold over the weekend once your account has been funded. If you do not close your trades by Friday and post market closing, you will face a hard breach and forfeit your funded account.",
    },
    {
      color: "bg-yellow-500",
      text: "You can hold overnight trades.",
    },
    {
      color: "bg-green-500",
      text: "Beta funded does not impose any restriction on using Stop-Loss (SL) on challenges and live accounts.",
    },
    {
      color: "bg-blue-600",
      text: "Base leverage on all evaluation accounts is set at 1:200. During the experienced trader/funded stage, leverage is 1:100",
    },
  ];

  useEffect(() => {
    rules.forEach((_, index) => {
      setTimeout(() => {
        setVisibleRules((prev) => [...prev, index]);
      }, index * 500); // 500ms delay between each rule
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-secondary-800/40 to-secondary-800/30 rounded-xl shadow-lg">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Roles & Definitions
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rules Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-secondary-700/40 rounded-lg shadow-md p-6"
        >
          <h3 className="text-2xl font-semibold mb-4 flex items-center">
            <Shield className="mr-2" />
            Rules
          </h3>
          <ul className="space-y-3">
            {rules.map((rule, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={
                  visibleRules.includes(index) ? { opacity: 1, x: 0 } : {}
                }
                transition={{ duration: 0.5 }}
                className="flex items-start"
              >
                <div
                  className={`flex-shrink-0 w-1.5 h-1.5 mt-1.5 ${rule.color} rounded-full`}
                ></div>
                <p className="ml-2">{rule.text}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Forex Definitions Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-secondary-700/40 rounded-lg shadow-md p-6"
        >
          <h3 className="text-2xl font-semibold mb-4 flex items-center">
            <BookOpenIcon className="mr-2 text-white" />
            Forex Definitions
          </h3>
          <div className="space-y-4">
            <DefinitionAccordion
              title="What is Forex Trading?"
              content="Forex trading, also known as foreign exchange trading or currency trading, is the buying and selling of currencies on the foreign exchange market with the aim of making a profit."
              isOpen={expandedDefinition === "What is Forex Trading?"}
              toggle={() => toggleDefinition("What is Forex Trading?")}
            />
            <DefinitionAccordion
              title="What is a Pip?"
              content="A pip, short for 'percentage in point' or 'price interest point,' is the smallest price move that an exchange rate can make based on forex market convention. Most currency pairs are priced to four decimal places and the pip is the last (fourth) decimal point."
              isOpen={expandedDefinition === "What is a Pip?"}
              toggle={() => toggleDefinition("What is a Pip?")}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserRules;
