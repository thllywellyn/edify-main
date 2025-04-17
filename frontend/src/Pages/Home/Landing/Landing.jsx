import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Landing.css";
import Classroom from "../../Images/Classroom.svg";
import Footer from "../../Footer/Footer.jsx";
import Header from "../Header/Header.jsx";
import { CgProfile } from "react-icons/cg";
import { IoSchoolSharp } from "react-icons/io5";
import { FaSchool } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import classRoom1 from "../Landing/classRoom1.jpg";
import classRoom2 from "../Landing/classRoom2.png";
import classRoom3 from "../Landing/classRoom3.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function FacultyCardSkeleton() {
  return (
    <div className="faculty-card loading-skeleton">
      <div className="faculty-header">
        <div className="w-16 h-16 rounded-full loading-skeleton"></div>
        <div className="flex-1">
          <div className="w-3/4 h-6 mb-2 loading-skeleton"></div>
          <div className="w-1/2 h-4 loading-skeleton"></div>
        </div>
      </div>
      <div className="faculty-details">
        <div className="w-full h-4 mb-2 loading-skeleton"></div>
        <div className="w-3/4 h-4 loading-skeleton"></div>
      </div>
    </div>
  );
}

function Landing() {
  const [LClass, setLClass] = useState(false);
  const [EMentor, setEMentor] = useState(false);
  const [supportTab, setSupportTab] = useState(false);
  const [subject, setSubject] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  
  const [facList, setFacList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const contentRef = useRef(null);

  const scrollToContent = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, []);

  const handleSearch = () => {
    navigate(`/Search/${subject}`);
  };

  const handlemsg = async (e) => {
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
  };

  const AA = () => {
    setEMentor(true);
    setLClass(false);
    setSupportTab(false);
    // Only scroll if the content is not already visible
    const rect = contentRef.current?.getBoundingClientRect();
    if (rect && (rect.top < 0 || rect.bottom > window.innerHeight)) {
      scrollToContent();
    }
  };

  const BB = () => {
    setEMentor(false);
    setLClass(true);
    setSupportTab(false);
    // Only scroll if the content is not already visible
    const rect = contentRef.current?.getBoundingClientRect();
    if (rect && (rect.top < 0 || rect.bottom > window.innerHeight)) {
      scrollToContent();
    }
  };

  const CC = () => {
    setEMentor(false);
    setLClass(false);
    setSupportTab(true);
    // Only scroll if the content is not already visible
    const rect = contentRef.current?.getBoundingClientRect();
    if (rect && (rect.top < 0 || rect.bottom > window.innerHeight)) {
      scrollToContent();
    }
  };

  const teachersList = async (sub) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/course/${sub}`, {
        method: 'GET',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const data = await response.json();
      setFacList(data.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const [currentImage, setCurrentImage] = useState(0);
  const images = [classRoom1, classRoom2, classRoom3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show 3 features at once
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const cards = document.querySelectorAll('.eouter');
    
    const handleMouseMove = (e, card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => handleMouseMove(e, card));
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove);
      });
    };
  }, [EMentor]);

  const renderFacultyList = () => {
    if (loading) {
      return (
        <div className="faculty-list-container">
          {[1, 2, 3].map((i) => (
            <FacultyCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (!facList || facList.length === 0) {
      return (
        <div className="text-center p-8 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-gray-600 dark:text-gray-300">No faculty members found for this subject. Try another subject or check back later.</p>
        </div>
      );
    }

    return (
      <div className="faculty-list-container">
        {facList.map(fac => (
          <div key={fac._id} className="faculty-card bg-white dark:bg-gray-800 shadow-md animate-fadeInUp">
            <div className="faculty-header">
              <img 
                src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png" 
                alt={`${fac.enrolledteacher.Firstname}'s profile`}
                className="faculty-avatar"
                loading="lazy"
              />
              <div className="faculty-info">
                <h3 className="faculty-name text-gray-800 dark:text-white">
                  {fac.enrolledteacher.Firstname} {fac.enrolledteacher.Lastname}
                </h3>
                <p className="faculty-email text-gray-600 dark:text-gray-300">{fac.enrolledteacher.Email}</p>
              </div>
            </div>
            <div className="faculty-details text-gray-700 dark:text-gray-300">
              <div className="faculty-detail-item">
                <span className="faculty-detail-label">Education:</span>
                <span>
                  {fac.enrolledteacher.Email === "edify-noreply@lsanalab.xyz"
                    ? "Post graduate from Calcutta University"
                    : "Post graduate from Sister Nivedita University"}
                </span>
              </div>
              <div className="faculty-detail-item">
                <span className="faculty-detail-label">Experience:</span>
                <span>
                  {fac.enrolledteacher.Email === "edify-noreply@lsanalab.xyz"
                    ? "1 year of teaching experience"
                    : "2 years of teaching experience"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Header/>
      <div className="min-h-screen bg-white dark:bg-[#042439] transition-colors duration-300">
        {/* Top Section */}
        <div className="top flex flex-col md:flex-row items-center justify-between p-4 relative">
          <div className="left w-full md:w-1/2 p-4 animate-fadeInUp">
            <h1 className="text-xl md:text-xl lg:text-xl text-gray-800 dark:text-white">
              Empowering Minds, Inspiring Futures: <br />
              Your Gateway to Online Learning with<br></br>
              <span className="font-semibold text-amber-500 font-serif text-3xl md:text-5xl">
                Edify
              </span>
            </h1>
          </div>
          <div className="right w-full md:w-2/2 relative">
            <div className="relative w-full aspect-video max-w-lg mx-auto overflow-hidden rounded-2xl shadow-xl">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  loading={index === 0 ? "eager" : "lazy"}
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                    currentImage === index ? "opacity-100" : "opacity-0"
                  }`}
                  alt={`Classroom view ${index + 1}`}
                />
              ))}
              <div className="carousel-indicators">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`carousel-dot ${currentImage === index ? 'active' : ''}`}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-section bg-gray-50 dark:bg-[#0a3553]">
          <div className="search-container animate-fadeInUp">
            <h2 className="text-gray-900 dark:text-white">Find Your Perfect Teacher</h2>
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search by subject (e.g., Math, Physics...)" 
                value={subject} 
                onChange={(e)=>setSubject(e.target.value)}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button onClick={handleSearch} className="bg-[#4E84C1] hover:bg-[#3a6da3] text-white transition-all duration-300">Search</button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="features bg-white dark:bg-[#042439]">
          <p className="section-title text-gray-900 dark:text-white animate-fadeInUp">Why You Choose Us</p>
          <Slider {...settings}>
            <div className="fet cursor-pointer" onClick={AA}>
              <div className="fet-img">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4697/4697984.png"
                  alt="Expert Mentor Icon"
                  className="mentor-icon"
                />
              </div>
              <h4 className="text-gray-900 dark:text-white">Expert Mentor</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Our expert mentors are the cornerstone of our educational
                approach. With a wealth of knowledge, they support our students on
                their journey to success.
              </p>
            </div>

            <div className="fet cursor-pointer" onClick={BB}>
              <div className="fet-img">
                <img
                  src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/1478ee1b2a35123ded761b65c3ed2ceaece0d20f"
                  alt="Live Class Icon"
                />
              </div>
              <h4 className="text-gray-900 dark:text-white">High Quality Live Class</h4>
              <p className="text-gray-700 dark:text-gray-300">
                We deliver high-quality live classes to our students, providing
                interactive learning experiences led by experienced instructors.
              </p>
            </div>

            <div className="fet cursor-pointer" onClick={CC}>
              <div className="fet-img">
                <img
                  src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/c412120e39b2095486c76978d4cd0bea88fd883b"
                  alt="Support Icon"
                />
              </div>
              <h4 className="text-gray-900 dark:text-white">24/7 Live Support</h4>
              <p className="text-gray-700 dark:text-gray-300">
                We offer our students 24/7 live support. Whether it's a question
                or a challenge at midnight, our dedicated team is here to provide
                guidance and assistance.
              </p>
            </div>
          </Slider>

          <div ref={contentRef} className="content-transition-wrapper">
            {LClass && (
              <div className="live-class">
                <div className="live-class-img">
                  <img 
                    src="https://lh3.googleusercontent.com/kq1PrZ8Kh1Pomlbfq4JM1Gx4z-oVr3HG9TEKzwZfqPLP3TdVYrx0QrIbpR-NmMwgDzhNTgi3FzuzseMpjzkfNrdHK5AzWGZl_RtKB80S-GZmWOQciR9s=w1296-v1-e30" 
                    alt="Live Class Demonstration"
                    className="rounded-lg shadow-xl"
                  />
                </div>
                <div className="live-class-text">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Experience Interactive Learning</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We deliver high-quality live classes to our students,
                    providing interactive learning experiences led by experienced instructors.
                    Join our virtual classrooms and engage in real-time discussions,
                    collaborate with peers, and get instant feedback from your teachers.
                  </p>
                  <div className="mt-6 flex gap-4">
                    <div className="feature-stat">
                      <span className="text-2xl font-bold text-[#4E84C1]">100+</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Live Classes</span>
                    </div>
                    <div className="feature-stat">
                      <span className="text-2xl font-bold text-[#4E84C1]">24/7</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Support</span>
                    </div>
                    <div className="feature-stat">
                      <span className="text-2xl font-bold text-[#4E84C1]">HD</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Quality</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {EMentor && (
              <div className="E-mentor animate-fadeInUp">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">Meet Our Expert Mentors</h3>
                <div className="flex flex-col md:flex-row items-center justify-center mt-7 gap-8 px-4">
                  <div className="eouter transform transition-transform duration-300 hover:scale-105">
                    <div className="e-img">
                      <img 
                        className="rounded-full w-full h-full object-cover" 
                        src="https://media.istockphoto.com/id/1310210662/photo/portrait-of-indian-woman-as-a-teacher-in-sari-standing-isolated-over-white-background-stock.jpg?s=612x612&w=0&k=20&c=EMI42nCFpak1c4JSFvwfN0Qllyxt19dlihYEXAdnCXY=" 
                        alt="Prof. Dina Sharma" 
                      />
                    </div>
                    <div className="einner mt-4">
                      <div className="first flex items-center gap-2 mb-2">
                        <CgProfile className="text-[#4E84C1]"/>
                        <p className="text-gray-900 dark:text-white">Prof. Dina Sharma</p>
                      </div>
                      <div className="second flex items-center gap-2 mb-2">
                        <FaSchool className="text-[#4E84C1]"/>
                        <p className="text-gray-900 dark:text-white">Galaxy University</p>
                      </div>
                      <div className="third flex items-center gap-2">
                        <IoSchoolSharp className="text-[#4E84C1]"/>
                        <p className="text-gray-900 dark:text-white">Ph.D. in Astrophysics</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {supportTab && (
              <div className="support-section">
                <div className="e-img-container">
                  <img 
                    src="https://lh3.googleusercontent.com/kq1PrZ8Kh1Pomlbfq4JM1Gx4z-oVr3HG9TEKzwZfqPLP3TdVYrx0QrIbpR-NmMwgDzhNTgi3FzuzseMpjzkfNrdHK5AzWGZl_RtKB80S-GZmWOQciR9s=w1296-v1-e30" 
                    alt="Support Team"
                    className="rounded-lg shadow-xl"
                  />
                </div>
                <div className="e-text">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Round-the-Clock Support</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    At Edify, we understand that learning doesn't stop at sunset. Our dedicated support team is available 24/7 
                    to assist you with any questions or concerns you may have. Whether you need technical help, academic guidance, 
                    or just want to discuss your learning journey, we're here for you.
                  </p>
                  <div className="mt-6 flex gap-4">
                    <div className="feature-stat">
                      <span className="text-2xl font-bold text-[#4E84C1]">24/7</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Availability</span>
                    </div>
                    <div className="feature-stat">
                      <span className="text-2xl font-bold text-[#4E84C1]">15min</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                    </div>
                    <div className="feature-stat">
                      <span className="text-2xl font-bold text-[#4E84C1]">100%</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Courses */}
        <div className="courses px-4 bg-gray-50 dark:bg-[#0a3553] border-2 py-4">
          <p className="text-2xl md:text-3xl text-center text-gray-800 dark:text-white animate-fadeInUp">Faculty List</p>
          <hr className="underLine"/>
          <div className="subjects grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="subject" onClick={()=>teachersList("physics")}>
              <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/8e9bf690d23d886f63466a814cfbec78187f91d2" alt="Physics" />
              <p className="text-gray-900 dark:text-white">Physics</p>
            </div>
            <div className="subject" onClick={()=>teachersList("chemistry")}>
              <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/3e546b344774eb0235acc6bf6dad7814a59d6e95" alt="Chemistry" />
              <p className="text-gray-900 dark:text-white">Chemistry</p>
            </div>
            <div className="subject" onClick={()=>teachersList("biology")}>
              <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/28ac70002ae0a676d9cfb0f298f3e453d12b5555" alt="Zoology" />
              <p className="text-gray-900 dark:text-white">Biology</p>
            </div>
            <div className="subject" onClick={()=>teachersList("math")}>
              <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/61930117e428a1f0f7268f888a84145f93aa0664" alt="Math" />
              <p className="text-gray-900 dark:text-white">Math</p>
            </div>
            <div className="subject" onClick={()=>teachersList("computer")}>
              <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/a64c93efe984ab29f1dfb9e8d8accd9ba449f272" alt="Computer" />
              <p className="text-gray-900 dark:text-white">Computer</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-8">
            {renderFacultyList()}
          </div>
        </div>

        {/* Contact Us */}
        <div className="contact-us bg-white dark:bg-[#042439] shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h3 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">Get In Touch</h3>
            <div className="content flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="content-img w-full md:w-1/2">
                <img src="https://burst.shopifycdn.com/photos/contact-us-image.jpg?width=1000&format=pjpg&exif=0&iptc=0" 
                     className="w-full max-w-2xl mx-auto rounded-lg shadow-lg" 
                     alt="Contact us" />
              </div>

              <form className="form-submit w-full md:w-1/2 max-w-md space-y-6 p-6 bg-gray-50 dark:bg-[#0a3553] rounded-lg shadow-lg">
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

        {/* Footer */}
        <Footer/>
      </div>
    </>
  );
}

export default Landing;
