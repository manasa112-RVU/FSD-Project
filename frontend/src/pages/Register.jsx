
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...formData,
                        year: Number(formData.year),
                        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
                        interests: formData.interests.split(",").map(i => i.trim()).filter(Boolean)
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage("Registration successful! You can now login.");

                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } else {
                setError(data.message);
            }

        } catch {
            setError("Unable to connect to server.");
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card register-card">

                <Link to="/" className="auth-logo">
                    TeamSphere<span>.</span>
                </Link>

                <h2>Create Account</h2>

                <p className="auth-subtitle">
                    Join TeamSphere and start collaborating!
                </p>

                <form onSubmit={handleRegister}>

                    <label>Full Name</label>
                    <input
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label>Email Address</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />

                    <label>Department</label>
                    <input
                        name="department"
                        type="text"
                        placeholder="e.g. Computer Science"
                        value={formData.department}
                        onChange={handleChange}
                        required
                    />

                    <label>Year of Study</label>
                    <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select your year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                    </select>

                    <label>Skills</label>
                    <input
                        name="skills"
                        type="text"
                        placeholder="Python, React, SQL"
                        value={formData.skills}
                        onChange={handleChange}
                    />

                    <label>Interests</label>
                    <input
                        name="interests"
                        type="text"
                        placeholder="Web Development, AI/ML"
                        value={formData.interests}
                        onChange={handleChange}
                    />

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    {message && (
                        <p className="success-message">{message}</p>
                    )}

                    <button type="submit" className="auth-button">
                        Create Account
                    </button>

                </form>

                <p className="auth-footer">
                    Already have an account?
                    <Link to="/login"> Login</Link>
                </p>

                <Link to="/" className="back-home">
                    ← Back to Home
                </Link>

            </div>

        </div>
    );
}

export default Register;
