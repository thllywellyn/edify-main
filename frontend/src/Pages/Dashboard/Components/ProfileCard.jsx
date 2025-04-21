import React from 'react';

const ProfileCard = ({ user, userType }) => {
  return (
    <div className="bg-white dark:bg-[#0a3553] rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <div className="flex-shrink-0">
          <img 
            src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png"
            alt="Profile"
            className="h-24 w-24 rounded-full border-4 border-[#4E84C1]"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.Firstname} {user.Lastname}
          </h1>
          <p className="text-[#4E84C1] text-lg">{userType}</p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {user.Email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;