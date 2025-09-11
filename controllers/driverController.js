const driverModel = require("../models/driverModel");
const driverService = require("../services/driverService");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistTokenModel");

module.exports.registerDriver = async (req, res) => {
    console.log("📥 Headers:", req.headers["content-type"]);
    console.log("📥 Body received:", JSON.stringify(req.body, null, 2));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("❌ Validation Errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    try {
        const isDriverAlreadyExist = await driverModel.findOne({ email });
        if (isDriverAlreadyExist) {
            return res.status(400).json({ message: "Driver already exists" });
        }

        const driver = await driverService.createDriver({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password,
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType,
        });

        const token = driver.generateAuthToken();

        const safeDriver = driver.toObject();
        delete safeDriver.password;

        res.status(201).json({
            success: true,
            message: "Driver registered successfully",
            driver: safeDriver,
            token,
        });
    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports.loginDriver = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
        const driver = await driverModel.findOne({ email }).select("+password");
        if (!driver) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await driver.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        const token = driver.generateAuthToken();
        res.cookie('token', token);

        res.status(200).json({
            success: true,
            message: "Driver logged in successfully",
            driver,
            token,
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports.getDriverProfile = async (req, res) => {
    res.status(200).json({ driver: req.driver });
};

module.exports.logoutDriver = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(400).json({ message: "No token provided" });

    await blacklistTokenModel.create({ token });
    res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully" });
};
