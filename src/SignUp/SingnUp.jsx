import React, { useEffect, useState } from 'react'
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { errorToast, successToast, warnToast } from '../Components/Toast';
import VerifyOtpPopup from '../Components/PopupEdit/VerifyOtpPopup';


const SingnUp = () => {

  const [data,setData] = useState('')
  const [userId,setUserId] = useState('')
  const [isVerifyOTP,setIsVerifyOTP] = useState(false)

  const navigate = useNavigate()

  const token = localStorage.getItem('chatToken')

  const handleChange =(e)=>{
    setData({...data,[e.target.name]:e.target.value})
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
      // const { firstname, lastname, email ,password, confirmpassword } = data

      let response = await axios.post('http://localhost:5000/api/users/register',data)

      if (response.data.success) {
        console.log('register user',response);
        setUserId(response.data.user._id)
        successToast(response.data.message)
        setIsVerifyOTP(true)
      } 
        
    } catch(err){
      console.log(err);
      errorToast(err && err.response.data.message)
    }
  }

  const handleVerifyEmail = async (editedValue) => {
    try{
      console.log('otp',editedValue);
      const data = { otp: editedValue, id:userId }
      let verifyOTP = await axios.post('http://localhost:5000/api/users/verify-registration', data,{
        headers: {
          Authorization: token
        }
      })
      if (verifyOTP.data.success) {
          console.log('verifyOTP',verifyOTP);
          successToast('Registration Successfull')
          setIsVerifyOTP(false)
          navigate('login')
      }      
      
    }catch(err){
      setIsVerifyOTP(true)
      console.log(err);
      errorToast(err && err.response && err.response.data.message)

    }

  };

  useEffect(() => {
    try{
      if (token) {
        navigate('/userslist')
      }
    } catch (err) {
      console.log(err);
    }
  })



  return (
    <div>
      
      <div className='signup w-1/3 m-auto mt-3  p-5 text-center text-white'>
        <h1 className='text-4xl mb-10'>Sign Up</h1>
        <form onSubmit={handleSubmit} className='text-center'>
            <input className='w-4/5' type="text" name='firstname' placeholder='Enter your firstname...' onChange={handleChange} /><br />
            <input className='w-4/5' type="text" name='lastname' placeholder='Enter your lastname...' onChange={handleChange}/><br />
            <input className='w-4/5' type="text" name='email' placeholder='Enter your email...' onChange={handleChange}/><br />
            <input className='w-4/5' type="password" name='password' placeholder='Enter your password...' onChange={handleChange}/><br />
            <input className='w-4/5' type="password" name='confirmpassword' placeholder='Confirm password...' onChange={handleChange}/><br />
            <input className='signup1-btn w-2/6 mt-5 mb-5' type="submit" value="Sign Up" />
        </form>
        <p>Don't have an account?  
          <Link to='login'><span className='ms-1 cursor-pointer'>Sign In</span></Link>
        </p>
      </div>


      {isVerifyOTP && (
                <VerifyOtpPopup
                  onClose={() => setIsVerifyOTP(false)}
                  onSave={handleVerifyEmail}
                  // initialValue={userData}
                />
    )}

    </div>
  )
}

export default SingnUp
