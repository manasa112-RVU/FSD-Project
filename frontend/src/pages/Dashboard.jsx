
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

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    // If user is not logged in
    if (!user) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Please Login</h2>
                    <p>You need to login to access TeamSphere.</p>

                    <button
                        className="auth-button"
                        onClick={() => navigate("/login")}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">

            {/* Dashboard Navigation */}
            <nav className="dashboard-nav">

                <Link to="/" className="dashboard-logo">
                    TeamSphere<span>.</span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="logout-btn"
                >
                    Logout
                </button>

            </nav>

            <div className="dashboard-content">

                {/* Welcome Section */}
                <div className="welcome-section">

                    <div>
                        <p className="dashboard-label">
                            STUDENT DASHBOARD
                        </p>

                        <h1>Welcome, {user.name}! 👋</h1>

                        <p>
                            Ready to collaborate and build something amazing?
                        </p>
                    </div>

                    <div className="welcome-icon">
                        🚀
                    </div>

                </div>

                {/* Workspace Section */}
                <h2 className="section-heading">
                    Your Workspace
                </h2>

                <div className="dashboard-grid">

                    {/* My Profile */}
                    <div className="dashboard-card">
                        <div className="card-icon">👤</div>

                        <h3>My Profile</h3>

                        <p>
                            View your student information and skills.
                        </p>

                        <button onClick={() => navigate("/profile")}>
                            View Profile
                        </button>

                        <button onClick={() => navigate("/edit-profile")}>
                            Edit Profile
                        </button>
                    </div>

                    {/* Create Project */}
                    <div className="dashboard-card">
                        <div className="card-icon">💡</div>

                        <h3>Create Project</h3>

                        <p>
                            Share your ideas and start a new project.
                        </p>

                        <button onClick={() => navigate("/create-project")}>
                            Create Project
                        </button>
                    </div>

                    {/* Explore Projects */}
                    <div className="dashboard-card">
                        <div className="card-icon">📁</div>

                        <h3>Explore Projects</h3>

                        <p>
                            Discover interesting projects by students.
                        </p>

                        <button onClick={() => navigate("/projects")}>
                            Explore
                        </button>
                    </div>

                    {/* Find Teammates */}
                    <div className="dashboard-card">
                        <div className="card-icon">👥</div>

                        <h3>Find Teammates</h3>

                        <p>
                            Connect with students who share your interests.
                        </p>

                        <button onClick={() => navigate("/teammates")}>
                            Find Students
                        </button>
                    </div>

                    {/* My Teams */}
                    <div className="dashboard-card">
                        <div className="card-icon">🤝</div>

                        <h3>My Teams</h3>

                        <p>
                            View projects you created and joined.
                        </p>

                        <button onClick={() => navigate("/my-teams")}>
                            View My Teams
                        </button>
                    </div>

                </div>

                {/* Profile Summary */}
                <div className="profile-summary">

                    <h2>My Profile</h2>

                    <p className="profile-subtitle">
                        Your academic and personal details
                    </p>

                    <div className="profile-details">

                        <p>
                            <strong>Name:</strong> {user.name}
                        </p>

                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>

                        <p>
                            <strong>Department:</strong>{" "}
                            {user.department || "Not provided"}
                        </p>

                        <p>
                            <strong>Year:</strong>{" "}
                            {user.year || "Not provided"}
                        </p>

                    </div>

                    <p><strong>Skills</strong></p>

                    <div className="skill-list">
                        {user.skills?.length > 0
                            ? user.skills.map((skill, index) => (
                                <span key={index}>{skill}</span>
                            ))
                            : "No skills added yet"}
                    </div>

                    <p><strong>Interests</strong></p>

                    <div className="skill-list">
                        {user.interests?.length > 0
                            ? user.interests.map((interest, index) => (
                                <span key={index}>{interest}</span>
                            ))
                            : "No interests added yet"}
                    </div>

                    <button
                        className="auth-button"
                        onClick={() => navigate("/edit-profile")}
                    >
                        Edit My Profile
                    </button>

                </div>

            </div>

            {/* Footer */}
            <footer className="dashboard-footer">
                © 2026 TeamSphere. All rights reserved.
            </footer>

        </div>
    );
}

export default Dashboard;
