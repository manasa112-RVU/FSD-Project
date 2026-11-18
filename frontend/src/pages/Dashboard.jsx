
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const [user] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (!user) {
        return (
            <div className="professional-auth">
                <div className="professional-auth-card">
                    <h2>Authentication Required</h2>
                    <p>Please log in to access your workspace.</p>
                    <button onClick={() => navigate("/login")}>
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const navigation = [
        { label: "Overview", path: "/dashboard" },
        { label: "Explore Projects", path: "/projects" },
        { label: "Create Project", path: "/create-project" },
        { label: "Find Teammates", path: "/teammates" },
        { label: "My Teams", path: "/my-teams" },
        { label: "My Profile", path: "/profile" }
    ];

    const workspaceItems = [
        {
            title: "Explore Projects",
            description: "Discover projects and find opportunities to collaborate.",
            action: "Browse projects",
            path: "/projects"
        },
        {
            title: "Create a Project",
            description: "Turn your ideas into projects and build your team.",
            action: "Start a project",
            path: "/create-project"
        },
        {
            title: "Find Teammates",
            description: "Connect with students who share your skills and interests.",
            action: "Find students",
            path: "/teammates"
        },
        {
            title: "My Teams",
            description: "View and manage the projects you created and joined.",
            action: "View my teams",
            path: "/my-teams"
        }
    ];

    return (
        <div className="pro-dashboard">

            {/* Sidebar */}
            <aside className="pro-sidebar">

                <Link to="/" className="pro-brand">
                    TeamSphere<span>.</span>
                </Link>

                <div className="pro-sidebar-label">
                    WORKSPACE
                </div>

                <nav className="pro-navigation">
                    {navigation.map((item, index) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={index === 0
                                ? "pro-nav-link active"
                                : "pro-nav-link"}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="pro-sidebar-bottom">
                    <div className="pro-sidebar-user">
                        <div className="pro-user-avatar">
                            {(user.name || "S").charAt(0).toUpperCase()}
                        </div>

                        <div className="pro-user-details">
                            <strong>{user.name || "Student"}</strong>
                            <span>Student Account</span>
                        </div>
                    </div>

                    <button
                        className="pro-logout"
                        onClick={handleLogout}
                    >
                        Log out
                    </button>
                </div>

            </aside>

            {/* Main Dashboard */}
            <main className="pro-main">

                {/* Top Bar */}
                <header className="pro-topbar">
                    <div>
                        <span>WORKSPACE / OVERVIEW</span>
                    </div>

                    <Link to="/profile" className="pro-topbar-profile">
                        {user.name || "My Account"}
                    </Link>
                </header>

                <div className="pro-content">

                    {/* Welcome */}
                    <section className="pro-welcome">
                        <div>
                            <span className="pro-eyebrow">
                                YOUR STUDENT WORKSPACE
                            </span>

                            <h1>
                                Welcome back, {user.name || "Student"}.
                            </h1>

                            <p>
                                Manage your projects, connect with
                                collaborators and keep your work moving forward.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/create-project")}
                            className="pro-primary-button"
                        >
                            Create New Project
                        </button>
                    </section>

                    {/* Workspace */}
                    <section className="pro-section">

                        <div className="pro-section-heading">
                            <div>
                                <h2>Workspace</h2>
                                <p>
                                    Access your project collaboration tools.
                                </p>
                            </div>
                        </div>

                        <div className="pro-workspace-grid">

                            {workspaceItems.map((item, index) => (
                                <article
                                    className="pro-workspace-card"
                                    key={item.title}
                                >
                                    <span className="pro-card-number">
                                        0{index + 1}
                                    </span>

                                    <h3>{item.title}</h3>

                                    <p>{item.description}</p>

                                    <button
                                        onClick={() => navigate(item.path)}
                                    >
                                        {item.action}
                                        <span> →</span>
                                    </button>
                                </article>
                            ))}

                        </div>
                    </section>

                    {/* Profile */}
                    <section className="pro-section">

                        <div className="pro-section-heading">
                            <div>
                                <h2>Profile Overview</h2>
                                <p>
                                    Your academic and professional information.
                                </p>
                            </div>

                            <button
                                className="pro-secondary-button"
                                onClick={() => navigate("/edit-profile")}
                            >
                                Edit Profile
                            </button>
                        </div>

                        <div className="pro-profile-card">

                            <div className="pro-profile-top">
                                <div className="pro-profile-avatar">
                                    {(user.name || "S").charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <h3>{user.name || "Student"}</h3>
                                    <p>{user.email}</p>
                                </div>
                            </div>

                            <div className="pro-profile-details">

                                <div>
                                    <span>Department</span>
                                    <strong>
                                        {user.department || "Not provided"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Year of Study</span>
                                    <strong>
                                        {user.year || "Not provided"}
                                    </strong>
                                </div>

                            </div>

                            <div className="pro-profile-tags">

                                <div>
                                    <h4>Skills</h4>

                                    <div className="pro-tags">
                                        {user.skills?.length > 0
                                            ? user.skills.map((skill, index) => (
                                                <span key={index}>{skill}</span>
                                            ))
                                            : <p>No skills added yet.</p>}
                                    </div>
                                </div>

                                <div>
                                    <h4>Interests</h4>

                                    <div className="pro-tags">
                                        {user.interests?.length > 0
                                            ? user.interests.map((interest, index) => (
                                                <span key={index}>{interest}</span>
                                            ))
                                            : <p>No interests added yet.</p>}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* Bottom Section */}
                    <section className="pro-bottom-banner">
                        <div>
                            <h2>Have an idea worth building?</h2>
                            <p>
                                Create a project and bring the right people together.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/create-project")}
                        >
                            Get Started →
                        </button>
                    </section>

                </div>

                <footer className="pro-footer">
                    © 2026 TeamSphere. All rights reserved.
                </footer>

            </main>
        </div>
    );
}

export default Dashboard;
