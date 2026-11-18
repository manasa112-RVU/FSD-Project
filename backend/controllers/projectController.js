
const Project = require("../models/Project");
const User = require("../models/User");

// Ensure the creator is included and avoid duplicate members
const getUniqueTeamMembers = (project) => {
    return [...new Set([
        project.creatorEmail,
        ...(project.teamMembers || [])
    ].filter(Boolean))];
};

// Create a new project
const createProject = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            skillsRequired,
            maxTeamSize
        } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({
                message: "Please provide all required project details."
            });
        }

        const teamSize = Number(maxTeamSize);

        if (
            maxTeamSize === undefined ||
            maxTeamSize === null ||
            !Number.isInteger(teamSize) ||
            teamSize < 1
        ) {
            return res.status(400).json({
                message: "Please enter a valid maximum team size."
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
            maxTeamSize: teamSize,
            createdBy: user.name,
            creatorEmail: user.email,
            teamMembers: [user.email]
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

        const result = projects.map(project => ({
            ...project.toObject(),
            teamMembers: getUniqueTeamMembers(project),
            maxTeamSize: project.maxTeamSize || 5
        }));

        res.status(200).json(result);

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

        const members = getUniqueTeamMembers(project);

        if (members.includes(email)) {
            return res.status(400).json({
                message: "You have already joined this project."
            });
        }

        const maxSize = project.maxTeamSize || 5;

        if (members.length >= maxSize) {
            return res.status(400).json({
                message: "This project team is already full."
            });
        }

        project.teamMembers = [...members, email];

        await project.save();

        res.status(200).json({
            message: "Successfully joined the project!",
            teamMembers: project.teamMembers,
            maxTeamSize: maxSize
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
            const members = getUniqueTeamMembers(project);

            const teamMemberDetails = members.map(memberEmail => {
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
                teamMembers: members,
                maxTeamSize: project.maxTeamSize || 5,
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

        const {
            title,
            description,
            category,
            skillsRequired,
            maxTeamSize
        } = req.body;

        const members = getUniqueTeamMembers(project);

        if (maxTeamSize !== undefined) {
            const teamSize = Number(maxTeamSize);

            if (
                !Number.isInteger(teamSize) ||
                teamSize < 1
            ) {
                return res.status(400).json({
                    message: "Please enter a valid maximum team size."
                });
            }

            if (teamSize < members.length) {
                return res.status(400).json({
                    message: `Maximum team size cannot be less than the current ${members.length} team members.`
                });
            }

            project.maxTeamSize = teamSize;
        }

        if (title !== undefined) project.title = title;
        if (description !== undefined) project.description = description;
        if (category !== undefined) project.category = category;

        if (skillsRequired !== undefined) {
            project.skillsRequired = skillsRequired;
        }

        project.teamMembers = members;

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

// Delete a project
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const email = req.user.email;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found."
            });
        }

        // Only the creator can delete the project
        if (project.creatorEmail !== email) {
            return res.status(403).json({
                message: "You are not allowed to delete this project."
            });
        }

        await Project.findByIdAndDelete(id);

        res.status(200).json({
            message: "Project deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting project",
            error: error.message
        });
    }
};

module.exports = {
    createProject,
    getProjects,
    joinProject,
    getMyTeams,
    updateProject,
    deleteProject
};
