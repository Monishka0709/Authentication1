import React from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp,setOtp] = useState('');
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [validOtp, setValidOtp] = useState(true);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const { setState, backendUrl, isLoggedIn, userInfo, getUserData } = useContext(AppContext);

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

const sendOtpClicked = async (e) => {
  e.preventDefault();
  if(!email){
    toast.error('Please enter your email');
    return;
  }
  try{
    axios.defaults.withCredentials = true;
    const { data } = await axios.post(`${backendUrl}/api/auth/sendResetPasswordOtp`, {email});
    if(data.success){
      setIsEmailSent(true);
      toast.success(data.message);
    }
    else{
      toast.error(data.message);
    }
  }
  catch(error){
    toast.error(error.response?.data?.message || error.message);
  }

};
  const handleSubmit = async(e) => {
    e.preventDefault();
    //const otp = inputRefs.current.map(input => input.value).join('');
    //console.log('Entered OTP:', otp);
    verifyOtp(email, otp, newPassword);

  }
  const submitOtp = (e) => {
  e.preventDefault();
  const otp = inputRefs.current.map(input => input.value).join('');
  setOtp(otp);
  setIsOtpSubmitted(true);
}
  
  const sendOtpAgain = async () => {
    try{
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(`${backendUrl}/api/auth/sendResetPasswordOtp`, {email});
          if(data.success){
            toast.success(data.message);
            setTimeLeft(120);
            setValidOtp(true);
          }
          else{
            toast.error(data.message);
          }
    }
    catch(error){
        toast.error(error.response?.data?.message || error.message);
    }
  }

  const verifyOtp = async (email, otp, newPassword) => {
    try{
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/resetPassword`, {email, otp, newPassword});
      if(data.success){
        toast.success(data.message);
        setState('Login');
        navigate('/login');
      } else{
        toast.error(data.message);
      }   
    }
    catch(error){
      toast.error(error.response?.data?.message || error.message);
    }
  }


useEffect(() => {

  if (!isEmailSent) return;

  const timer = setInterval(() => {

    setTimeLeft(prev => {

      if (prev <= 1) {
        clearInterval(timer);
        setValidOtp(false);
        toast.error('OTP expired. Please request a new one.');
        return 0;
      }

      return prev - 1;

    });

  }, 1000);

  return () => clearInterval(timer);

}, [isEmailSent]);

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-purple-400'>
      <img onClick={()=>navigate('/')} src={assets.logo} alt="logo" className='logo cursor-pointer' className="w-28 sm:w-32 absolute left-5 sm:left-20 top-5" />
            {
              !isEmailSent &&
              <form className='bg-slate-900 p-8 rounded-lg shadow-g w-96 text-sm'>
              <h1 className='text-white text-2xl font-semibold text-center mb-4' >Reset Password</h1>
              <p className='text-center mb-6 text-indigo-300'>Enter your registered email</p>
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                  <img src={assets.mail_icon} alt="email" className='w-5 h-5' />
                  <input type="email" placeholder='Enter your email' className='bg-transparent outline-none text-white w-full' value={email} onChange={e => setEmail(e.target.value)}/>
                </div>
              <button  onClick={sendOtpClicked} type="submit" className='w-full py-3 bg-radial from-purple-500 to-purple-700 hover:bg-indigo-700 text-white font-bold rounded-full'>Send OTP</button>
            </form>
            }
              
{isEmailSent && !isOtpSubmitted &&

        <form className='bg-slate-900 p-8 rounded-lg shadow-g w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4' >Reset Password   OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email</p>

        <div onPaste={handlePaste} className='flex justify-between mb-8'>

          {
            Array(6).fill(0).map((_,index) => (
              <input key={index} type="text" maxLength="1" className='w-12 h-12 text-center bg-[#333A5C] text-white text-lg rounded  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none' ref={e => inputRefs.current[index] = e} onInput={(e) => handleInput(e,index)} onKeyDown={(e) => handleKeyDown(e,index)} />
            ))
          }
        </div>
        <p className='text-center text-sm mb-4 text-gray-300'>{timeLeft > 0 && validOtp ? `Resend OTP in ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}` : <span className='text-blue-500 cursor-pointer' onClick={sendOtpAgain}>Resend</span>}</p>
        <button onClick={submitOtp} type="submit" className='w-full py-3 bg-radial from-purple-500 to-purple-700 hover:bg-indigo-700 text-white font-bold rounded-full'>Submit</button>
      </form>
}

{isOtpSubmitted && isEmailSent &&
            <form onSubmit={handleSubmit} className='bg-slate-900 p-8 rounded-lg shadow-g w-96 text-sm'>
              <h1 className='text-white text-2xl font-semibold text-center mb-4' >New Password</h1>
              <p className='text-center mb-6 text-indigo-300'>Enter your new password</p>
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                  <img src={assets.lock_icon} alt="password" className='w-5 h-5' />
                  <input type="password" placeholder='Enter your new password' className='bg-transparent outline-none text-white w-full' value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
                </div>
              <button  type="submit" className='w-full py-3 bg-radial from-purple-500 to-purple-700 hover:bg-indigo-700 text-white font-bold rounded-full'>Submit</button>
            </form>      
}
          </div>
  )
}

export default ResetPassword
