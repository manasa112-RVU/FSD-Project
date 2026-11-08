
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
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
