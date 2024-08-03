import React, { useState } from "react";
import { X, Edit, Plus } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

const KYCSetting = () => {
  const [formFields, setFormFields] = useState([
    { label: "Full Name", type: "text" },
    { label: "NID Number", type: "text" },
    { label: "Gender", type: "select" },
    { label: "CNIC", type: "file" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const handleAddNew = () => {
    setFormFields([...formFields, { label: "New Field", type: "text" }]);
  };

  const handleEdit = (index) => {
    setEditingField(formFields[index]);
    setIsDialogOpen(true);
  };

  const handleDelete = (index) => {
    const newFields = formFields.filter((_, i) => i !== index);
    setFormFields(newFields);
  };

  const handleUpdate = (updatedField) => {
    const newFields = formFields.map((field) =>
      field === editingField ? updatedField : field
    );
    setFormFields(newFields);
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-primary-700 text-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">KYC Setting</h2>
        </div>
        <div className="bg-primary-500 text-white p-4 rounded-lg flex justify-between items-center mb-6">
          <span className="font-semibold">KYC Form for User</span>
          <button
            onClick={handleAddNew}
            className="bg-white font-semibold text-primary-600 hover:bg-gray-200 px-3 py-1 rounded-md flex items-center"
          >
            <Plus size={16} className="mr-1" /> Add New
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formFields.map((field, index) => (
            <div key={index} className="bg-primary-600/50 p-4 rounded-lg">
              <div className="mb-2">
                <label className="block text-sm font-medium">Label</label>
                <div className="mt-1 bg-white text-black py-2 px-3 rounded-md">
                  {field.label}
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium ">Type</label>
                <div className="mt-1 bg-white text-black py-2 px-3 rounded-md">
                  {field.type}
                </div>
              </div>
              <div className="flex mt-4">
                <button
                  onClick={() => handleEdit(index)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-l-md hover:bg-blue-600"
                >
                  <Edit size={16} className="inline mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-r-md hover:bg-red-700"
                >
                  <X size={16} className="inline mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-6 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
          Submit
        </button>
      </div>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsDialogOpen(false)}
          />
          <Dialog.Content className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto relative">
              <Dialog.Title className="text-xl font-bold mb-4">
                Generate Form
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <X size={24} />
                </button>
              </Dialog.Close>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate({
                    label: e.target.formLabel.value,
                    type: e.target.formType.value,
                  });
                }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Form Type
                  </label>
                  <select
                    name="formType"
                    defaultValue={editingField?.type}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="text">Text</option>
                    <option value="select">Select</option>
                    <option value="file">File</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Is Required
                  </label>
                  <select
                    defaultValue="Required"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option>Required</option>
                    <option>Optional</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Form Label
                  </label>
                  <input
                    type="text"
                    name="formLabel"
                    defaultValue={editingField?.label}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                >
                  Update
                </button>
              </form>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default KYCSetting;
