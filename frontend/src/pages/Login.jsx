
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
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
                setError(data.message);
            }

        } catch  {
            setError("Unable to connect to server.");
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <Link to="/" className="auth-logo">
                    TeamSphere<span>.</span>
                </Link>

                <h2>Welcome Back!</h2>

                <p className="auth-subtitle">
                    Login to continue your projects.
                </p>

                <form onSubmit={handleLogin}>

                    <label>Email Address</label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    <button type="submit" className="auth-button">
                        Login
                    </button>

                </form>

                <p className="auth-footer">
                    Don't have an account?
                    <Link to="/register"> Register</Link>
                </p>

                <Link to="/" className="back-home">
                    ← Back to Home
                </Link>

            </div>

        </div>
    );
}

export default Login;
