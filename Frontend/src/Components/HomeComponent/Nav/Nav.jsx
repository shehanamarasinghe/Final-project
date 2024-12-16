import React from 'react'
import './Nav.css'
import Logo from '../../../Images/Logo.png'
import { Link } from 'react-router-dom';




const Nav = () => {
  
  return (

    <div className="Nav">
        <img src = {Logo} alt ="" className='logo'/>
        <ul className='Head-menu'>
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><Link to="/a" className="nav-link">Events</Link></li>
        <li><Link to="/b" className="nav-link">Gallery</Link></li>
        <li><Link to="/c" className="nav-link">About Us</Link></li>
        <li><Link to="/b" className="nav-link">Contact Us</Link></li>
        </ul>
    </div>
  )
}

export default Nav
