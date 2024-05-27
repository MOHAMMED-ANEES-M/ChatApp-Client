import React, { useState } from 'react'
import './Navbar.css'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import logo from '../../assets/KinChatLogo.png'

    const Navbar = () => {

        const [isMenuOpen, setMenuOpen] = useState(false);

        const navigate = useNavigate()
        const token = localStorage.getItem('chatToken')
        const { logout } = useUser()

        const toggleMobileMenu = () => {
            setMenuOpen(!isMenuOpen);
        };

        const handleSignout = () => {
          try {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            logout()
            navigate('/login');
            window.location.reload();
          } catch (err) {
            console.log(err);
          }
        }


      return (
        <div>
           <nav className={`  ${token ? 'hidden' : 'nav-div p-4'}`}>
          <div className="container mx-auto flex items-center justify-between px-4">
            <div className="text-white font-bold text-lg">
              <Link to='/'>
                <div className='flex gap-2 items-center'>
                  <img src={logo} alt="" className='w-5 h-5'/>KinChat
                  </div></Link>
            </div>
            {/* <div className="hidden md:flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300">About</a>
              <a href="#" className="text-white hover:text-gray-300">Contact</a>
            </div> */}
            <div className="hidden sm:flex space-x-4 text-white">
              { token ? (
                 <button className='signout-btn p-3 w-24' onClick={handleSignout}>Sign Out</button>
              ) : (
                <>
                <Link to='login'><button className='signin-btn p-3 w-24'>Sign In</button></Link>
                <Link to='/'><button className='signup-btn p-3 w-24'>Sign Up</button></Link>
                </>
              )} 
            </div>
            <div className="sm:hidden">
              {/* Mobile menu button */}
              <button className="text-white p-2 focus:outline-none" onClick={toggleMobileMenu}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
              </button>
            </div>
          </div>
          {/* Mobile menu */}
          {isMenuOpen && (
          <div className="sm:hidden text-white p-4 mt-10">
            {/* <a href="#" className="block mb-2">
              About
            </a>
            <a href="#" className="block mb-2">
              Contact
            </a> */}
            { token ? (
                 <button className='signout-btn p-3 w-24' onClick={handleSignout}>Sign Out</button>
              ) : (
                <>
                <Link to='login'><button className='signin-btn p-3 w-24 mb-5'>Sign In</button></Link><br />
                <Link to='/'><button className='signup-btn p-3 w-24'>Sign Up</button></Link>
                </>
              )}
          </div>
        )}
        </nav>
        <div>
          <Outlet/>
        </div>
        </div>
      )
    }
    
    export default Navbar
    

