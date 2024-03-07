import React, { useState } from 'react';
import { FaUserEdit } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

const EditPopup = ({ onClose, onSave }) => {
  const [editedValue, setEditedValue] = useState('');

  const handleVerifyEmail = () => {
    onSave(editedValue);
    onClose();
  };

  const handleChange = (e) => {
    setEditedValue(e.target.value)
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg w-1/6 m-auto">
        {/* <MdClose
          className="absolute top-2 right-2 cursor-pointer w-6 h-6"
          onClick={onClose}
        /> */}
        <h2 className="text-xl mb-10 text-center">Verify OTP</h2>
        <div className="mb-4">
          
          {/* <label className="block  text-sm mb-2">
            Confirm New Password:
          </label> */}
          <input
            className="popup-input w-full p-2 bg-white border border-gray-300 rounded mb-5 placeholder:text-sm"
            name='otp' type='email' placeholder='Enter OTP'
            onChange={handleChange}
          />
          
        </div>
        <div className='text-center mt-5'>
        <button 
        className='text-black py-2 px-4 rounded border me-2'
        style={{borderColor:'rgb(60,109,121)'}}
        onClick={onClose}>Cancel</button>
        <button
          className=" text-white py-2 px-4 rounded "
          style={{backgroundColor:'rgb(60,109,121)'}}
          onClick={handleVerifyEmail}>Verify</button>
        </div>
      </div>
    </div>
  );
};

export default EditPopup;
