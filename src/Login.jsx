import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { errorToast, successToast, warnToast } from './Components/Toast'
import axios from 'axios'
import VerifyOtpPopup from './Components/PopupEdit/VerifyOtpPopup';
import google from './assets/Google.png'
import { useUser } from './context/UserContext';


const Login = () => {

  const [data, setData] = useState('')
  const [isVerifyOTP,setIsVerifyOTP] = useState(false)
  const [emailVerified,setIsEmailVerified] = useState(false)

  const navigate = useNavigate()
  const token = localStorage.getItem('chatToken')
  const { googleSignIn } = useUser()


  const handleGoogleSignIn = async () => {
    try {
      const googleUserData = await googleSignIn()        
      console.log('google userData signin: ',googleUserData);
        let response = await axios.post('http://localhost:5000/api/users/google-register',googleUserData)
        if (response.data.success) {
          localStorage.setItem('userId', response.data.user._id)
          localStorage.setItem('chatToken', response.data.token)
          successToast(`Welcome ${response.data.user.firstname}`)
          console.log('google signin res: ',response);
          navigate('/userslist')
        }
      } catch(err) {
        console.log(err);
        errorToast(err && err?.response?.data?.message)
      }
  }


  const handleChange = (e) => {
    setData({...data,[e.target.name]: e.target.value})
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        const response = await axios.post('http://localhost:5000/api/users/login',data)
        if (response.data.success) {
          console.log('email verified');
          setIsEmailVerified(true)
          successToast(`Welcome ${response.data.user.firstname}`)
          localStorage.setItem('userId', response.data.user._id)
          localStorage.setItem('chatToken', response.data.token)
          navigate('/userslist')
        }
        if (response.data.notVerified) {
          setIsEmailVerified(false)
          console.log('email not verified');
          localStorage.setItem('userId', response.data.user._id)
          localStorage.setItem('token', response.data.token)
          warnToast(response.data.message)
          setIsVerifyOTP(true)     
        }
    } catch (err) {
      console.log(err);
      warnToast(err && err.response && err.response.data.message)
    }
  }

  const handleVerifyEmail = async (editedValue) => {
    try{
      console.log('otp',editedValue);
      let verifyOTP = await axios.post('http://localhost:5000/api/users/verify-OTP',{otp: editedValue},{
        headers: {
          Authorization: token
        }
      })
      if (verifyOTP.data.success) {
        console.log('verifyOTP',verifyOTP);
          successToast(verifyOTP.data.message)
          setIsVerifyOTP(false)
          navigate('/userslist')
      }      
      
    }catch(err){
      setIsVerifyOTP(true)
      console.log(err);
      errorToast(err && err.response && err.response.data.message)

    }

  };


  useEffect(() => {
    try{
      if (token && emailVerified ) {
        navigate('/userslist')
      }
    } catch (err) {
      console.log(err);
    }
  },[token])

  return (
    <div>
      
      <div className='signup w-[80%] sm:w-[70%] md:w-[50%] lg:w-[35%] m-auto text-center text-white mt-10 mb-10 p-5 sm:p-10 '>
        <h1 className='text-2xl sm:text-4xl mb-16'>Sign In</h1>
        <form className='text-center' onSubmit={handleSubmit}>
            <input className='w-10/12 sm:w-4/5 placeholder:text-sm' type="text" name='email' placeholder='Enter email' onChange={handleChange}/><br />
            <input className='w-10/12 sm:w-4/5 placeholder:text-sm' type="password" name='password' placeholder='Enter password' onChange={handleChange}/><br />
            <input className='signup1-btn w-3/6 sm:w-2/6 mt-5 mb-10' type="submit" value="Sign In" />
        </form>
        <p className='text-xs sm:text-base'>Don't have an account?  
          <Link to='/'><span className='ms-1 cursor-pointer'>Sign Up</span></Link>
        </p>
        <div className='flex items-center justify-center gap-3 mt-10 '>
          <hr className='w-[50%] border-[#f9ae65]'/>
          <p>or</p>
          <hr className='w-[50%] border-[#f9ae65]'/>
        </div>
        <button className='flex items-center text-sm sm:text-base gap-2 border border-[#f9ae65] p-2 sm:p-3 m-auto mt-10 signup1-btn' onClick={handleGoogleSignIn}>
          <img src={google} alt="" className='w-5 h-5'/>
          Continue with Google
        </button>
      </div>


      
    { isVerifyOTP && (
      <VerifyOtpPopup
        onClose={() => setIsVerifyOTP(false)}
        onSave={handleVerifyEmail}
        // initialValue={userData}
      />
    )}


    </div>
  )
}

export default Login
