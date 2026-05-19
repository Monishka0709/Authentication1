import React, { useState, useContext } from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Login = () => {

    const navigate = useNavigate();

    const {state, setState, backendUrl,  setIsLoggedIn, getUserData} = useContext(AppContext);

    //const [state, setState] = useState('Sign Up');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleSubmit = async (e) => {
        
      try{
        e.preventDefault();

        axios.defaults.withCredentials = true;
      

        if(state === 'Sign Up'){
          const {data} = await axios.post(`${backendUrl}/api/auth/register`, {name, email, password});

          if(data?.success){
            setIsLoggedIn(true);
            await getUserData();
            toast.success('Registration successful');
            navigate('/');

          }
          else{
            toast.error(data?.message || 'Registration failed');
          }

          console.log('Sign Up:', { name, email, password });
        } 
        else {
          
          const { data } = await axios.post(`${backendUrl}/api/auth/login`, {email, password}, {withCredentials: true});
          console.log(data);
            
          if(data?.success){
            setIsLoggedIn(true);
            getUserData();
            toast.success('Login successful');
            navigate('/');
          }
          else{
            toast.error(data?.message || 'Login failed');
          }

      }}
      catch(err){
        console.error(err);
        toast.error(err?.response?.data?.message || 'An error occurred'); 
      }
      }
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-purple-400'>
      <img src={assets.logo} alt="logo" className='logo' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      <div className="bg-slate-900 shadow-lg sm:w-96 text-indigo-300 text-sm bg-opacity-80 backdrop-blur-md rounded-xl p-8 sm:p-12 w-full max-w-md">
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
        <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account'}</p>

        <form onSubmit={handleSubmit} className='flex flex-col gap-2 mt-6' >
          {state==='Sign Up' &&<div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.person_icon} alt="person" />
            <input value={name} onChange={(e)=> setName(e.target.value)} type="text" placeholder="Full Name" required className="bg-transparent text-white placeholder:text-gray-200 focus:outline-none" />
          </div>  
          }
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="person" />
            <input value={email} onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="Email" required className="bg-transparent text-white placeholder:text-gray-200 focus:outline-none" />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="person" />
            <input value={password} onChange={(e)=> setPassword(e.target.value)} type="password" placeholder="Password" required className="bg-transparent text-white placeholder:text-gray-200 focus:outline-none" />
          </div>
          {state === 'Sign Up' &&
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.lock_icon} alt="person" />
              <input value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password" required className="bg-transparent text-white placeholder:text-gray-200 focus:outline-none" />
            </div>
          }
          {
            state === 'Sign Up' && password !== confirmPassword &&
            <p className='text-red-500 text-sm mb-4'>Passwords do not match</p>
          }

          {state === 'Login' &&
          <p onClick={() => navigate('/reset-password')} className="mb-6 text-center text-sm text-indigo-500 hover:text-white cursor-pointer">Forgot password?</p>
          
          }
          <button type="submit" className="bg-radial from-purple-500 to-purple-700 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full">
            {state}
          </button>
        </form>
        {state === 'Sign Up' ?
          <p className='cursor-pointer mt-6 text-center text-sm text-gray-300'>Already have an account? <span onClick={() => setState('Login')} className='text-indigo-500 hover:text-white cursor-pointer'>Login</span></p>
          :
          <p className='cursor-pointer mt-6 text-center text-sm text-gray-300'>Don't have an account? <span onClick={() => setState('Sign Up')} className='text-indigo-500 hover:text-white cursor-pointer'>Sign Up</span></p>
        }
      </div>
      
    </div>
  )
}

export default Login
