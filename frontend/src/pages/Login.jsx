
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                navigate("/dashboard");
            } else {
                setError(data.message || "Invalid email or password.");
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
                        STUDENT COLLABORATION PLATFORM
                    </span>

                    <h1>
                        Great ideas are built together.
                    </h1>

                    <p>
                        Find the right teammates, discover exciting
                        projects and turn your ideas into reality.
                    </p>

                    <div className="auth-panel-divider"></div>

                    <div className="auth-panel-footer">
                        <span>Connect</span>
                        <span>Collaborate</span>
                        <span>Create</span>
                    </div>

                </div>

                <p className="auth-panel-copyright">
                    © 2026 TeamSphere. All rights reserved.
                </p>

            </section>

            {/* Right Login Section */}
            <section className="auth-modern-form-section">

                <div className="auth-modern-form-wrapper">

                    <Link to="/" className="auth-mobile-brand">
                        TeamSphere<span>.</span>
                    </Link>

                    <div className="auth-form-heading">

                        <span className="auth-form-label">
                            WELCOME BACK
                        </span>

                        <h2>Sign in to your account</h2>

                        <p>
                            Enter your details to access your workspace.
                        </p>

                    </div>

                    <form
                        onSubmit={handleLogin}
                        className="auth-modern-form"
                    >

                        <div className="auth-field">

                            <label htmlFor="login-email">
                                Email Address
                            </label>

                            <input
                                id="login-email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />

                        </div>

                        <div className="auth-field">

                            <label htmlFor="login-password">
                                Password
                            </label>

                            <div className="auth-password-wrapper">

                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
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

                        </div>

                        {error && (
                            <p className="auth-modern-error">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="auth-modern-submit"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>

                    </form>

                    <div className="auth-modern-switch">
                        Don't have an account?
                        <Link to="/register"> Create an account</Link>
                    </div>

                    <Link to="/" className="auth-modern-back">
                        ← Back to Home
                    </Link>

                </div>

            </section>

        </div>
    );
}

export default Login;
