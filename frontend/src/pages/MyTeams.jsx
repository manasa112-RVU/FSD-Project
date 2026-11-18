
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";

function MyTeams() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    })();

    // Fetch projects belonging to the logged-in user
    useEffect(() => {
        const fetchMyTeams = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${API_URL}/api/projects/my-teams`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to load your projects.");
                }

                const data = await response.json();

                setProjects(Array.isArray(data) ? data : []);

            } catch (err) {
                console.error("Error fetching teams:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyTeams();
    }, []);

    // Separate created and joined projects
    const createdProjects = projects.filter(
        project => project.creatorEmail === user?.email
    );

    const joinedProjects = projects.filter(
        project => project.creatorEmail !== user?.email
    );

    // Get member names
    const getMemberName = (member) => {
        if (typeof member === "string") {
            return member.includes("@")
                ? member.split("@")[0]
                : member;
        }

        return member?.name ||
            member?.email?.split("@")[0] ||
            "Team Member";
    };

    // Display project card
    const renderProjectCard = (project, isCreator) => {
        const members = project.teamMembers || [];
        const memberCount = members.length;

        return (
            <div className="myteams-project-card" key={project._id}>

                <div className="myteams-project-info">

                    <div className="myteams-project-heading">

                        <h3>{project.title}</h3>

                        <span className="myteams-category">
                            {project.category || "General"}
                        </span>

                    </div>

                    <p className="myteams-description">
                        {project.description}
                    </p>

                    <div className="myteams-project-meta">

                        <span>
                            {memberCount}{" "}
                            {memberCount === 1
                                ? "team member"
                                : "team members"}
                        </span>

                        <span>
                            Created by: {project.createdBy || "Student"}
                        </span>

                        <span>
                            {isCreator ? "Project owner" : "Team member"}
                        </span>

                    </div>

                    <div className="myteams-members">

                        <strong>Team:</strong>

                        {members.length > 0 ? (
                            members.map((member, index) => (
                                <span key={index}>
                                    {getMemberName(member)}
                                </span>
                            ))
                        ) : (
                            <span>No members yet</span>
                        )}

                    </div>

                </div>

                <div className="myteams-card-action">

                    {isCreator ? (
                        <Link
                            to={`/edit-project/${project._id}`}
                            className="myteams-edit-button"
                        >
                            Edit Project
                        </Link>
                    ) : (
                        <span className="myteams-joined-status">
                            Joined
                        </span>
                    )}

                </div>

            </div>
        );
    };

    return (
        <div className="myteams-page">

            {/* Page Heading */}
            <div className="myteams-header">

                <div>
                    <Link
                        to="/dashboard"
                        className="myteams-back-link"
                    >
                        ← Back to Dashboard
                    </Link>

                    <h1>My Teams</h1>

                    <p>
                        Every project you created or joined, in one place.
                    </p>
                </div>

                <Link
                    to="/create-project"
                    className="myteams-create-button"
                >
                    Create Project
                </Link>

            </div>

            {/* Loading */}
            {loading && (
                <p className="myteams-message">
                    Loading your projects...
                </p>
            )}

            {/* Error */}
            {error && (
                <p className="myteams-message myteams-error">
                    {error}
                </p>
            )}

            {!loading && !error && (
                <>

                    {/* Summary Cards */}
                    <div className="myteams-summary">

                        <div className="myteams-summary-card">
                            <p>Projects created</p>
                            <h2>{createdProjects.length}</h2>
                        </div>

                        <div className="myteams-summary-card">
                            <p>Projects joined</p>
                            <h2>{joinedProjects.length}</h2>
                        </div>

                        <div className="myteams-summary-card">
                            <p>Total projects</p>
                            <h2>{projects.length}</h2>
                        </div>

                    </div>

                    {/* Projects Created */}
                    <section className="myteams-section">

                        <div className="myteams-section-heading">

                            <h2>Projects I Created</h2>

                            <span>
                                {createdProjects.length}{" "}
                                {createdProjects.length === 1
                                    ? "project"
                                    : "projects"}
                            </span>

                        </div>

                        {createdProjects.length > 0 ? (
                            <div className="myteams-project-list">
                                {createdProjects.map(project =>
                                    renderProjectCard(project, true)
                                )}
                            </div>
                        ) : (
                            <div className="myteams-empty">
                                <h3>No projects created yet</h3>

                                <p>
                                    Create your first project and find
                                    students to collaborate with.
                                </p>

                                <Link to="/create-project">
                                    Create a Project
                                </Link>
                            </div>
                        )}

                    </section>

                    {/* Projects Joined */}
                    <section className="myteams-section">

                        <div className="myteams-section-heading">

                            <h2>Projects I Joined</h2>

                            <span>
                                {joinedProjects.length}{" "}
                                {joinedProjects.length === 1
                                    ? "project"
                                    : "projects"}
                            </span>

                        </div>

                        {joinedProjects.length > 0 ? (
                            <div className="myteams-project-list">
                                {joinedProjects.map(project =>
                                    renderProjectCard(project, false)
                                )}
                            </div>
                        ) : (
                            <div className="myteams-empty">
                                <h3>No joined projects yet</h3>

                                <p>
                                    Explore available projects and join
                                    a team that interests you.
                                </p>

                                <Link to="/projects">
                                    Explore Projects
                                </Link>
                            </div>
                        )}

                    </section>

                </>
            )}

        </div>
    );
}

export default MyTeams;
