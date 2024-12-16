import React from "react";
import './Reasons.css'
import image1 from "../../../Images/Image1.jpeg";
import image2 from "../../../Images/Image2.jpeg";
import image3 from "../../../Images/Image3.jpeg";
import image4 from "../../../Images/image4.jpeg"
import nb from "../../../Images/nb.png"
import adidas from "../../../Images/adidas.png"
import nike from "../../../Images/nike.png"
import tick from "../../../Images/tick.png"


const Reasons = () => {
  return (
    <div className="Reasons" id = 'reasons'>
        <div className="left-r">
            <img src={image1} alt="" />
            <img src={image2} alt="" />
            <img src={image3} alt="" />
            <img src={image4} alt="" />
        </div>
        <div className="right-r">
            <span>Some Resons</span>

           <div> 
            <span className="strock-text">Why </span>
            <span>choose us ?</span>
            </div>
            <div className="details-r">
            <div>
                <img src={tick} alt=""></img>
                <span>QR-BASED ATTENDANCE</span>
            </div>
            <div>
                <img src={tick} alt="" />
                <span>TRAIN SMATER AND FASTER</span>
            </div>
            <div>
                <img src={tick} alt="" />
                <span>1 FREE PROGRAM FOR NEW MEMBER</span>
            </div>
            <div>
                <img src={tick} alt="" />
                <span>CONVENIENT TRANSACTIONS</span>
            </div>
            <div>
                <img src={tick} alt="" />
                <span>Personalized Progress Tracking</span>
            </div>
            </div>
          
        </div>

 
    </div>
  )
}

export default Reasons
