import React from 'react'
import Plant from "../../Images/Plant.svg";
import Plant2 from "../../Images/Plant2.svg";
import '../Landing/Landing.css'
import Footer from "../../Footer/Footer.jsx"
import Header from '../Header/Header.jsx';

function About({backgroundC}) {
  return (
    <>
    <Header/>
    <div className="about min-h-screen w-full py-8 md:py-16 bg-white dark:bg-[#042439]">
        <h3 className="text-3xl font-bold text-center mb-8 md:mb-16 text-[#042439] dark:text-white">About Us</h3>
        <div className="px-4 md:px-8 lg:px-16 w-full">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 w-full">
            <div className="text-content w-full md:w-3/5 lg:w-2/3 text-gray-800 dark:text-gray-200 space-y-6">
              <div className="mb-4">
                At Edify, we believe in the power of education to transform lives. Our platform is designed to be a gateway to knowledge, offering a diverse range of courses and learning experiences for students.
              </div>
              <div className="space-y-4">
                <h2 className="bg-blue-700 text-white w-fit py-2 px-4 rounded-md text-xl font-semibold">Our Story</h2>
                <div className="text-gray-700 dark:text-gray-300">
                  Edify was born out of a passion for learning and a desire to make quality education accessible to everyone. We understand the challenges faced by modern learners and strive to provide a solution that is both convenient and effective.
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="bg-blue-700 text-white w-fit py-2 px-4 rounded-md text-xl font-semibold">Our Mission</h2>
                <div className="text-gray-700 dark:text-gray-300">
                  Our mission is simple yet profound: to empower individuals through education. We aim to create a global learning community where students can discover new passions, enhance their skills, and achieve their academic and professional goals. By leveraging technology and innovative teaching methods, we strive to make learning engaging, interactive, and enjoyable.
                </div>
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col gap-8 w-full md:w-2/5 lg:w-1/3 items-center justify-center">
              <div className="w-1/2 md:w-full h-[200px] md:h-[250px] lg:h-[300px] flex items-center justify-center overflow-hidden">
                <img 
                  src={Plant2} 
                  className="w-auto h-full object-contain transform scale:100 hover:scale-120 transition-all duration-300 ease-in-out" 
                  alt="Decorative plant" 
                />
              </div>
            </div>
          </div>
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default About