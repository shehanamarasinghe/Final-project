import React from 'react'
import './Head.css'
import Nav from '../Nav/Nav'
import Headerimage from "../../../Images/choose-img.png"
import Heart from "../../../Images/heart.png"
import { Link } from 'react-router-dom';

const Head = () => {
  return (
   <div className="Head">
    <div className="left-head">
      <Nav/>


      <div className="Head-text">
        <div>
          <span className='strock-text'>Forge </span>
          <span>Your</span>
        </div>
        <div><span>Fitness Journey</span></div>
        <div>
          <span>
          Forge your fitness journey with us, sculpting strength and confidence. Unleash the best version of yourself at our gym.
          </span>
        </div>

      </div>

      <div className="best-ad">
       <div></div>
          <span>The Best fitness center in the town</span>
        
      </div>

      <div className="head-button">
      <Link to="/Login" className='link-G'><button className="btn">Get Started</button></Link>
        <button className="btn">Learn More</button>
      </div>



    </div>
    <div className="right-head">
      <div className="signbtn">
      <Link to="/Login" className='links'><button className="btn">Sign in</button></Link>
      <Link to="/Register" className='links'> <button className="btn">Sign up</button></Link>
      </div>
    <div className="heart-rate">

      <img src={Heart} alt="" />
      <span>Heart Rate</span>
      <span>120 bpm</span>

    </div>

    <img src={Headerimage} alt="" className='headerimage'/>

    </div>
    

  </div>
  )
}

export default Head
