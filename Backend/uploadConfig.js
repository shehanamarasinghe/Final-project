import multer from "multer";
import fs from "fs";

// Ensure the 'uploads' folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Multer configuration for file uploads
 const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
