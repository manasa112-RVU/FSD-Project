
const User = require("../models/User");

// Get all registered students
const getStudents = async (req, res) => {
    try {
        const students = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json(students);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching students",
            error: error.message
        });
    }
};

module.exports = { getStudents };
