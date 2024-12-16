import multer from "multer";
import { db } from "../db.js";
import path from "path";

export const AddMeal = (req, res) => {
    const insertQuery = "INSERT INTO mealplan (MealTitle) VALUES (?)";
    const values = [req.body.Mtitle];

    db.query(insertQuery, values, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Meal plan has been added");
    });
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.filename + "_" + Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({
    storage: storage
}).single('image');

export const upl = (req, res) => {
    const image = req.file.filename;
};

export const Meal = (req, res) => {
    const insertMeal = "INSERT INTO meals (MealName,MealDesc) VALUES (?,?)";
    const value = [req.body.MTitle, req.body.MDescription];
    db.query(insertMeal, value, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Meal has been added");
    });
};