const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const driverController = require("../controllers/driverController");

router.post(
    "/register",
    [
        body("fullname.firstname").notEmpty().withMessage("First name is required"),
        body("email").isEmail().withMessage("Please provide a valid email"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
        body("vehicle.color").notEmpty().withMessage("vehicle color is required"),
        body("vehicle.plate").isLength({ min: 6 }).withMessage("vehicle plate must be at least 6 characters long"),
        body("vehicle.capacity").isInt({ min: 1 }).withMessage("vehicle capacity must be at least 1"),
        body("vehicle.vehicleType").isIn(["car", "bike", "auto"]).withMessage("vehicle type must be car, bike or auto"),
    ],
    driverController.registerDriver
);

module.exports = router;
