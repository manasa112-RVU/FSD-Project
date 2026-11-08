
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new student
const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            department,
            year,
            skills,
            interests
        } = req.body;

        // Check required fields
        if (
            !name ||
            !email ||
            !password ||
            !department ||
            !year
        ) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        // Check if student already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new student
        const user = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            department,
            year,
            skills: skills || [],
            interests: interests || []
        });

        await user.save();

        res.status(201).json({
            message: "Registration successful!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                year: user.year,
                skills: user.skills,
                interests: user.interests
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};


// Login an existing student
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password"
            });
        }

        // Find student by email
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
           {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
      );

        // Send complete student information
        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                year: user.year,
                skills: user.skills,
                interests: user.interests
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};


// Update student profile

const updateProfile = async (req, res) => {
    try {
        // Get email from the verified JWT token
        const email = req.user.email;

        const {
            name,
            department,
            year,
            skills,
            interests
        } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        user.name = name || user.name;
        user.department = department || user.department;
        user.year = year || user.year;
        user.skills = skills || user.skills;
        user.interests = interests || user.interests;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                year: user.year,
                skills: user.skills,
                interests: user.interests
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating profile",
            error: error.message
        });
    }
};




// Export functions
module.exports = {
    registerUser,
    loginUser,
    updateProfile
};
