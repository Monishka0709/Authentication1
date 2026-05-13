import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {

  const navigate = useNavigate()
  const { userInfo, backendUrl, setUserInfo, setIsLoggedIn } = useContext(AppContext);


  const sendVerificationOtp = async () => {
    try{
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(`${backendUrl}/api/auth/sendVerifyOtp`);
          if(data.success){
            navigate('/email-verify');
            
            toast.success(data.message);
          }
          else{
            toast.error(data.message);
          }
    }
    catch(error){
        toast.error(error.response?.data?.message || error.message);
    }
  }
  const logout = async() => {
    try{
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if(data.success){
        setIsLoggedIn(false);
        setUserInfo(null);
        toast.success('Logged out successfully');
        navigate('/');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img src={assets.logo} alt="logo" className='logo' className="w-28 sm:w-32" />
      {
        userInfo ? <div className="relative group flex items-center text-white h-8 w-8 rounded-full justify-center border border-gray-500 bg-gray-800 
                hover:bg-gray-300 hover:text-lime-950 transition-all cursor-pointer">
          <span className="font-medium">{userInfo.name[0].toUpperCase()}</span>
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10 ">
            <ul className="bg-gray-100 rounded shadow-lg p-2 list-none m-0 text-sm">
              {
                !userInfo.isAccountVerified && <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer' onClick={sendVerificationOtp}>Verify Email</li>
              
              }
              <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Logout</li>
            </ul>
          </div>
        </div>
          :
          <button onClick={() => navigate('/login')} className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all cursor-pointer">
            Login
            <img src={assets.arrow_icon} alt="login" className='w-4 h-4' />
          </button>
      }
    </div>
  )
}

export default Navbar
