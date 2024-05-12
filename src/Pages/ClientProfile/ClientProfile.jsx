import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { errorToast } from '../../Components/Toast'
import axios from 'axios'
import profile from '../../assets/images.png'
import { FaCircleInfo } from 'react-icons/fa6'
import { HiMail } from 'react-icons/hi'


const ClientProfile = () => {

    const [clientData, setClientData] = useState('')
    const navigate = useNavigate()
    const { clientId } = useParams()
    const token = localStorage.getItem('token')


    useEffect(() => {
        
        if (!token) {
            navigate('login')
        }

        const fetchClient = async () => {
            try {
                let response = await axios.get(`http://localhost:5000/api/users/${clientId}`, {
                    headers: {
                        Authorization: token
                    }
                })
                if (response.data.success) {
                    console.log('client data res: ',response);
                    setClientData(response.data.user)
                }
            } catch (err) {
                console.log(err);
                errorToast(err && err.response && err.response.data.message)
            }
        }
        fetchClient()

    },[])

  return (
    <div>

      <div className=' flex items-center justify-between gap-3 sm:px-10 p-3 sm:p-5 h-14 sm:h-24' style={{backgroundColor: "rgb(60,109,121)"}}>
      <p className='text-white ps-10 sm:ps-0'>{clientData.firstname} {clientData.lastname}</p>
            {clientData.image === undefined ? (
                <img src={profile} alt="User" className='w-7 h-7 sm:w-10 sm:h-10 rounded-full dark:bg-gray-500 object-cover ' />
            ) : (
                <img src={clientData.image} alt="User" className='w-7 h-7 sm:w-10 sm:h-10 rounded-full dark:bg-gray-500 object-cover ' />
            )}
        </div>

        <div className='w-fit m-auto mt-10 sm:mt-20'>
            {clientData.image === undefined ? (
                <img src={profile} alt="User" className='w-20 h-20 sm:w-40 sm:h-40 rounded-full dark:bg-gray-500 object-cover ' />
            ) : (
                <img src={clientData.image} alt="User" className='w-20 h-20 sm:w-40 sm:h-40 rounded-full dark:bg-gray-500 object-cover ' />
            )}
        </div>
        <p className='font-semibold sm:text-lg text-center mt-5'>{clientData.firstname} {clientData.lastname}</p>
        <p className=' text-center mt-5'>{clientData.bio}</p>
        <p className=' text-center mt-2'>{clientData.email}</p>
        <div className="w-fit m-auto mt-10">
        <Link to={`/userslist/chatpage/${clientId}`}
            key={clientData._id}
            state={{ firstname: clientData.firstname, lastname: clientData.lastname, image: clientData.image }}
        >
            <button className='px-5 py-1 border' style={{borderColor:'rgb(60,109,121)'}}>Chat</button>
        </Link>
        </div>

    </div>
  )
}

export default ClientProfile
