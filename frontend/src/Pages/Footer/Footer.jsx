import React from 'react'
import '../Home/Landing/Landing.css'

function Footer() {
  return (
    <div className="footer">
        <div className="leftPart">
          <div className="title">
            <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/53619c42501fb7619406ed947b38c5fa4f07597c" width={60} alt="" />
            <h2>Edify</h2>
          </div>
          <p>Copyright  © 2024</p>
          <p>Small Change. Big Change.</p>
        </div>
        <div className="rightPart">
          <div className="links">
            <div className="link">
              <hr />
              <p>Home</p>
            </div>
            <div className="link">
              <hr />
              <p>About</p>
            </div>
            <div className="link">
              <hr />
              <p>How it works</p>
            </div>
            <div className="link">
              <hr />
              <p>Courses</p>
            </div>
            <div className="link">
              <hr />
              <p>Contact Us</p>
            </div>
            <div className="link">
              <hr />
            <a href='/adminLogin/'><p>Admin Login</p></a>
            </div>
          </div>
          <hr className="hr"/>
          <div className="icons">
          <a href='./'><img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/698567c8ecd3b39bb1b6ac6c68e44bb80ac15d62" width={50} alt="linked in" /></a>

          <a href='./'><img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/04e756fd5877045a0932d92fb8410e1b6b560854" width={50} alt="Twiter" /></a>
          
          <a href='./'><img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/ecc888c1307cf0749389002f82f9871d6988c809" width={50} alt="Facebook" /></a>

          <a href='./'><img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/c3fb00857c69eb46b393dba8d759e426171ef02f" width={50} alt="Github" /></a>

          </div>
        </div>
      </div>
  )
}

export default Footer