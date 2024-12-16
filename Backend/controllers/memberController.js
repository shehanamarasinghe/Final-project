import { db } from '../db.js';


// Get the current user's profile
export const getProfile = (req, res) => {
  const userId = req.user.id; // AuthMiddleware adds `user` object to the request

  const query = "SELECT * FROM login WHERE userid = ?";
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0) return res.status(404).json({ message: "User not found" });

    const user = result[0];
    user.ProfilePictureUrl = user.ProfilePicture ? `http://localhost:5000/uploads/${user.ProfilePicture}` : null;

    res.status(200).json(user);
  });
};

// Update the user's profile
export const updateProfile = (req, res) => {
  const userId = req.user.id; // AuthMiddleware adds `user` object to the request
  const { Firstname, Lastname, UserName, Address, Email, PhoneNo, Gender, Age, Weight, Height } = req.body;
  const profilePicture = req.file ? req.file.filename : null;

  // SQL query for updating the profile
  const updateQuery = `
    UPDATE login 
    SET Firstname = ?, Lastname = ?, UserName = ?, Address = ?, Email = ?, 
        PhoneNo = ?, Gender = ?, Age = ?, Weight = ?, Height = ?, 
        ProfilePicture = COALESCE(?, ProfilePicture) 
    WHERE userid = ?
  `;

  db.query(
    updateQuery,
    [Firstname, Lastname, UserName, Address, Email, PhoneNo, Gender, Age, Weight, Height, profilePicture, userId],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found or no changes made" });
      }

      res.status(200).json({ message: "Profile updated successfully" });
    }
  );
};
