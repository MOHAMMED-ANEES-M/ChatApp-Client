import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { BsGrid1X2Fill } from "react-icons/bs";
import './UsersList.css'


const UsersList = () => {
  const [usersData, setUsersData] = useState(['']);
  const [profileData, setProfileData] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const userListRef = useRef(null); 
  const navigate = useNavigate()
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
    window.location.reload();
}

  useEffect(() => {

    if (!token) {
      return navigate('/login')
    }
    const fetchUsersData = async () => {
      try {
        console.log('fdvd');
        const users = await axios.get('http://localhost:5000/api/users/', {
          headers: {
            Authorization: token,
          },
        });
        const filteredUsers = users.data.filter(user => user._id !== userId);
        setUsersData(filteredUsers);
        const profile = users.data.filter(user => user._id === userId);
        setProfileData(profile);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsersData();
  }, [token]);

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  


  return (
    <div className='flex'>

    <div>

      <button className=' p-3 m-2 ' style={{ color: 'rgb(60,109,121)' }} onClick={() => setIsSidebarOpen(true)} ref={sidebarRef}><BsGrid1X2Fill className='w-7 h-7 sm:w-10 sm:h-10'/></button>

      <div className={`h-full p-3 space-y-2 w-2/3 sm:w-96 dark:text-gray-100 lg:block ${isSidebarOpen ? "block" : "hidden"}`} style={{ backgroundColor: 'rgb(60,109,121)' }} ref={sidebarRef}>

    <div class="flex items-center p-5 space-x-4 fixed top-0 left-0 border-b w-2/3 sm:w-[384px]" style={{backgroundColor: 'rgb(60,109,121)'}}>
      <img src="https://source.unsplash.com/100x100/?portrait" alt="profile" class="w-12 h-12 rounded-full dark:bg-gray-500"/>
      <div>
        <h2 class="text-lg ">{profileData[0]?.firstname} {profileData[0]?.lastname}</h2>
        <span class="flex items-center space-x-1">
          <Link to='profile'><a rel="noopener noreferrer" href="#" class="text-xs hover:underline dark:text-gray-400">View profile</a></Link>
        </span>
      </div>
    </div>

    <div class="divide-y dark:divide-white ">
     
      <ul class="pt-2 pb-4 space-y-1 text-sm mb-0 mt-0 custom-scroll " ref={userListRef} style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
      {usersData.map((user) => (
              <li key={user._id} className='text-white cursor-pointer shadow p-5 rounded'>
                {user.firstname} {user.lastname}
              </li>      
      ))}
      </ul>

      <ul class="p-5 py-3 space-y-1 text-sm fixed bottom-0 left-0 w-2/3 sm:w-[384px]" style={{backgroundColor: 'rgb(60,109,121)'}}>
        <li>
          <button onClick={handleLogout} className='signout-btn p-3 w-24'>Logout</button>
        </li>
      </ul>
    </div>

  </div>

  </div>

  <div className='w-full'>
    <Outlet />
  </div>

  </div>
  );
};

export default UsersList;
