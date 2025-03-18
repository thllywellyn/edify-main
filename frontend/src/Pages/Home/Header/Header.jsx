// import { useAuth } from '../../../context/AuthContext';
// import './Header.css';
// import { NavLink, useNavigate } from 'react-router-dom';
// import Logo from '../../Images/logo.svg';

// function Header() {
//   const auth = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     if (auth && auth.logout) {
//       auth.logout();
//       navigate('/');
//     }
//   };

//   const handleDashboard = () => {
//     if (auth?.user) {
//       const userId = auth.user._id;
//       if (auth.user.Teacherdetails) {
//         navigate(`/Teacher/Dashboard/${userId}/Home`);
//       } else if (auth.user.Studentdetails) {
//         navigate(`/Student/Dashboard/${userId}/Search`);
//       }
//     }
//   };

//   return (
//     <>
//     <header className="flex items-center justify-evenly bg-[#042439] w-full fixed z-10 gap-[20rem]">
//       <NavLink to='/'>
//         <div className="logo">
//           <img src={Logo} alt="logo" />
//           <h1 className='text-2xl text-[#4E84C1] font-bold'>Edify</h1>
//         </div>
//       </NavLink>
//       <div className="link-nav">
//         <ul>
//           <li><NavLink to='/' className={({isActive}) => isActive ? "active" : "deactive" }> Home </NavLink></li>
//           <li><NavLink to='/courses' className={({isActive}) => isActive ? "active" : "deactive"}> Courses </NavLink></li>
//           <li><NavLink to='/about' className={({isActive}) => isActive ? "active" : "deactive"}> About </NavLink></li>
//           <li><NavLink to='/contact' className={({isActive}) => isActive ? "active" : "deactive"}> Contact us </NavLink></li>
//         </ul>
//       </div>
//       <div className='flex gap-6 items-center'>
//         {auth?.user ? (
//           <>
//             <span className="text-white">Welcome, {auth.user.FirstName}</span>
//             <button onClick={handleDashboard} className="deactive">Dashboard</button>
//             <button onClick={handleLogout} className="deactive">Logout</button>
//           </>
//         ) : (
//           <>
//             <NavLink to='/login' className={({isActive}) => isActive ? "deactive" : "deactive"}><button>Login</button></NavLink>
//             <NavLink to='/signup' className={({isActive}) => isActive ? "deactive" : "deactive"}><button>Signup</button></NavLink>
//           </>
//         )}
//       </div>
//     </header>
//     <div className="gapError"></div>
//     </>
//   );
// }

// export default Header;

import { useAuth } from '../../../context/AuthContext';
import './Header.css';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../Images/logo.svg';

function Header() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (auth && auth.logout) {
      auth.logout();
      navigate('/');
    }
  };

  const handleDashboard = () => {
    if (auth?.user) {
      const userId = auth.user._id;
      if (auth.user.Teacherdetails) {
        navigate(`/Teacher/Dashboard/${userId}/Home`);
      } else if (auth.user.Studentdetails) {
        navigate(`/Student/Dashboard/${userId}/Search`);
      }
    }
  };

  return (
    <>
      <header className="flex items-center justify-evenly bg-[#042439] w-full fixed z-10 gap-[20rem]">
        <NavLink to='/'>
          <div className="logo">
            <img src={Logo} alt="logo" />
            <h1 className='text-2xl text-[#4E84C1] font-bold'>Edify</h1>
          </div>
        </NavLink>
        <div className="link-nav">
          <ul>
            <li><NavLink to='/' className={({ isActive }) => isActive ? "active" : "deactive"}> Home </NavLink></li>
            <li><NavLink to='/courses' className={({ isActive }) => isActive ? "active" : "deactive"}> Courses </NavLink></li>
            <li><NavLink to='/about' className={({ isActive }) => isActive ? "active" : "deactive"}> About </NavLink></li>
            <li><NavLink to='/contact' className={({ isActive }) => isActive ? "active" : "deactive"}> Contact us </NavLink></li>
          </ul>
        </div>
        <div className='flex gap-6 items-center'>
          {auth?.user ? (
            <>
              <span className="text-white">Welcome, {auth.user.Firstname}</span>
              <button onClick={handleDashboard} className="deactive">Dashboard</button>
              <button onClick={handleLogout} className="deactive">Logout</button>
            </>
          ) : (
            <>
              <NavLink to='/login' className={({ isActive }) => isActive ? "deactive" : "deactive"}><button>Login</button></NavLink>
              <NavLink to='/signup' className={({ isActive }) => isActive ? "deactive" : "deactive"}><button>Signup</button></NavLink>
            </>
          )}
        </div>
      </header>
      <div className="gapError"></div>
    </>
  );
}

export default Header;