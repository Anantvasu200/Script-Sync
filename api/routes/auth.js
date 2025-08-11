const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

// Hardcoded JWT Secret (Not recommended for production)
const JWT_SECRET =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidmFzdSIsImlhdCI6MTc1NDY3NDE1NywiZXhwIjoxNzU0Njc3NzU3fQ.PuD0nh9wO_1oqAuHZD1Ezp292DeIAyaVJxv8Nxvzv0w";

// Signup Route
router.post(
    "/signup",
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("mobile")
            .isMobilePhone()
            .withMessage("Valid mobile number is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be 6+ chars"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { name, mobile, email, password } = req.body;

        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser)
                return res.status(400).json({ message: "Email already registered" });

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const user = new User({ name, mobile, email, password: hashedPassword });
            await user.save();

            // Create JWT token (without .env)
            const payload = { id: user._id, name: user.name }; 
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

            res.status(201).json({ message: "User created successfully", token });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").exists().withMessage("Password is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        try {
            // Check if user exists
            const user = await User.findOne({ email });
            if (!user)
                return res.status(400).json({ message: "Invalid credentials" });

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({ message: "Invalid credentials" });

            // Generate JWT
            const payload = { id: user._id, name: user.name }; 
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });


            res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                },
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

module.exports = router;
