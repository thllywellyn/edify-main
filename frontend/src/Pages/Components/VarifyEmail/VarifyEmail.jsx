import React from 'react'
import Email from '../../Images/email.svg'
import { useNavigate } from "react-router-dom"
import Header from '../../Home/Header/Header'
import { useAuth } from '../../../context/AuthContext'

function VarifyEmail() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleBackToLogin = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
    <Header/>
    <div className='flex justify-center'>
        <div className='bg-blue-gray-900 w-96 h-96  rounded-md flex flex-col gap-5 justify-center items-center mt-10'>
            <img src={Email} width={150} alt="email" />
            <p className='text-white text-3xl'>Send Email</p>
            <p className='text-gray-300 mx-7 text-sm'>We have sent a verification link to your Email. Click on the link to complete the verification process. You might need to check your spam folder.</p>
            <button 
              onClick={handleBackToLogin}
              className='text-blue-700 hover:text-blue-500 transition-colors cursor-pointer flex items-center'
            >
              ◀ Back to Login
            </button>
        </div>
    </div>
    </>
  )
}

export default VarifyEmail