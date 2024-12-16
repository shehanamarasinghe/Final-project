import { db } from "../db.js";

export const storeData = (req, res) => {
    const { data } = req.body;
    const sql = 'INSERT INTO scanned_data (result) VALUES (?)';
    db.query(sql, [data], (err, result) => {
      if (err) {
        console.error('Error storing data in database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      console.log('Data stored in database');
      res.status(200).json({ message: 'Data stored successfully' });
    });
};


export const getQrCode = (req, res) => {
  const userId = req.userId;
  const query = 'SELECT qr_code FROM qr_codes WHERE user_id = ?';

  db.query(query, [userId], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ message: 'QR code not found' });
    }
    return res.status(200).json({ qrCode: result[0].qr_code });
  });
};