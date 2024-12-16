import { body } from 'express-validator';

export const validateUserUpdate = [
  body('UserName').notEmpty().withMessage('User name is required'),
  body('Email').isEmail().withMessage('A valid email is required'),
  body('PhoneNo').isLength({ min: 10 }).withMessage('Phone number must be at least 10 characters'),
];
