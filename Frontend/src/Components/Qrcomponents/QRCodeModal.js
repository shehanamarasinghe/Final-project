import React, { useContext, useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import AuthContext from '../../Context/authContext';

const QRCodeModal = ({ onClose }) => {
  const [userIdQr, setUserIdQr] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const qrData = JSON.stringify({ userId: parsedUser.id }); 
      setUserIdQr(qrData); 
    }
  }, []);

  const downloadQRCode = () => {
    const canvas = document.getElementById('qrCodeCanvas');
    const canvasContext = canvas.getContext('2d');

    const qrSize = canvas.width; 
    const borderSize = 20; 

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = qrSize + borderSize * 2;
    tempCanvas.height = qrSize + borderSize * 2;
    const tempContext = tempCanvas.getContext('2d');

    tempContext.fillStyle = '#ffffff';
    tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);


    tempContext.drawImage(canvas, borderSize, borderSize, qrSize, qrSize);

    const pngUrl = tempCanvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = 'QRCode.png';
    link.click();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4 text-black">Your QR Code</h2>
        {userIdQr ? (
          <div className="flex items-center justify-center"> {/* Centering the QR code */}
            <QRCodeCanvas
              id="qrCodeCanvas"
              value={userIdQr} // Use the JSON string with userId
              size={256}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"Q"}
              includeMargin={false}
            />
          </div>
        ) : (
          <p className="text-black">Loading QR Code...</p>
        )}
        <button
          onClick={downloadQRCode}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg w-full"
        >
          Download QR Code
        </button>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;
