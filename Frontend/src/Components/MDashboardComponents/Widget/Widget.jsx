import React, { useState, useEffect, useContext } from 'react';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import HealthAndSafetyRoundedIcon from '@mui/icons-material/HealthAndSafetyRounded';
import MedicalInformationRoundedIcon from '@mui/icons-material/MedicalInformationRounded';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import DirectionsWalkRoundedIcon from '@mui/icons-material/DirectionsWalkRounded';
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import AuthContext from '../../../Context/authContext';
import axios from 'axios';
import './Widget.css';

const Widget = ({ type }) => {
  const { token } = useContext(AuthContext);
  const [userCount, setUserCount] = useState(0);
  const [weeklyCount, setWeeklyCount] = useState(0);

  const fetchUserCount = async () => {
    try {
      const response = await axios.get('/attendance/count', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserCount(response.data.count);
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  };

  const fetchWeeklyAttendanceCount = async () => {
    try {
      const response = await axios.get('/attendance/weekly-count', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeeklyCount(response.data.count);
    } catch (error) {
      console.error('Error fetching weekly attendance count:', error);
    }
  };

  useEffect(() => {
    if (type === 'user') {
      fetchUserCount();
    } else if (type === 'bloodpressure') {
      fetchWeeklyAttendanceCount();
    }
  }, [token, type]);

  let data;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        link: "See all users",
        status: "Open",
        icon1: <FiberManualRecordRoundedIcon />,
        icon2: <PeopleAltRoundedIcon className='icon-w' />,
        count: userCount
      };
      break;
    case "bloodpressure":
      data = {
        title: "WEEKLY USERS",
        link: "See all Records",
        status: "Good",
        icon1: <HealthAndSafetyRoundedIcon />,
        icon2: <MedicalInformationRoundedIcon className='icon-w' />,
        count: weeklyCount
      };
      break;
    case "Heart":
      data = {
        title: "HEART RATE",
        link: "See all Records",
        status: "Good",
        icon1: <HealthAndSafetyRoundedIcon />,
        icon2: <MonitorHeartRoundedIcon className='icon-w' />,
      };
      break;
    case "Steps":
      data = {
        title: "STEPS",
        link: "See all Records",
        status: "Good",
        icon1: <HealthAndSafetyRoundedIcon />,
        icon2: <DirectionsWalkRoundedIcon className='icon-w' />,
      };
      break;
    default:
      data = {
        title: "Unknown",
        link: "See all Records",
        icon1: <HealthAndSafetyRoundedIcon />,
        icon2: <QuestionMarkRoundedIcon className='icon-w' />,
      };
  }

  return (
    <div className='widget'>
      <div className="left-widget">
        <span className="title">{data.title}</span>
        <span className="Count">
          {type === 'user' ? data.count : type === 'bloodpressure' ? data.count : '4567'}
        </span>
        <span className="link-w">{data.link}</span>
      </div>
      <div className="right-widget">
        <div className="warning open">
          {data.icon1} {data.status}
        </div>
        {data.icon2}
      </div>
    </div>
  );
};

export default Widget;
