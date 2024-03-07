import React, { useState } from 'react';
import { FaUserEdit } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

const EditPopup = ({ onClose, onSave }) => {
  const [editedValue, setEditedValue] = useState({
    password: '',
    newpassword: '',
    confnewpassword: ''
  });

  const handleSavePass = () => {
    onSave(editedValue);
    onClose();
  };

  const handleChange = (e) => {
    setEditedValue({...editedValue,[e.target.name]:e.target.value})
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg w-1/3 m-auto">
        {/* <MdClose
          className="absolute top-2 right-2 cursor-pointer w-6 h-6"
          onClick={onClose}
        /> */}
        <h2 className="text-xl mb-10 text-center">Change Password</h2>
        <div className="mb-4">
          <label className="block  text-sm mb-2">
            Current Password:
          </label>
          <input
            className="popup-input w-full p-2 bg-white border border-gray-300 rounded mb-5 placeholder:text-sm"
            name='password' type='password' placeholder='Enter your current password...'
            onChange={handleChange}
          />
          <label className="block  text-sm mb-2">
            New Password:
          </label>
          <input
            className="popup-input w-full p-2 bg-white border border-gray-300 rounded mb-5 placeholder:text-sm"
            name='newpassword' type='password' placeholder='Enter your new password...'
            onChange={handleChange}
          />
          <label className="block  text-sm mb-2">
            Confirm New Password:
          </label>
          <input
            className="popup-input w-full p-2 bg-white border border-gray-300 rounded mb-5 placeholder:text-sm"
            name='confnewpassword' type='password' placeholder='Confirm your new password...'
            onChange={handleChange}
          />
          
        </div>
        <div className='text-end mt-10'>
        <button 
        className='text-black py-2 px-4 rounded border me-2'
        style={{borderColor:'rgb(60,109,121)'}}
        onClick={onClose}>Cancel</button>
        <button
          className=" text-white py-2 px-4 rounded "
          style={{backgroundColor:'rgb(60,109,121)'}}
          onClick={handleSavePass}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditPopup;
