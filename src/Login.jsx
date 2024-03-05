import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { successToast, warnToast } from './Components/Toast'
import axios from 'axios'

const Login = () => {

  const [data, setData] = useState('')

  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  const handleChange = (e) => {
    setData({...data,[e.target.name]: e.target.value})
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { password, email } = data
      if (password && email) {
        const response = await axios.post('http://localhost:5000/api/users/login',data)
        if (response.data.success) {
          successToast(`Welcome ${response.data.user.firstname}`)
          localStorage.setItem('userId', response.data.user._id)
          localStorage.setItem('token', response.data.token)
          navigate('/userslist')
        }
      } else {
        warnToast('All fields are mandatory')
      }
    } catch (err) {
      console.log(err);
      warnToast(err && err.response.data.message)
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
      
      <div className='signup w-1/3 m-auto text-center text-white mt-20  p-10 '>
        <h1 className='text-4xl mb-16'>Sign In</h1>
        <form className='text-center' onSubmit={handleSubmit}>
            <input className='w-4/5' type="text" name='email' placeholder='Enter your email...' onChange={handleChange}/><br />
            <input className='w-4/5' type="password" name='password' placeholder='Enter your password...' onChange={handleChange}/><br />
            <input className='signup1-btn w-2/6 mt-5 mb-10' type="submit" value="Sign In" />
        </form>
        <p>Don't have an account?  
          <Link to='/'><span className='ms-1 cursor-pointer'>Sign Up</span></Link>
        </p>
      </div>

    </div>
  )
}

export default Login
