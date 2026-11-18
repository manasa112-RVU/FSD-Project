
import { useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";

function CreateProject() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        skillsRequired: "",
        maxTeamSize: "5"
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

        const teamSize = Number(formData.maxTeamSize);

        if (!Number.isInteger(teamSize) || teamSize < 1) {
            setError("Please enter a valid maximum team size.");
            return;
        }

        const projectData = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            skillsRequired: formData.skillsRequired
                .split(",")
                .map(skill => skill.trim())
                .filter(skill => skill !== ""),
            maxTeamSize: teamSize
        };

        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/api/projects`,
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
                    skillsRequired: "",
                    maxTeamSize: "5"
                });
            } else {
                setError(data.message || "Unable to create project.");
            }

        } catch (error) {
            console.error("Error creating project:", error);
            setError("Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-page">

            <div className="create-container">

                <Link to="/dashboard" className="create-back-link">
                    ← Back to Dashboard
                </Link>

                <div className="create-page-heading">
                    <span>BRING YOUR IDEA TO LIFE</span>
                    <h1>Create a New Project</h1>
                    <p>
                        Share your idea, showcase the skills you need
                        and find students to build it together.
                    </p>
                </div>

                <div className="create-layout">

                    {/* Project Form */}
                    <div className="create-form-card">

                        <div className="create-form-heading">
                            <h2>Project Information</h2>
                            <p>Fill in the details about your project.</p>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="create-form-group">
                                <label>Project Title</label>

                                <input
                                    type="text"
                                    name="title"
                                    placeholder="e.g. Smart Campus Management System"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="create-form-group">
                                <label>Project Description</label>

                                <textarea
                                    name="description"
                                    placeholder="Explain your project idea, its purpose and what you want to build..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    required
                                />
                            </div>

                            <div className="create-form-group">
                                <label>Project Category</label>

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
                            </div>

                            {/* Maximum Team Size */}
                            <div className="create-form-group">
                                <label>Maximum Team Size</label>

                                <input
                                    type="number"
                                    name="maxTeamSize"
                                    min="1"
                                    step="1"
                                    placeholder="e.g. 5"
                                    value={formData.maxTeamSize}
                                    onChange={handleChange}
                                    required
                                />

                                <small>
                                    Include yourself (the project creator) in this number.
                                    For example, 5 means you and 4 other students.
                                </small>
                            </div>

                            <div className="create-form-group">
                                <label>Required Skills</label>

                                <input
                                    type="text"
                                    name="skillsRequired"
                                    placeholder="React, Python, MongoDB"
                                    value={formData.skillsRequired}
                                    onChange={handleChange}
                                />

                                <small>
                                    Separate each skill with a comma.
                                </small>
                            </div>

                            {message && (
                                <div className="create-success">
                                    ✓ {message}
                                </div>
                            )}

                            {error && (
                                <div className="create-error">
                                    {error}
                                </div>
                            )}

                            <div className="create-form-actions">

                                <Link
                                    to="/dashboard"
                                    className="create-cancel-button"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    className="create-submit-button"
                                    disabled={loading}
                                >
                                    {loading ? "Creating..." : "Create Project →"}
                                </button>

                            </div>

                        </form>
                    </div>

                    {/* Tips Sidebar */}
                    <aside className="create-tips-card">

                        <div className="create-tips-icon">
                            ✦
                        </div>

                        <h2>Tips for a Great Project</h2>

                        <p className="create-tips-intro">
                            Make your project stand out and attract
                            the right teammates.
                        </p>

                        <div className="create-tip">
                            <span>01</span>
                            <div>
                                <h3>Choose a clear title</h3>
                                <p>
                                    Use a short and meaningful name
                                    that explains your idea.
                                </p>
                            </div>
                        </div>

                        <div className="create-tip">
                            <span>02</span>
                            <div>
                                <h3>Explain your idea</h3>
                                <p>
                                    Describe what you want to build
                                    and the problem it solves.
                                </p>
                            </div>
                        </div>

                        <div className="create-tip">
                            <span>03</span>
                            <div>
                                <h3>Select the right category</h3>
                                <p>
                                    Choose the category that best
                                    matches your project.
                                </p>
                            </div>
                        </div>

                        <div className="create-tip">
                            <span>04</span>
                            <div>
                                <h3>List required skills</h3>
                                <p>
                                    Mention the technologies and
                                    skills your teammates should know.
                                </p>
                            </div>
                        </div>

                        <div className="create-tips-footer">
                            <span>💡</span>
                            Great ideas become better when
                            people build them together.
                        </div>

                    </aside>

                </div>
            </div>
        </div>
    );
}

export default CreateProject;
