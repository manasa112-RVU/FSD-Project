
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API_URL from "../api";

function EditProject() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState({
        title: "",
        description: "",
        category: "",
        skillsRequired: [],
        teamMembers: []
    });

    const [skills, setSkills] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "null");

    // Fetch selected project
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`${API_URL}/api/projects`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Unable to fetch projects.");
                }

                const selectedProject = data.find(
                    item => item._id === id
                );

                if (!selectedProject) {
                    setMessage("Project not found.");
                    return;
                }

                if (selectedProject.creatorEmail !== user?.email) {
                    setMessage("You can only edit your own projects.");
                    return;
                }

                setProject({
                    title: selectedProject.title || "",
                    description: selectedProject.description || "",
                    category: selectedProject.category || "",
                    skillsRequired: selectedProject.skillsRequired || [],
                    teamMembers: selectedProject.teamMembers || []
                });

                setSkills(
                    (selectedProject.skillsRequired || []).join(", ")
                );

            } catch (error) {
                console.error("Error fetching project:", error);
                setMessage("Unable to load project. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id, user?.email]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setProject(previousProject => ({
            ...previousProject,
            [name]: value
        }));
    };

    // Update project
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");

        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("Please login again.");
            return;
        }

        setSaving(true);

        try {
            const response = await fetch(
                `${API_URL}/api/projects/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title: project.title,
                        description: project.description,
                        category: project.category,
                        skillsRequired: skills
                            .split(",")
                            .map(skill => skill.trim())
                            .filter(Boolean)
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Project updated successfully!");
                navigate("/projects");
            } else {
                setMessage(data.message || "Failed to update project.");
            }

        } catch (error) {
            console.error("Error updating project:", error);
            setMessage("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // Display team member information safely
    const getMemberName = (member) => {
        if (typeof member === "string") {
            return member;
        }

        return member?.name || member?.email || "Team member";
    };

    const getInitial = (member) => {
        return getMemberName(member).charAt(0).toUpperCase();
    };

    if (loading) {
        return (
            <div className="edit-project-page">
                <div className="edit-project-loading">
                    Loading project...
                </div>
            </div>
        );
    }

    return (
        <div className="edit-project-page">

            <div className="edit-project-container">

                <Link to="/projects" className="edit-project-back">
                    ← Back to Projects
                </Link>

                {/* Page Heading */}
                <div className="edit-project-heading">
                    <span>PROJECT MANAGEMENT</span>
                    <h1>Edit Your Project</h1>
                    <p>
                        Update your project information and keep your
                        team aligned with your latest ideas.
                    </p>
                </div>

                {message ? (
                    <div className="edit-project-message">
                        <p>{message}</p>
                        <Link to="/projects">Return to Projects →</Link>
                    </div>
                ) : (

                    <div className="edit-project-layout">

                        {/* Edit Form */}
                        <div className="edit-project-form-card">

                            <div className="edit-project-form-heading">
                                <h2>Project Details</h2>
                                <p>Make changes to your project below.</p>
                            </div>

                            <form onSubmit={handleSubmit}>

                                <div className="edit-project-field">
                                    <label>Project Title</label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={project.title}
                                        onChange={handleChange}
                                        placeholder="Enter project title"
                                        required
                                    />
                                </div>

                                <div className="edit-project-field">
                                    <label>Description</label>

                                    <textarea
                                        name="description"
                                        value={project.description}
                                        onChange={handleChange}
                                        placeholder="Describe your project..."
                                        rows="6"
                                        required
                                    />
                                </div>

                                <div className="edit-project-field">
                                    <label>Category</label>

                                    <input
                                        type="text"
                                        name="category"
                                        value={project.category}
                                        onChange={handleChange}
                                        placeholder="e.g. Web Development"
                                        required
                                    />
                                </div>

                                <div className="edit-project-field">
                                    <label>Required Skills</label>

                                    <input
                                        type="text"
                                        value={skills}
                                        onChange={e => setSkills(e.target.value)}
                                        placeholder="React, Python, MongoDB"
                                    />

                                    <small>
                                        Separate each skill with a comma.
                                    </small>
                                </div>

                                {message && (
                                    <div className="edit-project-error">
                                        {message}
                                    </div>
                                )}

                                <div className="edit-project-actions">

                                    <button
                                        type="button"
                                        className="edit-project-cancel"
                                        onClick={() => navigate("/projects")}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="edit-project-save"
                                        disabled={saving}
                                    >
                                        {saving ? "Saving..." : "Save Changes →"}
                                    </button>

                                </div>

                            </form>
                        </div>

                        {/* Team Members Sidebar */}
                        <aside className="edit-project-sidebar">

                            <div className="edit-team-icon">
                                👥
                            </div>

                            <h2>Your Team</h2>

                            <p className="edit-team-description">
                                Students currently associated with this project.
                            </p>

                            <div className="edit-team-count">
                                <strong>{project.teamMembers.length}</strong>
                                <span>Team Members</span>
                            </div>

                            <div className="edit-team-list">

                                {project.teamMembers.length > 0 ? (
                                    project.teamMembers.map((member, index) => (
                                        <div
                                            className="edit-team-member"
                                            key={member?._id || member?.email || index}
                                        >
                                            <div className="edit-team-avatar">
                                                {getInitial(member)}
                                            </div>

                                            <span>{getMemberName(member)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="edit-team-empty">
                                        No team members have joined yet.
                                    </div>
                                )}

                            </div>

                            <div className="edit-team-tip">
                                <span>💡</span>
                                <p>
                                    Keep your project details updated so
                                    your teammates know what you're building.
                                </p>
                            </div>

                        </aside>

                    </div>
                )}

            </div>
        </div>
    );
}

export default EditProject;
