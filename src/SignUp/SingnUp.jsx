import React, { useEffect, useState } from 'react'
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { errorToast, successToast, warnToast } from '../Components/Toast';
import VerifyOtpPopup from '../Components/PopupEdit/VerifyOtpPopup';
import google from '../assets/Google.png'
import { useUser } from '../context/UserContext';


const SingnUp = () => {

  const [data,setData] = useState('')
  const [userId,setUserId] = useState('')
  const [isVerifyOTP,setIsVerifyOTP] = useState(false)

  const navigate = useNavigate()
  const token = localStorage.getItem('chatToken')
  const { googleSignIn, googleUser, fetchAgain, setFetchAgain } = useUser()


  const handleGoogleSignUp = async () => {
    try {
      const googleUserData = await googleSignIn()        
      console.log('google userData signup: ',googleUserData);
        let response = await axios.post('http://localhost:5000/api/users/google-register',googleUserData)
        if (response.data.success) {
          localStorage.setItem('userId', response.data.user._id)
          localStorage.setItem('chatToken', response.data.token)
          successToast(`Welcome ${response.data.user.firstname}`)
          console.log('google signup res: ',response);
          navigate('/userslist')
        }
      } catch(err) {
        console.log(err);
        errorToast(err && err?.response?.data?.message)
      }
  }

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
  },[token])



  return (
    <div>
      
      <div className='signup w-[80%] sm:w-[70%] md:w-[50%] lg:w-[35%] m-auto mt-10 mb-10  p-5 sm:p-10 text-center text-white'>
        <h1 className='text-2xl sm:text-4xl mb-10'>Sign Up</h1>
        <form onSubmit={handleSubmit} className='text-center'>
            <input className='w-10/12 sm:w-4/5 placeholder:text-sm' type="text" name='firstname' placeholder='Enter firstname' onChange={handleChange} /><br />
            <input className='w-10/12 sm:w-4/5 placeholder:text-sm' type="text" name='lastname' placeholder='Enter lastname' onChange={handleChange}/><br />
            <input className='w-10/12 sm:w-4/5 placeholder:text-sm' type="text" name='email' placeholder='Enter email' onChange={handleChange}/><br />
            <input className='w-10/12 sm:w-4/5 placeholder:text-sm' type="password" name='password' placeholder='Enter password' onChange={handleChange}/><br />
            <input className='w-10/12 sm:w-4/5 placeholder:text-sm' type="password" name='confirmpassword' placeholder='Confirm password' onChange={handleChange}/><br />
            <input className='signup1-btn w-3/6 sm:w-2/6 mt-5 mb-5' type="submit" value="Sign Up" />
        </form>
        <p className='text-xs sm:text-base'>Don't have an account?  
          <Link to='login'><span className='ms-1 cursor-pointer'>Sign In</span></Link>
        </p>
        <div className='flex items-center justify-center gap-3 mt-10 '>
          <hr className='w-[50%] border-[#f9ae65]'/>
          <p>or</p>
          <hr className='w-[50%] border-[#f9ae65]'/>
        </div>
        <button className='flex items-center text-sm sm:text-base gap-2 border border-[#f9ae65] p-2 sm:p-3 m-auto mt-10 signup1-btn' onClick={handleGoogleSignUp}>
          <img src={google} alt="" className='w-5 h-5'/>
          Continue with Google
        </button>
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
