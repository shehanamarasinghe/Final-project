import { db } from '../db.js';

export const markAttendance = async (req, res) => {
  const { userId } = req.body;

  const checkQuery = `
    SELECT id, check_in, check_out 
    FROM attendance 
    WHERE user_id = ? 
    ORDER BY check_in DESC 
    LIMIT 1;
  `;

  db.query(checkQuery, [userId], (err, results) => {
    if (err) {
      console.error('Database error on fetching attendance:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    const currentTime = new Date();

    if (results.length > 0) {
      const lastCheckIn = new Date(results[0].check_in);
      const lastCheckOut = results[0].check_out ? new Date(results[0].check_out) : null;
      const lastActionTime = lastCheckOut || lastCheckIn; // Use check-out time if exists, otherwise check-in time
      const timeDifferenceInSeconds = (currentTime - lastActionTime) / 1000; // Time difference in seconds

      // Log to see what's going on
      console.log('Time difference in seconds:', timeDifferenceInSeconds);
      console.log('Last action time:', lastActionTime);
      console.log('Current time:', currentTime);

      // Ensure at least a 3-second delay before marking check-in or check-out
      if (timeDifferenceInSeconds < 3) {
        // Less than 3 seconds have passed, deny the action
        return res.status(400).json({ message: 'Please wait at least 3 seconds before checking in or out again.' });
      }

      // Check if there's an active check-in (check-out is NULL)
      if (!lastCheckOut) {
        // Mark check-out if check-in exists and no check-out is present
        const updateQuery = 'UPDATE attendance SET check_out = NOW() WHERE id = ?';
        db.query(updateQuery, [results[0].id], (err) => {
          if (err) {
            console.error('Database error on updating check-out:', err);
            return res.status(500).json({ message: 'Database error' });
          }
          return res.status(200).json({ message: 'Checked out successfully' });
        });
      } else {
        // If more than 24 hours have passed, automatically check out the previous entry and create a new check-in
        if (timeDifferenceInSeconds > (24 * 60 * 60)) {
          const autoCheckoutQuery = 'UPDATE attendance SET check_out = NOW() WHERE id = ?';
          db.query(autoCheckoutQuery, [results[0].id], (err) => {
            if (err) {
              console.error('Database error on auto checkout:', err);
              return res.status(500).json({ message: 'Database error' });
            }

            const insertQuery = 'INSERT INTO attendance (user_id, check_in) VALUES (?, NOW())';
            db.query(insertQuery, [userId], (err) => {
              if (err) {
                console.error('Database error on inserting new check-in:', err);
                return res.status(500).json({ message: 'Database error' });
              }
              return res.status(200).json({ message: 'Automatically checked out old record and checked in successfully' });
            });
          });
        } else {
          // Otherwise, create a new check-in
          const insertQuery = 'INSERT INTO attendance (user_id, check_in) VALUES (?, NOW())';
          db.query(insertQuery, [userId], (err) => {
            if (err) {
              console.error('Database error on inserting new check-in:', err);
              return res.status(500).json({ message: 'Database error' });
            }
            return res.status(200).json({ message: 'Checked in successfully' });
          });
        }
      }
    } else {
      // If no active check-in is found, create a new check-in
      const insertQuery = 'INSERT INTO attendance (user_id, check_in) VALUES (?, NOW())';
      db.query(insertQuery, [userId], (err) => {
        if (err) {
          console.error('Database error on inserting new check-in:', err);
          return res.status(500).json({ message: 'Database error' });
        }
        return res.status(200).json({ message: 'Checked in successfully' });
      });
    }
  });
};




export const getAttendanceCount = async (req, res) => {
  const query = 'SELECT COUNT(DISTINCT user_id) as count FROM attendance WHERE check_out IS NULL AND DATE(check_in) = CURDATE();';

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!result || result.length === 0) {
      return res.status(200).json({ count: 0 });
    }

    return res.status(200).json({ count: result[0].count });
  });
};


export const getWeeklyAttendanceCount = async (req, res) => {
  const query = `
    SELECT COUNT(check_in) as count 
    FROM attendance 
    WHERE check_in >= CURDATE() - INTERVAL 7 DAY;
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!result || result.length === 0) {
      return res.status(200).json({ count: 0 });
    }

    return res.status(200).json({ count: result[0].count });
  });
};

export const getDailyAttendanceForWeek = async (req, res) => {
  const query = `
    SELECT
      d.date,
      COALESCE(COUNT(DISTINCT a.check_in), 0) as count
    FROM (
      SELECT CURDATE() AS date
      UNION ALL SELECT CURDATE() - INTERVAL 1 DAY
      UNION ALL SELECT CURDATE() - INTERVAL 2 DAY
      UNION ALL SELECT CURDATE() - INTERVAL 3 DAY
      UNION ALL SELECT CURDATE() - INTERVAL 4 DAY
      UNION ALL SELECT CURDATE() - INTERVAL 5 DAY
      UNION ALL SELECT CURDATE() - INTERVAL 6 DAY
    ) d
    LEFT JOIN attendance a ON DATE(a.check_in) = d.date
    GROUP BY d.date
    ORDER BY d.date ASC;
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    return res.status(200).json(result);
  });
};
