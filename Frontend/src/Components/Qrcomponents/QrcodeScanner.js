import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';
import AuthContext from '../../Context/authContext';

const QRCodeScanner = () => {
  const [scanned, setScanned] = useState(false);  // Prevent multiple requests
  const { token } = useContext(AuthContext);

  // Function to handle scanning the QR code
  const handleScan = async (result) => {
    if (result && !scanned) {
      setScanned(true);  // Disable scanning after the first scan

      try {
        const parsedData = JSON.parse(result?.text);
        const userId = parsedData.userId;

        // Send the attendance data to the backend
        await axios.post('/attendance/mark', { userId }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Wait for 5 seconds before allowing another scan
        setTimeout(() => {
          setScanned(false);  // Re-enable scanning after 5 seconds
        }, 5000);

        window.location.reload();  // Optionally reload the page on successful scan
      } catch (error) {
        console.error('Error processing QR scan:', error);
        setScanned(false);  // Re-enable scanning in case of an error
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => window.location.reload()}  // Close the scanner by reloading
        >
          ✕
        </button>
        {/* Disable the scanner if the scanned state is true */}
        {!scanned && (
          <QrReader
            delay={300}
            onResult={handleScan}
            style={{ width: '300px' }}
          />
        )}
        <p className="mt-4 text-center">Scan your QR code</p>
      </div>
    </div>
  );
};

export default QRCodeScanner;
