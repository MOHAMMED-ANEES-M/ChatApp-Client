import React, { useContext, useEffect, useState } from 'react'
import { FaUserEdit } from "react-icons/fa";
import { useUser } from "../../context/UserContext"
import { useNavigate } from 'react-router-dom';
import { HiMail } from "react-icons/hi";
import { FaCircleInfo } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import profile from '../../assets/dp.jpg'
import axios from 'axios';
import { errorToast } from '../../Components/Toast';
import ImageUpdatePopup from '../../Components/PopupEdit/ImageUpdatePopup';
import EditPopup from '../../Components/PopupEdit/EditPopup';



const Profile = () => {
  
  const [image, setImage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showImageConfirmation, setShowImageConfirmation] = useState(false);
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { userData, updateUser, setFetchAgain } = useUser();

  const handleEdit = () => {
    setIsEditing(true);
  };


  const handleSave = async (editedValue) => {
    try{
      const response = await axios.put('http://localhost:5000/api/users/update-profile',editedValue,{
        headers: {
          Authorization: token
        }
      })
      if (response.data.success) {
        console.log('updated profile res',response);
        updateUser({ ...userData, editedValue });
      }
      
    }catch(err){
      console.log(err);
    }
  };

  const handleImage = async (e) => {
    try {
      console.log('sdd');
      const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;
        setImage(base64String);
        setShowImageConfirmation(true);
      };

      reader.readAsDataURL(file);
    }
      
    } catch (err) {
      console.log(err);
      errorToast(err && err.response && err.response.data.message)
    }
  }


  useEffect(() => {

    if (!token) {
      navigate('/login')
    }

    setFetchAgain(true);
    
  },[token])

  return (
    <div>

      <div className='w-1/6 m-auto mt-20 relative'>
        <img src={userData?.image} alt='profile' class="w-40 h-40 rounded-full dark:bg-gray-500 object-cover "/>
        <div style={{ backgroundColor: 'rgb(60,109,121)' }} className='w-fit p-3 rounded-full absolute top-3/4 left-2/4'>
          <label htmlFor="fileInput" className="file-input-label">
          <span ><FaUserEdit className='w-6 h-6 text-white cursor-pointer'/></span>
          <input type="file" id="fileInput" className="hidden" onChange={handleImage}/>
          </label>
        </div>

      </div>

      <p className='font-semibold text-lg text-center mt-10'>{userData?.firstname} {userData?.lastname}</p>
      <div className='w-1/4 m-auto mt-10'>
        <div className='flex gap-5'>
          <p className='flex items-center gap-5 mb-5 min-w-60'>
          <HiMail
            className='w-5 h-5 '
            style={{ color: 'rgb(60,109,121)' }}
          />
          {userData?.email}
        </p></div>
        <div className='flex gap-5'>
          <p className='flex items-center gap-5 min-w-60'>
          <FaCircleInfo
            className='w-4 h-4 ms-1'
            style={{ color: 'rgb(60,109,121)' }}
          />
          {userData?.bio}
          </p>
        </div>
      </div>
        <div className=' mt-10 flex justify-center gap-3'>
        <button className='px-5 py-2 border ' style={{borderColor:'rgb(60,109,121)'}} onClick={handleEdit}>Edit Profile</button>
        <button className='px-5 py-2 border ' style={{borderColor:'rgb(60,109,121)'}}>Change Password</button>
        </div>

      {isEditing && (
        <EditPopup
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          initialValue={userData}
        />
      )}


      
      {/* Confirmation Popup */}
      {showImageConfirmation && (
        <ImageUpdatePopup
          onClose={() => setShowImageConfirmation(false)}
          onConfirm={async () => {
            try {
              console.log('image',image);
              
              const response = await axios.put('http://localhost:5000/api/users/update-image', {image:image}, {
                headers: {
                  Authorization: token,
                },
              });
              if (response.data.success) {
                console.log(response.data);
                updateUser({ ...userData, image: response.data.user.image });
              }
            } catch (err) {
              console.log(err);
              errorToast(err && err.response && err.response.data.message);
            } finally {
              setShowImageConfirmation(false);
            }
          }}
          image={image}
        />
      )}

    </div>
  )
}

export default Profile
