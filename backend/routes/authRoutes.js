
const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    updateProfile
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route
router.put("/update", authMiddleware, updateProfile);

module.exports = router;
