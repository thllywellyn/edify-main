import React from 'react'
import '../Home/Landing/Landing.css'
import Logo from '../Images/logo.svg'
import { FaLinkedin, FaTwitter, FaFacebook, FaGithub } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="footer bg-gray-100 dark:bg-[#042439] text-gray-800 dark:text-gray-200">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-logo">
            <img src={Logo} width={60} alt="logo" />
            <h2 className="text-gray-900 dark:text-white">Edify</h2>
          </div>
          <div className="footer-info">
            <p>Copyright © 2024</p>
            <p>Small Change. Big Change.</p>
          </div>
        </div>
        <div className="footer-right">
          <nav className="footer-links">
            <a href="/" className="hover:text-[#4E84C1] transition-colors">Home</a>
            <a href="/about" className="hover:text-[#4E84C1] transition-colors">About</a>
            <a href="/how-it-works" className="hover:text-[#4E84C1] transition-colors">How it works</a>
            <a href="/courses" className="hover:text-[#4E84C1] transition-colors">Courses</a>
            <a href="/contact" className="hover:text-[#4E84C1] transition-colors">Contact Us</a>
            <a href="/adminLogin" className="hover:text-[#4E84C1] transition-colors">Admin Login</a>
          </nav>
          <div className="social-icons">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#4E84C1] transition-colors">
              <FaLinkedin size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#4E84C1] transition-colors">
              <FaTwitter size={20} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#4E84C1] transition-colors">
              <FaFacebook size={20} />
            </a>
            <a href="https://github.com/thllywellyn/edify-main" target="_blank" rel="noopener noreferrer" className="hover:text-[#4E84C1] transition-colors">
              <FaGithub size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer