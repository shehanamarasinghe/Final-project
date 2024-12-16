import React, { useContext } from 'react'
import Logo from '../../../Images/LogoBlack.png'
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
import DirectionsWalkRoundedIcon from '@mui/icons-material/DirectionsWalkRounded';
import { Link } from 'react-router-dom';
import AuthContext from '../../../Context/authContext';

const Slidebar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="flex-1 border-r border-gray-200 min-h-screen pt-2">
      <div className="h-16 flex items-center justify-center py-4 pt-4">
      <img src={Logo} alt="Logo" className="w-32 h-auto py-8" />

      </div>
      <hr className="border-gray-200" />
      <div className="pl-2">
        <ul className="m-0 p-0 pl-2 pt-4">
          <Link to="/Mdashboard" className="block">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300">
              <DashboardCustomizeRoundedIcon className="text-pink-600 mr-2" />
              <span className="text-black font-normal text-base ml-3">Dashboard</span>
            </li>
          </Link>
          <Link to="/ReminderPage" className="block">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300">
              <CalendarMonthRoundedIcon className="text-pink-600 mr-2" />
              <span className="text-black font-normal text-base ml-3">Time Schedule</span>
            </li>
          </Link>
          <Link to="/Memberassignedplans" className="block">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300">
              <FastfoodRoundedIcon className="text-pink-600 mr-2" />
              <span className="text-black font-normal text-base ml-3">Meal Plan</span>
            </li>
          </Link>
          <Link to="/Memberworkout" className="block">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300">
              <FitnessCenterRoundedIcon className="text-pink-600 mr-2" />
              <span className="text-black font-normal text-base ml-3">Workouts</span>
            </li>
          </Link>
          <Link to="/Mdashboard" className="block">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300">
              <DirectionsWalkRoundedIcon className="text-pink-600 mr-2" />
              <span className="text-black font-normal text-base ml-3">Exercise</span>
            </li>
          </Link>
          <Link to="/Mdashboard" className="block">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300">
              <AddchartRoundedIcon className="text-pink-600 mr-2" />
              <span className="text-black font-normal text-base ml-3">Stats</span>
            </li>
          </Link>
          <Link to="/MemberPayment" className="block">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300">
              <PaidRoundedIcon className="text-pink-600 mr-2" />
              <span className="text-black font-normal text-base ml-3">Payments</span>
            </li>
          </Link>
          <Link to="/MemberNotifications" className="block">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300">
              <NotificationsActiveRoundedIcon className="text-pink-600 mr-2" />
              <span className="text-black font-normal text-base ml-3">Notifications</span>
            </li>
          </Link>
          <Link to="/Mdashboard" className="block">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300">
              <SettingsSuggestRoundedIcon className="text-pink-600 mr-2" />
              <span className="text-black font-normal text-base ml-3">Settings</span>
            </li>
          </Link>
          <Link to="/ProfileEdit" className="block">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300">
              <AccountBoxRoundedIcon className="text-pink-600 mr-2" />
              <span className="text-black font-normal text-base ml-3">Profile</span>
            </li>
          </Link>
          <Link to="/Mdashboard" className="block">
            <li className="flex items-center py-3 cursor-pointer hover:bg-red-300" onClick={logout}>
              <LogoutRoundedIcon className="text-pink-600 mr-2" />
              <span className="text-black font-normal text-base ml-3">Logout</span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  )
}

export default Slidebar;
