
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        department: "",
        year: "",
        skills: "",
        interests: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/api/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...formData,
                        year: Number(formData.year),
                        skills: formData.skills
                            .split(",")
                            .map(s => s.trim())
                            .filter(Boolean),
                        interests: formData.interests
                            .split(",")
                            .map(i => i.trim())
                            .filter(Boolean)
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage(
                    "Registration successful! Redirecting to login..."
                );

                setTimeout(() => {
                    navigate("/login");
                }, 1500);

            } else {
                setError(data.message || "Registration failed.");
            }

        } catch {
            setError("Unable to connect to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modern-page">

            {/* Left Information Panel */}
            <section className="auth-modern-panel">

                <Link to="/" className="auth-modern-brand">
                    TeamSphere<span>.</span>
                </Link>

                <div className="auth-panel-content">

                    <span className="auth-panel-label">
                        BUILD SOMETHING TOGETHER
                    </span>

                    <h1>
                        Your next project starts with the right team.
                    </h1>

                    <p>
                        Create your student profile, showcase your
                        skills and connect with people who share
                        your interests.
                    </p>

                    <div className="auth-panel-divider"></div>

                    <div className="auth-panel-footer">
                        <span>Discover</span>
                        <span>Connect</span>
                        <span>Build</span>
                    </div>

                </div>

                <p className="auth-panel-copyright">
                    © 2026 TeamSphere. All rights reserved.
                </p>

            </section>

            {/* Right Registration Section */}
            <section className="auth-modern-form-section">

                <div className="auth-modern-form-wrapper register-modern-wrapper">

                    <Link to="/" className="auth-mobile-brand">
                        TeamSphere<span>.</span>
                    </Link>

                    <div className="auth-form-heading">

                        <span className="auth-form-label">
                            GET STARTED
                        </span>

                        <h2>Create your account</h2>

                        <p>
                            Join TeamSphere and start collaborating.
                        </p>

                    </div>

                    <form
                        onSubmit={handleRegister}
                        className="auth-modern-form"
                    >

                        <div className="auth-field">

                            <label htmlFor="register-name">
                                Full Name
                            </label>

                            <input
                                id="register-name"
                                name="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="name"
                                required
                            />

                        </div>

                        <div className="auth-field">

                            <label htmlFor="register-email">
                                Email Address
                            </label>

                            <input
                                id="register-email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />

                        </div>

                        <div className="auth-field">

                            <label htmlFor="register-password">
                                Password
                            </label>

                            <div className="auth-password-wrapper">

                                <input
                                    id="register-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    minLength={6}
                                    required
                                />

                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                            <span className="auth-field-hint">
                                Minimum 6 characters
                            </span>

                        </div>

                        <div className="auth-field">

                            <label htmlFor="register-department">
                                Department
                            </label>

                            <input
                                id="register-department"
                                name="department"
                                type="text"
                                placeholder="e.g. Computer Science"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="auth-field">

                            <label htmlFor="register-year">
                                Year of Study
                            </label>

                            <select
                                id="register-year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select your year
                                </option>

                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>

                        </div>

                        <div className="auth-field">

                            <label htmlFor="register-skills">
                                Skills
                            </label>

                            <input
                                id="register-skills"
                                name="skills"
                                type="text"
                                placeholder="Python, React, SQL"
                                value={formData.skills}
                                onChange={handleChange}
                            />

                            <span className="auth-field-hint">
                                Separate multiple skills with commas.
                            </span>

                        </div>

                        <div className="auth-field">

                            <label htmlFor="register-interests">
                                Interests
                            </label>

                            <input
                                id="register-interests"
                                name="interests"
                                type="text"
                                placeholder="Web Development, AI/ML"
                                value={formData.interests}
                                onChange={handleChange}
                            />

                        </div>

                        {error && (
                            <p className="auth-modern-error">
                                {error}
                            </p>
                        )}

                        {message && (
                            <p className="auth-modern-success">
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="auth-modern-submit"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>

                    </form>

                    <div className="auth-modern-switch">
                        Already have an account?
                        <Link to="/login"> Sign In</Link>
                    </div>

                    <Link to="/" className="auth-modern-back">
                        ← Back to Home
                    </Link>

                </div>

            </section>

        </div>
    );
}

export default Register;
