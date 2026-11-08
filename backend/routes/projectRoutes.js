
const express = require("express");
const router = express.Router();

const {
    createProject,
    getProjects,
    joinProject,
    getMyTeams,
    updateProject
} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");

// View all projects - public route
router.get("/", getProjects);

// Protected routes - login required
router.post("/", authMiddleware, createProject);

router.get("/my-teams", authMiddleware, getMyTeams);

router.put("/:id", authMiddleware, updateProject);

router.post("/:id/join", authMiddleware, joinProject);

module.exports = router;
