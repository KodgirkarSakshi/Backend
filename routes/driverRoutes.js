const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const driverController = require("../controllers/driverController");
const authMiddleware = require("../middlewares/authMiddleware");

// ✅ Register
router.post(
    "/register",
    [
        body("fullname.firstname").notEmpty().withMessage("First name is required"),
        body("email").isEmail().withMessage("Please provide a valid email"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
        body("vehicle.color").notEmpty().withMessage("Vehicle color is required"),
        body("vehicle.plate").isLength({ min: 6 }).withMessage("Vehicle plate must be at least 6 characters long"),
        body("vehicle.capacity").isInt({ min: 1 }).withMessage("Vehicle capacity must be at least 1"),
        body("vehicle.vehicleType").isIn(["car", "bike", "auto"]).withMessage("Vehicle type must be car, bike or auto"),
    ],
    driverController.registerDriver
);

// ✅ Login
router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Please provide a valid email"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    driverController.loginDriver
);

// ✅ Profile (protected)
router.get("/profile", authMiddleware.authDriver, driverController.getDriverProfile);

// ✅ Logout (protected)
router.get("/logout", authMiddleware.authDriver, driverController.logoutDriver);

module.exports = router;
