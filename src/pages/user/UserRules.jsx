import { motion, AnimatePresence } from "framer-motion";
import { BookOpenIcon, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { useState } from "react";

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

  const toggleDefinition = (definition) => {
    setExpandedDefinition(
      expandedDefinition === definition ? null : definition
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-secondary-800/40 to-secondary-800/30 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Roles & Definitions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rules Section */}
        <div className="bg-secondary-700/40 rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-semibold mb-4 flex items-center">
            <Shield className="mr-2" />
            Rules
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 bg-red-500 rounded-full"></div>
              <p className="ml-2">Hard Rules - Account Closed</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 bg-yellow-500 rounded-full"></div>
              <p className="ml-2">
                Do not breach our daily drawdown limit of 4%
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 bg-yellow-500 rounded-full"></div>
              <p className="ml-2">
                Do not breach our total drawdown limit of 6%
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 bg-green-500 rounded-full"></div>
              <p className="ml-2">
                Note: Drawdown each day remains the same % but the price of a
                breach moves up as the equity in the account moves up.
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 bg-blue-600 rounded-full"></div>
              <p className="ml-2">
                See details of program on program page of the website.
              </p>
            </li>
          </ul>
        </div>

        {/* Forex Definitions Section */}
        <div className="bg-secondary-700/40 rounded-lg shadow-md p-6">
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
        </div>
      </div>
    </div>
  );
};

export default UserRules;
