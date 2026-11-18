
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [joinMessages, setJoinMessages] = useState({});
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    const [user] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    // Fetch projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${API_URL}/api/projects`);

                if (!response.ok) {
                    throw new Error("Unable to fetch projects.");
                }

                const data = await response.json();
                setProjects(Array.isArray(data) ? data : []);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Get unique project categories
    const categories = useMemo(() => {
        return [
            "All Categories",
            ...new Set(
                projects
                    .map(project => project.category)
                    .filter(Boolean)
            )
        ];
    }, [projects]);

    // Get popular skills
    const popularSkills = useMemo(() => {
        return [
            ...new Set(
                projects.flatMap(project => project.skillsRequired || [])
            )
        ].slice(0, 6);
    }, [projects]);

    // Search and filter projects
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                (project.title || "").toLowerCase().includes(searchText) ||
                (project.description || "").toLowerCase().includes(searchText) ||
                (project.skillsRequired || []).some(skill =>
                    skill.toLowerCase().includes(searchText)
                );

            const matchesCategory =
                selectedCategory === "All Categories" ||
                project.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [projects, search, selectedCategory]);

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
                `${API_URL}/api/projects/${projectId}/join`,
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
                [projectId]: data.message || (
                    response.ok
                        ? "Successfully joined the project!"
                        : "Unable to join project."
                )
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
        <div className="explore-page">

            {/* Page Heading */}
            <div className="explore-heading">

                <div>
                    <Link to="/dashboard" className="explore-back-link">
                        ← Back to Dashboard
                    </Link>

                    <h1>Explore Projects</h1>

                    <p>
                        Discover projects from other students and find
                        opportunities to collaborate.
                    </p>
                </div>

                <Link
                    to="/create-project"
                    className="explore-create-button"
                >
                    + Create Project
                </Link>

            </div>

            {/* Search and Category Filter */}
            <div className="explore-filter-bar">

                <div className="explore-search-box">
                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search by project title, skill or keyword"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    aria-label="Filter by category"
                >
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <button
                    className="explore-search-button"
                    onClick={() => setSearch(search.trim())}
                >
                    Search
                </button>

            </div>

            {/* Popular Skills */}
            {popularSkills.length > 0 && (
                <div className="explore-popular-skills">

                    <span className="explore-popular-label">
                        Popular skills:
                    </span>

                    {popularSkills.map((skill, index) => (
                        <button
                            key={index}
                            className="explore-skill-filter"
                            onClick={() => setSearch(skill)}
                        >
                            {skill}
                        </button>
                    ))}

                </div>
            )}

            {/* Project Count */}
            <div className="explore-results-heading">

                <span>
                    Showing {filteredProjects.length}{" "}
                    {filteredProjects.length === 1 ? "project" : "projects"}
                </span>

                {(search || selectedCategory !== "All Categories") && (
                    <button
                        className="explore-clear-button"
                        onClick={() => {
                            setSearch("");
                            setSelectedCategory("All Categories");
                        }}
                    >
                        Clear filters
                    </button>
                )}

            </div>

            {/* Loading Message */}
            {loading && (
                <div className="explore-message">
                    Loading projects...
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="explore-message explore-error">
                    {error}
                </div>
            )}

            {/* Project Cards */}
            {!loading && !error && filteredProjects.length > 0 && (
                <div className="explore-project-grid">

                    {filteredProjects.map(project => {

                        const isCreator =
                            project.creatorEmail === user?.email;

                        // Check whether current user is already a member
                        const isMember = (
                            project.teamMembers || []
                        ).some(member =>
                            typeof member === "string"
                                ? member === user?.email
                                : member?.email === user?.email
                        );

                        return (
                            <article
                                className="explore-project-card"
                                key={project._id}
                            >

                                {/* Category and Member Count */}
                                <div className="explore-card-top">

                                    <span className="explore-category-tag">
                                        {project.category || "General"}
                                    </span>

                                    <span className="explore-member-count">
                                        {(project.teamMembers || []).length}{" "}
                                        {(project.teamMembers || []).length === 1
                                            ? "member"
                                            : "members"}
                                    </span>

                                </div>

                                {/* Project Information */}
                                <div className="explore-card-content">

                                    <Link
                                        to={`/project/${project._id}`}
                                        className="explore-project-title"
                                    >
                                        {project.title}
                                    </Link>

                                    <p className="explore-project-description">
                                        {project.description}
                                    </p>

                                    <div className="explore-card-skills">

                                        {(project.skillsRequired || []).map(
                                            (skill, index) => (
                                                <span key={index}>
                                                    {skill}
                                                </span>
                                            )
                                        )}

                                    </div>

                                </div>

                                {/* Card Footer */}
                                <div className="explore-card-footer">

                                    <div className="explore-creator-info">
                                        <span>Created by</span>

                                        <strong>
                                            {project.createdBy || "Student"}
                                        </strong>
                                    </div>

                                    {isCreator ? (

                                        <Link
                                            to={`/edit-project/${project._id}`}
                                            className="explore-card-button"
                                        >
                                            Edit Project
                                        </Link>

                                    ) : isMember ? (

                                        <button
                                            className="explore-card-button joined"
                                            disabled
                                        >
                                            Already Joined
                                        </button>

                                    ) : user ? (

                                        <button
                                            className="explore-card-button"
                                            onClick={() =>
                                                handleJoinProject(project._id)
                                            }
                                        >
                                            Join Project
                                        </button>

                                    ) : (

                                        <Link
                                            to="/login"
                                            className="explore-card-button"
                                        >
                                            Login to Join
                                        </Link>

                                    )}

                                </div>

                                {/* Join Message */}
                                {joinMessages[project._id] && (
                                    <p className="explore-join-message">
                                        {joinMessages[project._id]}
                                    </p>
                                )}

                            </article>
                        );
                    })}

                </div>
            )}

            {/* No Projects Found */}
            {!loading && !error && filteredProjects.length === 0 && (
                <div className="explore-empty-state">

                    <h3>No projects found</h3>

                    <p>
                        Try another search term or select a different category.
                    </p>

                    <button
                        onClick={() => {
                            setSearch("");
                            setSelectedCategory("All Categories");
                        }}
                    >
                        Clear filters
                    </button>

                </div>
            )}

        </div>
    );
}

export default Projects;
