
import { useState } from "react";
import { Link } from "react-router-dom";

function CreateProject() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        skillsRequired: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            return;
        }

        const projectData = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            skillsRequired: formData.skillsRequired
                .split(",")
                .map(skill => skill.trim())
                .filter(skill => skill !== "")
        };

        try {
            const response = await fetch(
                "http://localhost:5000/api/projects",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(projectData)
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage("Project created successfully!");

                setFormData({
                    title: "",
                    description: "",
                    category: "",
                    skillsRequired: ""
                });
            } else {
                setError(data.message || "Unable to create project.");
            }

        } catch (error) {
            console.error("Error creating project:", error);
            setError("Unable to connect to the server.");
        }
    };

    return (
        <div className="create-project-page">
            <div className="create-project-card">

                <Link to="/dashboard" className="back-home">
                    ← Back to Dashboard
                </Link>

                <h1>Create a New Project</h1>
                <p>Share your idea and find teammates to build it.</p>

                <form onSubmit={handleSubmit}>

                    <label>Project Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter project title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <label>Description</label>
                    <textarea
                        name="description"
                        placeholder="Describe your project..."
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />

                    <label>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="IoT">IoT</option>
                        <option value="Other">Other</option>
                    </select>

                    <label>Required Skills</label>
                    <input
                        type="text"
                        name="skillsRequired"
                        placeholder="React, Python, MongoDB"
                        value={formData.skillsRequired}
                        onChange={handleChange}
                    />

                    {message && (
                        <p className="success-message">{message}</p>
                    )}

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    <button type="submit" className="auth-button">
                        Create Project
                    </button>

                </form>
            </div>
        </div>
    );
}

export default CreateProject;
