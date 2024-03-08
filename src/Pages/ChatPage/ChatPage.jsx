import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import profile from '../../assets/images.png'


const ChatPage = () => {

    const {clientId} = useParams()
    const location = useLocation();
    const clientData = location.state
    console.log('clientdata',clientData);


  return (
    <div>
        <div className=' flex items-center justify-end gap-3 p-5 h-24' style={{backgroundColor: "rgb(60,109,121)"}}>
            <p className='text-white'>{clientData?.firstname} {clientData?.lastname}</p>
            {clientData?.image === undefined ? (
                <Link to={`/userslist/clientprofile/${clientId}`}><img src={profile} alt="User" className='w-10 h-10 rounded-full dark:bg-gray-500 object-cover ' /></Link>
            ) : (
                <Link to={`/userslist/clientprofile/${clientId}`}><img src={clientData.image} alt="User" className='w-10 h-10 rounded-full dark:bg-gray-500 object-cover ' /></Link>
            )}
        </div>

        <div className='text-center mt-60'>chat page with {clientData?.firstname} {clientData?.lastname}</div>
    </div>
  )
}

export default ChatPage
