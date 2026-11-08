
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditProject() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState({
        title: "",
        description: "",
        category: "",
        skillsRequired: []
    });

    const [skills, setSkills] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "null");

    // Fetch the selected project
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/projects"
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Unable to fetch projects.");
                }

                const selectedProject = data.find(
                    (item) => item._id === id
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
                    title: selectedProject.title,
                    description: selectedProject.description,
                    category: selectedProject.category,
                    skillsRequired: selectedProject.skillsRequired || []
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

    // Handle form changes
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

        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("Please login again.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/projects/${id}`,
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
        }
    };

    if (loading) {
        return <p>Loading project...</p>;
    }

    return (
        <div className="create-project-page">
            <div className="create-project-card">

                <h2>Edit Project</h2>
                <p>Update your project details below.</p>

                {message && (
                    <p className="error-message">{message}</p>
                )}

                {!message && (
                    <form onSubmit={handleSubmit}>

                        <label>Project Title</label>
                        <input
                            type="text"
                            name="title"
                            value={project.title}
                            onChange={handleChange}
                            required
                        />

                        <label>Description</label>
                        <textarea
                            name="description"
                            value={project.description}
                            onChange={handleChange}
                            required
                        />

                        <label>Category</label>
                        <input
                            type="text"
                            name="category"
                            value={project.category}
                            onChange={handleChange}
                            required
                        />

                        <label>Required Skills</label>
                        <input
                            type="text"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            placeholder="React, Python, MongoDB"
                        />

                        <button type="submit">
                            Save Changes
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/projects")}
                        >
                            Cancel
                        </button>

                    </form>
                )}

            </div>
        </div>
    );
}

export default EditProject;
