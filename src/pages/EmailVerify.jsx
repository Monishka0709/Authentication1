import React  from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const EmailVerify = () => {
  const navigate = useNavigate();
  const [validOtp, setValidOtp] = useState(true);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext);

  const inputRefs = useRef([])

  const handleInput = (e, index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1 ){
      inputRefs.current[index + 1].focus();
    }
  }

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
    pasteData.forEach((char, index) => {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;
      }
    });
    const nextIndex = pasteData.length < 6 ? pasteData.length : 5;
    if(inputRefs.current[nextIndex]){
      inputRefs.current[nextIndex].focus();
    } 
  }

const handleKeyDown = (e, index) => {
  
  if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace') {
    e.preventDefault();
  }

  // Handle backspace navigation
  if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
    inputRefs.current[index - 1].focus();
  }
};



  const handleSubmit = (e) => {
    e.preventDefault();
    const otp = inputRefs.current.map(input => input.value).join('');
    console.log('Entered OTP:', otp);
    verifyOtp(otp);

  }

  const sendOtpAgain = async () => {
    try{
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(`${backendUrl}/api/auth/sendVerifyOtp`);
          if(data.success){
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

  const verifyOtp = async (otp) => {
    try{
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/verifyAccount`, {otp});
      if(data.success){
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else{
        toast.error(data.message);
      }   
    }
    catch(error){
      toast.error(error.response?.data?.message || error.message);
    }
  }

  useEffect(() => {
    if(!isLoggedIn){
      navigate('/login');
    }
    else if(userData?.isAccountVerified){
      navigate('/');
    } 
  }, [isLoggedIn, userData])

  useEffect(() => {
    if(timeLeft === 0){
      toast.error('OTP expired. Please request a new one.');
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    if(timeLeft === 0){
      setValidOtp(false);
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-purple-400'>
      <img onClick={()=>navigate('/')} src={assets.logo} alt="logo" className='logo cursor-pointer' className="w-28 sm:w-32 absolute left-5 sm:left-20 top-5" />
      <form className='bg-slate-900 p-8 rounded-lg shadow-g w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4' >Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email</p>

        <div onPaste={handlePaste} className='flex justify-between mb-8'>

          {
            Array(6).fill(0).map((_,index) => (
              <input key={index} type="text" maxLength="1" className='w-12 h-12 text-center bg-[#333A5C] text-white text-lg rounded  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none' ref={e => inputRefs.current[index] = e} onInput={(e) => handleInput(e,index)} onKeyDown={(e) => handleKeyDown(e,index)} />
            ))
          }
        </div>
        <p className='text-center text-sm mb-4 text-gray-300'>{timeLeft > 0 && validOtp ? `Resend OTP in ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}` : <span className='text-blue-500 cursor-pointer' onClick={sendOtpAgain}>Resend</span>}</p>
        <button onClick={handleSubmit} type="submit" className='w-full py-3 bg-radial from-purple-500 to-purple-700 hover:bg-indigo-700 text-white font-bold rounded-full'>Verify</button>
      </form>
        
    </div>
  )
}

export default EmailVerify
