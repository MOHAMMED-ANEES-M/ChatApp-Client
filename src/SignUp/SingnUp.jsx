import React, { useEffect, useState } from 'react'
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { errorToast, successToast, warnToast } from '../Components/Toast';

const SingnUp = () => {

  const [data,setData] = useState('')
  const [confirmPass,setConfirmPass] = useState('')

  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  const handleChange =(e)=>{
    setData({...data,[e.target.name]:e.target.value})
  }

  const handleConfirmPass=(e)=>{
    setConfirmPass(e.target.value)
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
      const { firstname, lastname, email ,password } = data
      if( firstname || lastname || email || password ) {
        if(confirmPass !== password){
          console.log('pass');
          warnToast('Password not matching')
        } else {
            let response = await axios.post('http://localhost:5000/api/users/register',data)
            if (response.data) {
              successToast('Registration Success')
              navigate('login')
            }
        }
        
      }else{
        warnToast('All fields are mandatory')
        console.log('field');
      }
    } catch(err){
      console.log(err);
      errorToast(err && err.response.data.message)
    }
  }


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
            <input className='w-4/5' type="password" placeholder='Confirm password...' onChange={handleConfirmPass}/><br />
            <input className='signup1-btn w-2/6 mt-5 mb-5' type="submit" value="Sign Up" />
        </form>
        <p>Don't have an account?  
          <Link to='login'><span className='ms-1 cursor-pointer'>Sign In</span></Link>
        </p>
      </div>

    </div>
  )
}

export default SingnUp
