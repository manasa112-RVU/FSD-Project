
const Project = require("../models/Project");
const User = require("../models/User");

// Create a new project
const createProject = async (req, res) => {
    try {
        const { title, description, category, skillsRequired } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({
                message: "Please provide all required project details."
            });
        }

        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const newProject = new Project({
            title,
            description,
            category,
            skillsRequired: skillsRequired || [],
            createdBy: user.name,
            creatorEmail: user.email
        });

        await newProject.save();

        res.status(201).json({
            message: "Project created successfully!",
            project: newProject
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating project",
            error: error.message
        });
    }
};

// Get all projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(200).json(projects);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching projects",
            error: error.message
        });
    }
};

// Join a project
const joinProject = async (req, res) => {
    try {
        const { id } = req.params;
        const email = req.user.email;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found."
            });
        }

        if (project.creatorEmail === email) {
            return res.status(400).json({
                message: "You cannot join your own project."
            });
        }

        if (project.teamMembers.includes(email)) {
            return res.status(400).json({
                message: "You have already joined this project."
            });
        }

        project.teamMembers.push(email);
        await project.save();

        res.status(200).json({
            message: "Successfully joined the project!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error joining project",
            error: error.message
        });
    }
};

// Get projects created or joined by the logged-in student
const getMyTeams = async (req, res) => {
    try {
        const email = req.user.email;

        const projects = await Project.find({
            $or: [
                { creatorEmail: email },
                { teamMembers: email }
            ]
        }).sort({ createdAt: -1 });

        const students = await User.find().select("name email");

        const result = projects.map(project => {
            const teamMemberDetails = project.teamMembers.map(memberEmail => {
                const student = students.find(
                    user => user.email === memberEmail
                );

                return {
                    email: memberEmail,
                    name: student ? student.name : "Unknown Student"
                };
            });

            return {
                ...project.toObject(),
                teamMemberDetails
            };
        });

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching teams",
            error: error.message
        });
    }
};

// Update a project
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const email = req.user.email;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found."
            });
        }

        if (project.creatorEmail !== email) {
            return res.status(403).json({
                message: "You are not allowed to edit this project."
            });
        }

        const { title, description, category, skillsRequired } = req.body;

        if (title !== undefined) project.title = title;
        if (description !== undefined) project.description = description;
        if (category !== undefined) project.category = category;
        if (skillsRequired !== undefined) {
            project.skillsRequired = skillsRequired;
        }

        await project.save();

        res.status(200).json({
            message: "Project updated successfully!",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating project",
            error: error.message
        });
    }
};

module.exports = {
    createProject,
    getProjects,
    joinProject,
    getMyTeams,
    updateProject
};
