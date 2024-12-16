import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import { db } from '../db.js';

export const addMember = async (req, res) => {
  const { firstname, lastname, username, address, email, phoneNo, gender, age, weight, height, password } = req.body;

  if (!firstname || !lastname || !username || !address || !email || !phoneNo || !gender || !age || !weight || !height || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the username already exists
    const checkUserQuery = 'SELECT * FROM login WHERE UserName = ?';
    db.query(checkUserQuery, [username], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error checking username', error: err });
      }

      if (results.length > 0) {
        // Username already exists
        return res.status(409).json({ message: 'Username already taken' });
      }

      // Proceed to register user if username does not exist
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertUserQuery = 'INSERT INTO login (Firstname, Lastname, UserName, Address, Email, PhoneNo, Gender, Age, Weight, Height, Password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

      db.query(insertUserQuery, [firstname, lastname, username, address, email, phoneNo, gender, age, weight, height, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error registering user', error: err });
        }

        const userId = result.insertId;
        const qrData = JSON.stringify({ userId });

        QRCode.toString(qrData, { type: 'svg' }, (err, qrCode) => {
          if (err) return res.status(500).json({ message: 'Error generating QR code', error: err });

          const insertQrQuery = 'INSERT INTO qr_codes (user_id, qr_code) VALUES (?, ?)';
          db.query(insertQrQuery, [userId, qrCode], (err) => {
            if (err) return res.status(500).json({ message: 'Error saving QR code', error: err });
            return res.status(201).json({ message: 'User registered successfully', qrCode });
          });
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during registration', error });
  }
};
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const adminUsername = "admin";
  const adminPassword = "admin123";

  if (username === adminUsername && password === adminPassword) {
    const token = jwt.sign(
      { id: 1, username: adminUsername, isAdmin: true },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );
    return res.status(200).json({
      message: 'Admin login successful',
      token,
      user: { id: 1, username: adminUsername, isAdmin: true }
    });
  }

  try {
    const query = 'SELECT * FROM login WHERE UserName = ?';
    db.query(query, [username], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Login failed: User not found' });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.Password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Login failed: Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.userid, username: user.UserName, isAdmin: false },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user.userid, username: user.UserName, isAdmin: false }
      });
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during login', error });
  }
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



export const getUsers = (req, res) => {
  db.query('SELECT * FROM login', (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error fetching users from the database' });
    }
    res.json(result);
  });
};

// Update a user by ID
export const updateUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userid } = req.params;
  const { UserName, Email, PhoneNo } = req.body;

  db.query(
    'UPDATE login SET UserName = ?, Email = ?, PhoneNo = ? WHERE userid = ?',
    [UserName, Email, PhoneNo, userid],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error occurred while updating user' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User updated successfully' });
    }
  );
};

// Delete a user by ID
export const deleteUser = (req, res) => {
  const { userid } = req.params;

  db.query('DELETE FROM login WHERE userid = ?', [userid], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error occurred while deleting user' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  });
};

