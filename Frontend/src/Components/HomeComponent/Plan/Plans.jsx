import React from 'react'
import './Plan.css'
import {plansData} from '../../../data/plansData'
import whiteTick from '../../../Images/whiteTick.png'

const Plans = () => {
  return (
    <div className="Plans-container">
        <div className="Plans-head" style={{gap:'2rem'}}>
            <span className='strock-text'>READY TO START</span>
            <span>YOUR JOURNEY</span>
            <span className='strock-text'>NOW WITHUS</span>
        </div>

        <div className="Plans">
            {plansData.map((plan, i)=>(
                <div className="plan" key={i}>
                    {plan.icon}
                    <span>{plan.name}</span>
                    <span>${plan.price}</span>

                    <div className="features">
                        {plan.features.map((features, i)=>(
                            <div className="feature">
                                <img src={whiteTick} alt="" />
                                <span key={i}>{features}</span>
   
                            </div>
                        ))}

                        <div><span>See more benefits -></span></div>
                    </div>
                    <button className="btn">Join now</button>
                </div> 
            ))}

        </div>
    </div>
  )
}

export default Plans
