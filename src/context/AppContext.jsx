import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {

  axios.defaults.withCredentials = true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [state, setState] = useState('Sign Up');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  
  const getAuthState = async () => {
    try{
        const { data } = await axios.get(`${backendUrl}/api/auth/isAuthenticated`);
        if(data.success){
            setIsLoggedIn(true);
        }
        else{
            setIsLoggedIn(false);
        }
    } 
    catch(err){
        toast.error(data.message);
    }
  }

const getUserData = async () => {
  try {

    const { data } = await axios.get(
      `${backendUrl}/api/user/getUserData`,
      { withCredentials: true }
    );

    if (data.success) {
      setUserInfo(data.userData);
      console.log("User data:", data.userData);
    } 
    else {
      setUserInfo(null);
      toast.error(data.message);
    }

  } 
  catch (err) {
    setUserInfo(null);
    toast.error(err.response?.data?.message || err.message);
  }
};


useEffect(() => {

  const initializeAuth = async () => {
    try {

      const { data } = await axios.get(
        `${backendUrl}/api/auth/isAuthenticated`,
        { withCredentials: true }
      );

      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
      } 
      else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }

    } 
    catch (err) {
      setIsLoggedIn(false);
      setUserInfo(null);
      console.log(err);
    }
  };

  initializeAuth();

}, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userInfo,
    setUserInfo,
    getUserData,
    getAuthState,
      state,
      setState
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
