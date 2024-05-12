import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { TfiMenu } from "react-icons/tfi";
import './UsersList.css'
import { useUser } from '../../context/UserContext';
import profile from '../../assets/images.png'
import { GoDotFill } from "react-icons/go";
import { socket, useNewMessageContext } from '../../context/ChatProvider';
import { GrClose } from 'react-icons/gr';



const UsersList = () => {
  const { newMessageAlert, updateNewMessageAlert, lastSenderId, updateLastSenderId } = useNewMessageContext();
  const [usersData, setUsersData] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  // const [profileData, setProfileData] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
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
        setSortedUsers([...filteredUsers]); 
        console.log('fetched users',usersData);
        setRefresh(!refresh)
        // const profile = users.data.filter(user => user._id === userId);
        // setProfileData(profile);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsersData();
  }, [token]);

  useEffect(() => {
    console.log('...........');

    socket.emit('findUsers', {userId})

    socket.on('getUsers', (data) => {
      console.log('Users with latest messages:', data);

      const sortedUserIds = data.users.map(msg => msg.customerId);
      const sortedUsers = usersData?.sort((a, b) => {
        const aIndex = sortedUserIds.indexOf(a._id);
        const bIndex = sortedUserIds.indexOf(b._id);
        if (aIndex === -1) return 1; 
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });

      console.log('users data', usersData);
      setSortedUsers([...sortedUsers]);
      console.log('sorted users',sortedUsers);
    });

    socket.on('alert', (data) => {
      if (data.clientId === userId) {
        console.log('recieveMessage in list',data);
        updateNewMessageAlert(true);
        updateLastSenderId(data.customerId);
      }
      });

    return () => {
      socket.off('getUsers');
      socket.off('alert');
    };
  }, [updateNewMessageAlert,refresh]);



  useEffect(() => {
    if (newMessageAlert && lastSenderId) {
      const updatedSortedUsers = sortedUsers.slice().sort((a, b) => {
        if (a._id === lastSenderId) return -1;
        if (b._id === lastSenderId) return 1;
        return 0;
      });
      setSortedUsers(updatedSortedUsers);
    }
  }, [newMessageAlert, lastSenderId, sortedUsers]);

  if (sortedUsers.length === 0) {
    return <div>Loading...</div>;
  }


  return (
    <div className={` md:flex `}>

    <div className='w-[384px]' >

      { isSidebarOpen ? (
        <button className=' p-3 m-2 fixed top-0 right-0 z-20 sm:hidden' style={{ color: 'white' }} onClick={() => setIsSidebarOpen(false)}><GrClose className='w-4 h-4 sm:w-10 sm:h-10'/></button>
      ) : (        
        <button className=' p-3 m-2 fixed top-0 left-0 z-20 sm:hidden' style={{ color: 'white' }} onClick={() => setIsSidebarOpen(true)}><TfiMenu className='w-4 h-4 sm:w-10 sm:h-10'/></button>
      )}

      <div className={` mt-20 p-3 space-y-2 w-4/5  sm:w-[384px] dark:text-gray-100 md:block ${isSidebarOpen ? "block fixed z-50" : "hidden"}`} style={{ backgroundColor: 'rgb(60,109,121)' }} ref={sidebarRef}>

    <div class="flex items-center p-5 space-x-4  fixed top-0 left-0 h-24 border-b border-r w-4/5 sm:w-[384px]" style={{backgroundColor: 'rgb(60,109,121)'}}>
    { userData.image ? (
      <img src={userData?.image} alt="profile" class="w-12 h-12 rounded-full dark:bg-gray-500 object-cover"/>
      ) : (
        <img src={profile} alt="profile" class="w-12 h-12 rounded-full dark:bg-gray-500 object-cover"/>
    )}
        <div>
        <h2 class=" sm:text-lg ">{userData?.firstname} {userData?.lastname}</h2>
        <span class="flex items-center space-x-1">
          <Link to='profile'>
          <button onClick={() => { setClickedUserId(null); }} class="text-xs hover:underline dark:text-gray-400">
                    View profile
                  </button>          
          </Link>
        </span>
      </div>
    </div>

    <div class="divide-y dark:divide-white " style={{backgroundColor: 'rgb(60,109,121)'}}>
     
    <ul className="pt-2 pb-0 space-y-1 text-sm mb-0 mt-0 max-h-[400px] overflow-y-auto">
  <>
  {sortedUsers.map((user) => (
    <Link to={`chatpage/${user._id}`} key={user._id} state={{ firstname: user.firstname, lastname: user.lastname, image: user.image }}>
      <div className={`w-full flex gap-x-3 items-center hover:bg-regal-lightblue p-4 mb-1 ${clickedUserId === user._id ? 'bg-regal-blue ' : ''}`} onClick={() => setClickedUserId(user._id)}>
        { user.image ? (
          <img src={user?.image} alt="profile" className="w-10 h-10 rounded-full dark:bg-gray-500 object-cover"/>
        ) : (
          <img src={profile} alt="profile" className="w-10 h-10 rounded-full dark:bg-gray-500 object-cover"/>
        )}
        <li className={`w-full text-white cursor-pointer flex justify-between items-center ${newMessageAlert && lastSenderId === user._id && 'font-bold'}`}>
            {user.firstname} {user.lastname}
            {lastSenderId === user._id && newMessageAlert && <GoDotFill className="ml-1 text-[#FF7B00] w-7 h-7" />} 
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

  <div className={` ${isSidebarOpen && 'blur'}`}>
    <Outlet />
  </div>

  </div>
  );
};

export default UsersList;
