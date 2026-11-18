
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        skillsRequired: {
            type: [String],
            default: []
        },

        createdBy: {
            type: String,
            required: true
        },

        creatorEmail: {
            type: String,
            required: true
        },

        teamMembers: {
            type: [String],
            default: []
        },

        // Maximum team size, including the project creator
        maxTeamSize: {
            type: Number,
            required: true,
            default: 5,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: "Team size must be a whole number."
            }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
