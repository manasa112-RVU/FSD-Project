
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [joinMessages, setJoinMessages] = useState({});

    const [user] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    // Fetch all projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/projects"
                );

                if (!response.ok) {
                    throw new Error("Unable to fetch projects.");
                }

                const data = await response.json();
                setProjects(data);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Join a project
    const handleJoinProject = async (projectId) => {
        const token = localStorage.getItem("token");

        if (!user || !token) {
            setJoinMessages(previous => ({
                ...previous,
                [projectId]: "Please login first."
            }));
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/projects/${projectId}/join`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            setJoinMessages(previous => ({
                ...previous,
                [projectId]: data.message
            }));

            if (response.ok) {
                setProjects(previousProjects =>
                    previousProjects.map(project =>
                        project._id === projectId
                            ? {
                                ...project,
                                teamMembers: [
                                    ...(project.teamMembers || []),
                                    user.email
                                ]
                            }
                            : project
                    )
                );
            }

        } catch (error) {
            console.error("Error joining project:", error);

            setJoinMessages(previous => ({
                ...previous,
                [projectId]: "Unable to connect to server."
            }));
        }
    };

    return (
        <div className="projects-page">

            <div className="projects-header">
                <Link to="/dashboard" className="back-home">
                    ← Back to Dashboard
                </Link>

                <h1>Explore Projects</h1>

                <p>
                    Discover ideas and collaborate with other students.
                </p>

                <Link to="/create-project" className="auth-button">
                    + Create Project
                </Link>
            </div>

            {loading && <p>Loading projects...</p>}

            {error && (
                <p className="error-message">{error}</p>
            )}

            {!loading && !error && projects.length === 0 && (
                <p>No projects available yet.</p>
            )}

            <div className="projects-grid">

                {projects.map(project => {
                    const isCreator =
                        project.creatorEmail === user?.email;

                    const isMember =
                        project.teamMembers?.includes(user?.email);

                    return (
                        <div className="project-card" key={project._id}>

                            <span className="project-category">
                                {project.category}
                            </span>

                            <h2>{project.title}</h2>

                            <p>{project.description}</p>

                            <div className="project-skills">
                                {(project.skillsRequired || []).map(
                                    (skill, index) => (
                                        <span key={index}>
                                            {skill}
                                        </span>
                                    )
                                )}
                            </div>

                            <div className="project-creator">
                                Created by: {project.createdBy}
                            </div>

                            {isCreator ? (
                                <>
                                    <p>Your Project</p>

                                    <Link
                                        to={`/edit-project/${project._id}`}
                                        className="auth-button"
                                    >
                                        Edit Project
                                    </Link>
                                </>
                            ) : (
                                <button
                                    className="auth-button"
                                    disabled={isMember || !user}
                                    onClick={() =>
                                        handleJoinProject(project._id)
                                    }
                                >
                                    {isMember
                                        ? "Already Joined"
                                        : "Join Project"}
                                </button>
                            )}

                            {joinMessages[project._id] && (
                                <p>{joinMessages[project._id]}</p>
                            )}

                        </div>
                    );
                })}

            </div>
        </div>
    );
}

export default Projects;
