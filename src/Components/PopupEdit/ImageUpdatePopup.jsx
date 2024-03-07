
import React from 'react';

const ImageUpdatePopup = ({ onClose, onConfirm, image }) => {
  return (
    <div className=" fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg w-fit m-auto">
        <p className='mb-10'>Are you sure you want to update the image?</p>
        {image && <img src={image} alt="Selected" className="w-40 h-40 rounded-full dark:bg-gray-500 object-cover  m-auto" />}
        <div className="flex justify-center gap-3 mt-10">
          <button onClick={onClose} 
            className='text-black py-2 px-4 rounded border me-2'
            style={{borderColor:'rgb(60,109,121)'}}>Cancel</button>
             <button onClick={onConfirm}
            className=" text-white py-2 px-4 rounded "
            style={{backgroundColor:'rgb(60,109,121)'}}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpdatePopup;
