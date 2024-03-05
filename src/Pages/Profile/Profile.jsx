import React, { useContext, useEffect, useState } from 'react'
import { FaUserEdit } from "react-icons/fa";
import { useUser } from "../../context/UserContext"
import { useNavigate } from 'react-router-dom';
import { HiMail } from "react-icons/hi";
import { FaCircleInfo } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import EditProfilePopup from '../../Components/PopupEdit/EditPopup';



const Profile = () => {

  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { userData } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = (editedBio) => {
    // Make an API call or update the context with the edited bio
    // For now, let's just update the local state
    // updateUser({ ...userData, bio: editedBio });
  };



  useEffect(() => {

    if (!token) {
      navigate('/login')
    }

    
  })

  return (
    <div>

      <div className='w-1/6 m-auto mt-10 relative'>
        <img src="https://source.unsplash.com/100x100/?portrait" alt="profile" class="w-40 h-40 rounded-full dark:bg-gray-500 "/>
        <div style={{ backgroundColor: 'rgb(60,109,121)' }} className='w-fit p-3 rounded-full absolute top-3/4 left-2/4 z-50'>
          <label htmlFor="fileInput" className="file-input-label">
          <span ><FaUserEdit className='w-6 h-6 text-white'/></span>
          <input type="file" id="fileInput" className="hidden" />
          </label>
      </div>

      </div>

      <p className='font-semibold text-lg text-center mt-10'>{userData.firstname} {userData.lastname}</p>
      <div className='w-1/4 m-auto mt-10'>
        <p className='flex items-center gap-5 mb-5'>
          <HiMail
            className='w-8 h-8 '
            style={{ color: 'rgb(60,109,121)' }}
          />{' '}
          {userData.email}{' '}
          <MdEdit
            className='w-6 h-6 mb-3 cursor-pointer'
            style={{ color: 'rgb(60,109,121)' }}
            onClick={handleEditClick}
          />
        </p>
        <p className='flex items-center gap-5'>
          <FaCircleInfo
            className='w-7 h-7 ms-1'
            style={{ color: 'rgb(60,109,121)' }}
          />{' '}
          {userData.bio}{' '}
          <MdEdit
            className='w-6 h-6 mb-3 cursor-pointer'
            style={{ color: 'rgb(60,109,121)' }}
            onClick={handleEditClick}
          />
        </p>
      </div>

      {isEditing && (
        <EditProfilePopup
          onClose={() => setIsEditing(false)}
          onSave={handleSaveEdit}
          initialValue={userData.bio}
        />
      )}
    </div>
  )
}

export default Profile
