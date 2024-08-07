import React, { useState } from "react";
import { AlertCircle, PaperclipIcon, Send } from "lucide-react";

const UserSupportTicket = () => {
  const [isOpenTicketFormVisible, setIsOpenTicketFormVisible] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Support Tickets</h2>
        <button
          onClick={() => setIsOpenTicketFormVisible(true)}
          className="bg-secondary-600/80 hover:bg-secondary-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Open Support Ticket
        </button>
      </div>

      {!isOpenTicketFormVisible ? (
        <div className="bg-secondary-700 shadow-md rounded-lg p-6 flex items-center justify-center">
          <AlertCircle className="text-gray-400 mr-2" />
          <span className="text-gray-300 font-medium">Data not found</span>
        </div>
      ) : (
        <OpenTicketForm onClose={() => setIsOpenTicketFormVisible(false)} />
      )}
    </div>
  );
};

const OpenTicketForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "Awais Sharif",
    email: "awaissharif17@gmail.com",
    subject: "",
    priority: "High",
    message: "",
    attachments: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
    onClose();
  };

  return (
    <div className="bg-secondary-800/60  shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold  mb-4">Open Ticket</h3>
      <form onSubmit={handleSubmit} className="space-y-4 pb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium  mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium  mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium  mb-1"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium  mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium  mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium  mb-1">Attachments</label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Choose File
            </button>
            <span className="text-sm ">No file chosen</span>
          </div>
          <p className="mt-1 text-xs ">
            Max 5 files can be uploaded. Maximum upload size is 3072M
          </p>
          <p className="text-xs ">
            Allowed File Extensions: .jpg, .jpeg, .png, .pdf, .doc, .docx
          </p>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserSupportTicket;
