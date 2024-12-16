import React from 'react'
import './Footer.css'
import ln from '../../../Images/linkedin.png'
import In from '../../../Images/instagram.png'
import Git from '../../../Images/github.png'

const Footer = () => {
  return (
    <div className="footer">
        <div className="sb_footer section_Padding">
            <div className="footer-links">
            <div className="footer-links-div">
                    <h2>Usen Fittness Center</h2>
                    <a href='/employee'>
                        <p>Explore the transformations and success stories of our members who have achieved their fitness goals with USEN Fitness Center</p>
                        </a>
                        </div>
                <div className="footer-links-div">
                    <h4>Quick Links</h4>
                    <a href='/employee'>
                        <p>Home</p>
                        </a>
                    <a href='/employee'>
                        <p>Health Plan</p>
                        </a>
                    <a href='/employee'>
                        <p>Gallery</p>
                        </a>
                    </div>
                    <div className="footer-links-div">
                    <h4>Support</h4>
                    <a href='/employee'>
                        <p>Contact us</p>
                        </a>
                    <a href='/employee'>
                        <p>Terms & Conditions</p>
                        </a>
                    <a href='/employee'>
                        <p>Privency Policy</p>
                        </a>
                    </div>
                    <div className="footer-links-div">
                    <h4>Social Links</h4>
                    <div className="socialmedia">
                        <p><img src={ln} alt = ""/></p>
                        <p><img src={In} alt = ""/></p>
                        <p><img src={Git} alt = ""/></p>
                    </div>
                    
                    </div>
                </div>
           
            <hr></hr>
            <div className="footer-below">
                <div className="copyright">
                    <p>
                        @{new Date().getFullYear()} Usen Fitness Center. All right reserved.
                    </p>
                </div>

            <div className="footr-below-link">
                <a href='/terms'><div><p>Terms & conditions</p></div></a>
                <a href='/terms'><div><p>Privancy</p></div></a>
                <a href='/terms'><div><p>Security</p></div></a>
            </div>
        </div>
    </div>
    </div>
  ) 
}

export default Footer
