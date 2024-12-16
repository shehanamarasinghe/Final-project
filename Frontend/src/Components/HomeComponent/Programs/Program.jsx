import React from 'react'
import './Program.css'
import {programsData} from "../../../data/programsData"
import RightArrow from '../../../Images/rightArrow.png';

const Program = () => {
  return (
    <div className="program" id='Programs'>
        <div className="program-header">

        <span className='strock-text'>Explore our </span>
        <span>Programs</span>
            <span className='strock-text'>Our Programs</span>
        </div>

        <div className="programs-categories">
          {programsData.map((program) =>(
            <div className="category">
              {program.image}
              <span>{program.heading}</span>
              <span>{program.details}</span>
              <div className="join-now"><span>Join Now</span><img src={RightArrow}/>
            </div> </div>
         ))}
        </div>
    </div>
  );
};

export default Program
