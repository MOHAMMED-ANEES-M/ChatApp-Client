import React, { useState } from 'react';
import { FaUserEdit } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

const EditProfilePopup = ({ onClose, onSave, initialValue }) => {
  const [editedValue, setEditedValue] = useState(initialValue);

  const handleSave = () => {
    onSave(editedValue);
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg w-1/2">
        <MdClose
          className="absolute top-2 right-2 cursor-pointer w-6 h-6"
          onClick={onClose}
        />
        <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Bio:
          </label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditProfilePopup;
