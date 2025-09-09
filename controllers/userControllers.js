const userModel = require("../models/userModel");
const userService = require("../services/userService");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blackListTokenModel");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullname, email, password } = req.body;

    // Hash password
    const hashedPassword = await userModel.hashPassword(password);

    // Create user
    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.loginUser = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = user.generateAuthToken();
  res.cookie('token',token);
  res.status(201).json({
    message: "Login successful",
    token,
    user,
  });
};

module.exports.getUserProfile = async (req, res, next) => {    
  res.status(200).json({
        user: req.user
    }); 
  }


module.exports.logoutUser = async (req, res, next) => {   
  res.clearCookie('token');
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);  
  await blackListTokenModel.create({token});
  res.status(200).json({
        message: "Logout successful"
    });
  }