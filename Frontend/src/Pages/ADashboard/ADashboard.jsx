//Frontend -> src -> pages -> Adashboard.jsx

import React, { useState } from 'react';
import "./ADashboard.css";
import Slidebar from "../../Components/ADashboardComponents/SlideBar/Slidebar";
import Navbar from '../../Components/ADashboardComponents/Navbar/Navbar';
import Widget from '../../Components/ADashboardComponents/Widget/Widget';
import Welcome from '../../Components/ADashboardComponents/Welcome/Welcome';
import Charts from '../../Components/ADashboardComponents/Charts/Charts';
import Chart2 from '../../Components/ADashboardComponents/Chart2/Chart2';


const MDashboard = () => {

  return (
    <div className='Adashboard'>
      <Slidebar />
      <div className="ADash-Container">
        <Navbar />
        <div className='AWelcome'>
          <Welcome />
        </div>
        <div className="Awidgets">
          <Widget type="user" />
          <Widget type="bloodpressure" />
          <Widget type="Heart" />
          <Widget type="Steps" />
        </div>
        <div className="AchartM">
          <Chart2 />
          <Charts />
        </div>
      </div>
      
    </div>
  );
}

export default MDashboard;
