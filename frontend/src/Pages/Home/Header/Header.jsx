import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import './Header.css';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../Images/logo.svg';
import { useState, useRef, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

function Header() {
  const auth = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navRef.current && 
        !navRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (auth && auth.logout) {
      auth.logout();
      navigate('/');
    }
  };

  const handleDashboard = () => {
    try {
      console.log('Current auth user:', auth.user); // Debug log

      if (!auth.user || !auth.user._id) {
        console.error('Invalid user data');
        return;
      }

      const userId = auth.user._id;
      // Use type from auth context instead of role
      if (auth.user.type === 'teacher') {
        navigate(`/dashboard/teacher/${userId}/home`);
      } else if (auth.user.type === 'student') {
        navigate(`/dashboard/student/${userId}/search`);
      } else {
        console.error('Unknown user type:', auth.user.type);
      }
    } catch (error) {
      console.error('Dashboard navigation error:', error);
    }
  };

  return (
    <>
      <header className="flex items-center justify-between bg-[#6576ba] dark:bg-[#042439] w-full fixed z-10 px-4 py-2">
        <NavLink to='/'>
          <div className="logo">
            <img src={Logo} alt="logo" />
            <h1 className='text-2xl text-[#07080a] dark:text-white font-bold'>Edify</h1>
          </div>
        </NavLink>

        <button ref={buttonRef} className="burger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="dark:bg-white"></span>
          <span className="dark:bg-white"></span>
          <span className="dark:bg-white"></span>
        </button>

        <div ref={navRef} className={`nav-container ${isMenuOpen ? 'active' : ''}`}>
          <div className="link-nav">
            <ul>
              <li><NavLink to='/' className={({isActive}) => isActive ? "active text-lg md:text-base" : "deactive text-lg md:text-base"} onClick={() => setIsMenuOpen(false)}> Home </NavLink></li>
              <li><NavLink to='/courses' className={({isActive}) => isActive ? "active text-lg md:text-base" : "deactive text-lg md:text-base"} onClick={() => setIsMenuOpen(false)}> Courses </NavLink></li>
              <li><NavLink to='/about' className={({isActive}) => isActive ? "active text-lg md:text-base" : "deactive text-lg md:text-base"} onClick={() => setIsMenuOpen(false)}> About </NavLink></li>
              <li><NavLink to='/contact' className={({isActive}) => isActive ? "active text-lg md:text-base" : "deactive text-lg md:text-base"} onClick={() => setIsMenuOpen(false)}> Contact us </NavLink></li>
            </ul>
          </div>
          <div className='auth-buttons flex items-center gap-2'>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FaSun className="text-white text-xl" /> : <FaMoon className="text-gray-800 text-xl" />}
            </button>
            {auth?.user ? (
              <>
                <span className="text-[#07080a] dark:text-white user-name mr-4 font-[600]">Welcome, {auth.user.Firstname}</span>
                <button onClick={() => { handleDashboard(); setIsMenuOpen(false); }} className="nav-button text-sm px-3 font-[540]">Dashboard</button>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="nav-button text-sm px-3 font-[540]">Logout</button>
              </>
            ) : (
              <>
                <NavLink to='/login' onClick={() => setIsMenuOpen(false)}><button className="nav-button text-sm px-3">Login</button></NavLink>
                <NavLink to='/signup' onClick={() => setIsMenuOpen(false)}><button className="nav-button text-sm px-3">Signup</button></NavLink>
              </>
            )}
          </div>
        </div>
      </header>
      <div className="gapError"></div>
    </>
  );
}

export default Header;