import React, { useState } from 'react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import NightsStayRoundedIcon from '@mui/icons-material/NightsStayRounded';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import Profile from "../../../Images/Profile.png";
import QRCodeScanner from '../../Qrcomponents/QrcodeScanner';  // Import your scanner component
import AdminMealPlanRequestsModal from '../../AdminNotifications/AdminMealPlanRequestsModal.jsx';
import axios from 'axios';
import { useEffect } from 'react';


const Navbar = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await axios.get(
          "pending-notifications/notification/count"
        );
        setNotificationCount(response.data.count || 0); // Default to 0 if undefined
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };
  
    fetchNotificationCount();
  }, []);
  
  
  const toggleQRScanner = () => {
    setShowQRScanner(!showQRScanner);

    
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };


  return (
    <div className="h-19 border-b-[0.5px] border-gray-300 flex items-center text-sm text-gray-600">
      <div className="w-full px-5 flex items-center justify-between pt-6 pb-4">
        <div className="flex items-center border-[0.5px] border-gray-300 p-1 rounded-full">
          <input
            type="text"
            placeholder="Search...."
            className="outline-none bg-transparent text-sm"
          />
          <SearchRoundedIcon />
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-6 relative text-black">
            <LanguageRoundedIcon className="text-xl" /> English
          </div>
          <div className="flex items-center mr-6 text-black">
            <NightsStayRoundedIcon className="text-xl" />
          </div>
          <div className="flex items-center mr-6 text-black" onClick={toggleQRScanner}>
            <QrCodeScannerRoundedIcon className="text-xl" />
          </div>
          <div className="flex items-center mr-6 relative text-black" onClick={toggleModal}>
            <NotificationsActiveRoundedIcon className="text-xl cursor-pointer" />
            {notificationCount > 0 && (
              <div className="w-4 h-4 bg-red-600 rounded-full text-white flex items-center justify-center text-[10px] font-bold absolute top-[-5px] right-[-5px]">
                {notificationCount}
              </div>
            )}
          </div>
          <div className="flex items-center mr-6 relative text-black">
            <ChatBubbleOutlineRoundedIcon className="text-xl" />
            <div className="w-4 h-4 bg-red-600 rounded-full text-white flex items-center justify-center text-[10px] font-bold absolute top-[-5px] right-[-5px]">2</div>
          </div>
          <div className="flex items-center mr-4">
            <img src={Profile} alt="" className="w-8 h-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* QR Code Scanner Popup */}
      {showQRScanner && <QRCodeScanner />}
      <AdminMealPlanRequestsModal isOpen={isModalOpen} onClose={toggleModal} />
      
    </div>
  );
};

export default Navbar;
