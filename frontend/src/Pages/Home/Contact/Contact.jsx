import React, { useState } from 'react'
import "../Landing/Landing.css";
import Header from '../Header/Header';

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handlemsg = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/messages`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name, 
          email, 
          message: msg
        })
      });

      const data = await response.json();
      if(data.statusCode === 200){
        setName("");
        setEmail("");
        setMsg("");
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-[#042439] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="contact-form bg-white dark:bg-[#0a3553] rounded-xl shadow-xl p-8">
            <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Contact Us</h3>
            
            <div className="content flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="content-img w-full md:w-1/2">
                <img src="https://burst.shopifycdn.com/photos/contact-us-image.jpg?width=1000&format=pjpg&exif=0&iptc=0" 
                     className="w-full max-w-2xl mx-auto rounded-lg shadow-lg" 
                     alt="Contact us" />
              </div>

              <form className="form-submit w-full md:w-1/2 max-w-md space-y-6 p-6 bg-gray-50 dark:bg-[#042439] rounded-lg shadow-lg">
                <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Send Message</h4>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Email Address"
                  className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                />
                <textarea
                  placeholder="Message"
                  className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white min-h-[150px]"
                  value={msg}
                  onChange={(e)=>setMsg(e.target.value)}
                />
                <button 
                  onClick={handlemsg}
                  className="w-full bg-[#233d6c] hover:bg-[#1a2d4f] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Send A Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact