const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');    
const bcrypt = require('bcrypt');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization?.split(' ')[1]);  
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }  
    
    const isBlacklisted = await userModel.findOne({token: token});
    if (isBlacklisted) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded._id).select('-password');    
        return next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
}