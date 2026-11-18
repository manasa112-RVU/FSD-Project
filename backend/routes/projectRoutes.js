
const express = require("express");
const router = express.Router();

const {
    createProject,
    getProjects,
    joinProject,
    getMyTeams,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");

// View all projects - public route
router.get("/", getProjects);

// Protected routes - login required
router.post("/", authMiddleware, createProject);

router.get("/my-teams", authMiddleware, getMyTeams);

router.put("/:id", authMiddleware, updateProject);

router.post("/:id/join", authMiddleware, joinProject);

// Delete a project - creator only
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;
