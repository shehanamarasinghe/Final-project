import React, { useContext } from 'react';
import Logo from '../../../Images/LogoBlack.png';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import FastfoodRoundedIcon from '@mui/icons-material/FastfoodRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import AddchartRoundedIcon from '@mui/icons-material/AddchartRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import AuthContext from '../../../Context/authContext';
import { Link } from 'react-router-dom';

const Slidebar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="flex-1 border-r border-gray-200 min-h-screen pt-2 pl-3"> 
      <div className="h-16 flex items-center justify-center pt-4 pb-4">
        <img src={Logo} alt="Logo" className="w-32 h-auto" />
      </div>
      <hr className="border-gray-200" />
      <div className="pl-2">
        <ul className="m-0 p-0 pt-4">
          <Link to="/ADashboard" className="no-underline">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300 pl-2"> 
              <DashboardCustomizeRoundedIcon className="text-pink-500 mr-2 text-lg" />
              <span className="text-black text-base font-normal ml-4">Dashboard</span>
            </li>
          </Link>
          <Link to="/Adminreminder" className="no-underline">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300 pl-2"> 
              <CalendarMonthRoundedIcon className="text-pink-500 mr-2 text-lg" />
              <span className="text-black text-base font-normal ml-4">Time Schedule</span>
            </li>
          </Link>
          <Link to="/AMealPlan" className="no-underline">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300 pl-2"> 
              <FastfoodRoundedIcon className="text-pink-500 mr-2 text-lg" />
              <span className="text-black text-base font-normal ml-4">Meal Plan</span>
            </li>
          </Link>
          <Link to="/ExerciseManagement" className="no-underline">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300 pl-2"> 
              <FitnessCenterRoundedIcon className="text-pink-500 mr-2 text-lg" />
              <span className="text-black text-base font-normal ml-4">Workouts</span>
            </li>
          </Link>
          <Link to="/AFeedback" className="no-underline">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300 pl-2"> 
              <AddchartRoundedIcon className="text-pink-500 mr-2 text-lg" />
              <span className="text-black text-base font-normal ml-4">Stats</span>
            </li>
          </Link>
          <Link to="/AdminPaymentDashboard" className="no-underline">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300 pl-2"> 
              <PaidRoundedIcon className="text-pink-500 mr-2 text-lg" />
              <span className="text-black text-base font-normal ml-4">Payments</span>
            </li>
          </Link>
          <Link to="/Users" className="no-underline">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300 pl-2"> 
              <GroupRoundedIcon className="text-pink-500 mr-2 text-lg" />
              <span className="text-black text-base font-normal ml-4">Users</span>
            </li>
          </Link>
          <Link to="/Notification" className="no-underline">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300 pl-2"> 
              <NotificationsActiveRoundedIcon className="text-pink-500 mr-2 text-lg" />
              <span className="text-black text-base font-normal ml-4">Notifications</span>
            </li>
          </Link>
          <Link to="/ADashboard" className="no-underline">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300 pl-2"> 
              <SettingsSuggestRoundedIcon className="text-pink-500 mr-2 text-lg" />
              <span className="text-black text-base font-normal ml-4">Settings</span>
            </li>
          </Link>
          <Link to="/ADashboard" className="no-underline">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300 pl-2"> 
              <AccountBoxRoundedIcon className="text-pink-500 mr-2 text-lg" />
              <span className="text-black text-base font-normal ml-4">Profile</span>
            </li>
          </Link>
          <Link to="/ADashboard" className="no-underline">
            <li onClick={logout} className="flex items-center py-3 cursor-pointer hover:bg-red-300 pl-2"> 
              <LogoutRoundedIcon className="text-pink-500 mr-2 text-lg" />
              <span className="text-black text-base font-normal ml-4">Logout</span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Slidebar;
