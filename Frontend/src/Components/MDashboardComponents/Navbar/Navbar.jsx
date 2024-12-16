import React, { useState } from 'react';
import QRCodeModal from '../../Qrcomponents/QRCodeModal';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import NightsStayRoundedIcon from '@mui/icons-material/NightsStayRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import Profile from '../../../Images/Profile.png';
import './Navbar.css';

const Navbar = () => {
  const [showQRModal, setShowQRModal] = useState(false);

  const handleQRCodeClick = () => {
    setShowQRModal(true);
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchRoundedIcon />
        </div>
        <div className="items">
          <div className="item">
            <LanguageRoundedIcon className="icon" />
            English
          </div>
          <div className="item">
            <NightsStayRoundedIcon className="icon" />
          </div>
          <div className="item" onClick={handleQRCodeClick}>
            <QrCode2RoundedIcon className="icon" />
          </div>
          <div className="item">
            <NotificationsActiveRoundedIcon className="icon" />
            <div className="counter">1</div>
          </div>
          <div className="item">
            <ChatBubbleOutlineRoundedIcon className="icon" />
            <div className="counter">2</div>
          </div>
          <div className="item">
            <img src={Profile} alt="Profile" className="avatar" />
          </div>
        </div>
      </div>

      {showQRModal && <QRCodeModal onClose={() => setShowQRModal(false)} />}
    </div>
  );
};

export default Navbar;
