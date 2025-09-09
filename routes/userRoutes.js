const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userControllers');

// Register route
router.post(
  '/register',
  [
    body('fullname.firstname')
      .notEmpty()
      .withMessage('First name is required'),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  userController.registerUser
);
//login
router.post('/login',[
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')   
], userController.loginUser);


module.exports = router;
