//Frontend -> src -> pages -> Mdashboard.jsx

import React from 'react'
import Slidebar from "../../Components/MDashboardComponents/SlideBar/Slidebar"
import "./MDashboard.css"
import Navbar from '../../Components/MDashboardComponents/Navbar/Navbar'
import Widget from '../../Components/MDashboardComponents/Widget/Widget'
import Welcome from '../../Components/MDashboardComponents/Welcome/Welcome'
import Charts from '../../Components/MDashboardComponents/Charts/Charts'
import Reminder from '../../Components/MDashboardComponents/Reminder/Reminder'


const MDashboard = () => {


  return (
    <div className='Mdashboard'>
    <Slidebar/>
    <div className="Dash-Container">
    <Navbar/>
    <div className='Welcome'>
      <Welcome/>
    </div>
    <div className="widgets">
      <Widget type = "user"/>
      <Widget type = "bloodpressure"/>
      <Widget type = "Heart"/>
      <Widget type = "Steps"/>

    </div>
    <div className="chartM">
      <Charts/>
      <Reminder/>

    </div>
    </div>
    
    </div>
  )
}

export default MDashboard
