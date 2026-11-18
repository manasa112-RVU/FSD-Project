
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API_URL from "../api";

function ProjectDetails() {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [joinMessage, setJoinMessage] = useState("");
    const [joining, setJoining] = useState(false);

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || null;
        } catch {
            return null;
        }
    })();

    // Get unique members, including the creator
    const getTeamMembers = (currentProject) => {
        const members = (currentProject.teamMembers || []).map(member =>
            typeof member === "string" ? member : member?.email
        );

        return [...new Set([
            currentProject.creatorEmail,
            ...members
        ].filter(Boolean))];
    };

    // Fetch project details
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`${API_URL}/api/projects`);

                if (!response.ok) {
                    throw new Error("Unable to load projects.");
                }

                const data = await response.json();

                const selectedProject = data.find(
                    item => item._id === id
                );

                if (!selectedProject) {
                    throw new Error("Project not found.");
                }

                setProject(selectedProject);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    // Team information
    const teamMembers = project ? getTeamMembers(project) : [];

    const maxTeamSize = Number(project?.maxTeamSize) || 5;

    const memberCount = teamMembers.length;

    const remainingSpots = Math.max(
        0,
        maxTeamSize - memberCount
    );

    const isFull = memberCount >= maxTeamSize;

    // Check project creator and member
    const isCreator = project?.creatorEmail === user?.email;

    const isMember =
        !!user?.email && teamMembers.includes(user.email);

    // Join project
    const handleJoinProject = async () => {
        const token = localStorage.getItem("token");

        if (!user || !token) {
            setJoinMessage("Please login first to join this project.");
            return;
        }

        if (isFull) {
            setJoinMessage("This project team is already full.");
            return;
        }

        setJoining(true);
        setJoinMessage("");

        try {
            const response = await fetch(
                `${API_URL}/api/projects/${id}/join`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            setJoinMessage(
                data.message ||
                (response.ok
                    ? "Successfully joined the project!"
                    : "Unable to join project.")
            );

            if (response.ok) {
                setProject(previous => ({
                    ...previous,
                    teamMembers: data.teamMembers ||
                        [...getTeamMembers(previous), user.email]
                }));
            }

        } catch (err) {
            console.error("Error joining project:", err);
            setJoinMessage("Unable to connect to server.");
        } finally {
            setJoining(false);
        }
    };

    const getMemberName = (member) => {
        if (typeof member === "string") {
            return member;
        }

        return member?.name || member?.email || "Team Member";
    };

    if (loading) {
        return (
            <div className="project-details-page">
                <div className="project-details-message">
                    Loading project details...
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="project-details-page">
                <div className="project-details-message">
                    <h2>{error || "Project not found."}</h2>
                    <Link to="/projects">← Back to Projects</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="project-details-page">

            <div className="project-details-container">

                <Link to="/projects" className="project-details-back">
                    ← Back to Explore Projects
                </Link>

                {/* Project Heading */}
                <section className="project-details-hero">

                    <span className="project-details-category">
                        {project.category || "General"}
                    </span>

                    <h1>{project.title}</h1>

                    <p>
                        Explore this project, understand the idea
                        and find out how you can contribute.
                    </p>

                    <div className="project-details-meta">
                        <span>
                            {memberCount}/{maxTeamSize} Team Members
                        </span>

                        <span>
                            ✦ {project.createdBy || "Student"}
                        </span>
                    </div>

                </section>

                <div className="project-details-layout">

                    {/* Main Information */}
                    <main className="project-details-main">

                        <section className="project-details-card">
                            <h2>About This Project</h2>

                            <p className="project-details-description">
                                {project.description}
                            </p>
                        </section>

                        <section className="project-details-card">
                            <h2>Skills Required</h2>

                            <p className="project-details-subtitle">
                                Skills and technologies needed for this project.
                            </p>

                            <div className="project-details-skills">
                                {project.skillsRequired?.length > 0 ? (
                                    project.skillsRequired.map((skill, index) => (
                                        <span key={index}>{skill}</span>
                                    ))
                                ) : (
                                    <p>No specific skills listed.</p>
                                )}
                            </div>
                        </section>

                        <section className="project-details-card">
                            <h2>Current Team</h2>

                            <p className="project-details-subtitle">
                                Students currently associated with this project.
                            </p>

                            <div className="project-details-members">

                                {teamMembers.length > 0 ? (
                                    teamMembers.map((member, index) => (
                                        <div
                                            className="project-details-member"
                                            key={member || index}
                                        >
                                            <div className="project-details-avatar">
                                                {getMemberName(member)
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <span>{getMemberName(member)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No team members have joined yet.</p>
                                )}

                            </div>
                        </section>

                    </main>

                    {/* Join Project Sidebar */}
                    <aside className="project-details-sidebar">

                        <h2>Join This Project</h2>

                        <p>
                            Interested in this idea? Join the team
                            and contribute your skills.
                        </p>

                        <div className="project-details-sidebar-info">
                            <span>PROJECT CATEGORY</span>
                            <strong>{project.category || "General"}</strong>
                        </div>

                        <div className="project-details-sidebar-info">
                            <span>TEAM CAPACITY</span>
                            <strong>
                                {memberCount} / {maxTeamSize} Members
                            </strong>
                        </div>

                        {/* Team Capacity Progress */}
                        <div className="details-capacity">

                            <div className="details-capacity-info">
                                <span>
                                    {isFull
                                        ? "Team is full"
                                        : `${remainingSpots} ${
                                            remainingSpots === 1
                                                ? "spot"
                                                : "spots"
                                        } available`}
                                </span>

                                <strong>
                                    {Math.round(
                                        (memberCount / maxTeamSize) * 100
                                    )}%
                                </strong>
                            </div>

                            <div className="details-capacity-track">
                                <div
                                    className={`details-capacity-fill ${
                                        isFull ? "full" : ""
                                    }`}
                                    style={{
                                        width: `${Math.min(
                                            100,
                                            (memberCount / maxTeamSize) * 100
                                        )}%`
                                    }}
                                />
                            </div>

                        </div>

                        {/* Action Buttons */}
                        {isCreator ? (

                            <Link
                                to={`/edit-project/${project._id}`}
                                className="project-details-join-button"
                            >
                                Edit Your Project →
                            </Link>

                        ) : isMember ? (

                            <button
                                className="project-details-joined-button"
                                disabled
                            >
                                ✓ Already Joined
                            </button>

                        ) : isFull ? (

                            <button
                                className="project-details-full-button"
                                disabled
                            >
                                Team Full
                            </button>

                        ) : user ? (

                            <button
                                className="project-details-join-button"
                                onClick={handleJoinProject}
                                disabled={joining}
                            >
                                {joining ? "Joining..." : "Join Project →"}
                            </button>

                        ) : (

                            <Link
                                to="/login"
                                className="project-details-join-button"
                            >
                                Login to Join →
                            </Link>

                        )}

                        {joinMessage && (
                            <p className="project-details-join-message">
                                {joinMessage}
                            </p>
                        )}

                        <div className="project-details-note">
                            <span>💡</span>
                            <p>
                                Collaborate with other students,
                                share your ideas and learn together.
                            </p>
                        </div>

                    </aside>

                </div>
            </div>
        </div>
    );
}

export default ProjectDetails;
