import React, { useContext } from 'react';
import "./Welcome.css";
import welcome from "../../../Images/Welcome.png";
import AuthContext from '../../../Context/authContext';

const Welcome = () => {
  const { user } = useContext(AuthContext); // Access 'user' from context

  return (
    <div className='Welcomepost'>
      <div className="welcomeimg"><img src={welcome} alt="" className='welcomeimage'/></div>
      <div className="welcometext">
        <span className="head">Welcome {user?.username}</span> {/* Corrected to use 'user.username' */}
        <span className="para">Make yourself stronger than your excuses.</span>
      </div>
    </div>
  );
}

export default Welcome;
