import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { BsGrid1X2Fill } from "react-icons/bs";
import './UsersList.css'
import { useUser } from '../../context/UserContext';
import profile from '../../assets/images.png'
import { AiOutlineAlert } from "react-icons/ai"; // Add the alert icon
import { useNewMessageContext } from '../../context/ChatProvider';



const UsersList = () => {
  const { newMessageAlert, updateNewMessageAlert } = useNewMessageContext();
  const [usersData, setUsersData] = useState(['']);
  // const [profileData, setProfileData] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clickedUserId, setClickedUserId] = useState(null);
  const sidebarRef = useRef(null);
  const userListRef = useRef(null); 
  const navigate = useNavigate()
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const {userData, setFetchAgain} = useUser()

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
    setFetchAgain(true)

    console.log('new mesg alert',newMessageAlert);
    
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
        // const profile = users.data.filter(user => user._id === userId);
        // setProfileData(profile);
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

    <div className='w-[384px]'>

      <button className=' p-3 m-2 ' style={{ color: 'rgb(60,109,121)' }} onClick={() => setIsSidebarOpen(true)} ref={sidebarRef}><BsGrid1X2Fill className='w-7 h-7 sm:w-10 sm:h-10'/></button>

      <div className={`h-[590px] p-3 space-y-2 w-2/3 sm:w-[384px] dark:text-gray-100 lg:block ${isSidebarOpen ? "block" : "hidden"}`} style={{ backgroundColor: 'rgb(60,109,121)' }} ref={sidebarRef}>

    <div class="flex items-center p-5 space-x-4 fixed top-0 left-0 h-24 border-b border-r w-2/3 sm:w-[384px]" style={{backgroundColor: 'rgb(60,109,121)'}}>
    { userData.image ? (
      <img src={userData?.image} alt="profile" class="w-12 h-12 rounded-full dark:bg-gray-500 object-cover"/>
      ) : (
        <img src={profile} alt="profile" class="w-12 h-12 rounded-full dark:bg-gray-500 object-cover"/>
    )}
        <div>
        <h2 class="text-lg ">{userData?.firstname} {userData?.lastname}</h2>
        <span class="flex items-center space-x-1">
          <Link to='profile'>
          <button onClick={() => { setClickedUserId(null); updateNewMessageAlert(false); }} class="text-xs hover:underline dark:text-gray-400">
                    View profile
                  </button>          
          </Link>
        </span>
      </div>
    </div>

    <div class="divide-y dark:divide-white ">
     
    <ul className="pt-2 pb-0 space-y-1 text-sm mb-0 mt-0 custom-scroll" ref={userListRef} style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
  <>
  {usersData.map((user) => (
    <Link to={`chatpage/${user._id}`} key={user._id} state={{ firstname: user.firstname, lastname: user.lastname, image: user.image }}>
      <div className={`w-full flex gap-x-3 items-center hover:bg-regal-lightblue p-4 mb-1 ${clickedUserId === user._id ? 'bg-regal-blue ' : ''}`} onClick={() => setClickedUserId(user._id)}>
        { user.image ? (
          <img src={user?.image} alt="profile" className="w-10 h-10 rounded-full dark:bg-gray-500 object-cover"/>
        ) : (
          <img src={profile} alt="profile" className="w-10 h-10 rounded-full dark:bg-gray-500 object-cover"/>
        )}
        <li className={`text-white cursor-pointer`}>
                        {user.firstname} {user.lastname}
                        {newMessageAlert && <AiOutlineAlert className="ml-1 text-yellow-500" />} {/* Display alert icon */}
                      </li>
      </div>
    </Link>
  ))}
  </>
</ul>



      <ul class="p-5 py-5 space-y-1 text-sm fixed bottom-0 left-0 w-2/3 sm:w-[384px]" style={{backgroundColor: 'rgb(60,109,121)'}}>
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
