const driverModel = require("../models/driverModel");
const driverService = require("../services/driverService");
const { validationResult } = require("express-validator");

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

        // prevent sending hashed password
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
