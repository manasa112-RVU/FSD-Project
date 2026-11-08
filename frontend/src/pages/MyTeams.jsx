
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyTeams() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [user] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    // Fetch projects belonging to the logged-in student
    useEffect(() => {
        const fetchMyTeams = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token || !user) {
                    setError("Please login to view your teams.");
                    return;
                }

                const response = await fetch(
                    "http://localhost:5000/api/projects/my-teams",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to fetch your teams."
                    );
                }

                setProjects(data);

            } catch (error) {
                console.error("Error fetching teams:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyTeams();
    }, [user]);

    return (
        <div className="projects-page">

            <div className="projects-header">

                <Link to="/dashboard" className="back-home">
                    ← Back to Dashboard
                </Link>

                <h1>My Teams</h1>

                <p>
                    View projects you created and projects you joined.
                </p>

            </div>

            {loading && <p>Loading your teams...</p>}

            {error && (
                <p className="error-message">{error}</p>
            )}

            {!loading && !error && projects.length === 0 && (
                <p>
                    You haven't created or joined any projects yet.
                </p>
            )}

            <div className="projects-grid">

                {projects.map(project => {

                    const isCreator =
                        project.creatorEmail === user?.email;

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

                            <p>
                                <strong>
                                    {isCreator
                                        ? "You created this project"
                                        : "You joined this project"}
                                </strong>
                            </p>

                            <div className="team-members">
                                <h4>Team Members</h4>

                                {project.teamMemberDetails?.length > 0 ? (
                                    project.teamMemberDetails.map(
                                        (member, index) => (
                                            <p key={index}>
                                                {member.name}
                                            </p>
                                        )
                                    )
                                ) : (
                                    <p>No team members yet.</p>
                                )}
                            </div>

                            {isCreator && (
                                <Link
                                    to={`/edit-project/${project._id}`}
                                    className="auth-button"
                                >
                                    Edit Project
                                </Link>
                            )}

                        </div>
                    );
                })}

            </div>

        </div>
    );
}

export default MyTeams;
