const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistTokenModel');
const driverModel = require('../models/driverModel');

// ✅ Auth middleware for normal users
module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded._id).select('-password');
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

// ✅ Auth middleware for drivers
module.exports.authDriver = async (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.driver = await driverModel.findById(decoded._id).select('-password');
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

// ✅ Logout (works for both user & driver)
module.exports.logout = async (req, res) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(400).json({ message: "No token provided" });

    try {
        await blacklistTokenModel.create({ token });
        res.clearCookie('token');
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};
