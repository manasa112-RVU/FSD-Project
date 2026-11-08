
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

function EditProfile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || null;
        } catch {
            return null;
        }
    });

    const [formData, setFormData] = useState({
        name: user?.name || "",
        department: user?.department || "",
        year: user?.year || "",
        skills: user?.skills?.join(", ") || "",
        interests: user?.interests?.join(", ") || ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const token = localStorage.getItem("token");

        if (!user || !token) {
            setError("Please login again.");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/auth/update`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        department: formData.department,
                        year: Number(formData.year),
                        skills: formData.skills
                            .split(",")
                            .map(skill => skill.trim())
                            .filter(Boolean),
                        interests: formData.interests
                            .split(",")
                            .map(interest => interest.trim())
                            .filter(Boolean)
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                setUser(data.user);
                setMessage("Profile updated successfully!");

                setTimeout(() => {
                    navigate("/dashboard");
                }, 1200);

            } else {
                setError(data.message || "Unable to update profile.");
            }

        } catch (error) {
            console.error("Error updating profile:", error);
            setError("Unable to connect to server.");
        }
    };

    if (!user) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Please Login</h2>
                    <Link to="/login">Go to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="create-project-page">
            <div className="create-project-card">

                <Link to="/dashboard" className="back-home">
                    ← Back to Dashboard
                </Link>

                <h1>Edit My Profile</h1>
                <p>Update your academic details, skills and interests.</p>

                <form onSubmit={handleSubmit}>

                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label>Email Address</label>
                    <input
                        type="email"
                        value={user.email}
                        disabled
                    />

                    <label>Department</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                    />

                    <label>Year</label>
                    <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                    </select>

                    <label>Skills</label>
                    <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="Python, React, MongoDB"
                    />

                    <label>Interests</label>
                    <input
                        type="text"
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                        placeholder="Web Development, AI"
                    />

                    {message && (
                        <p className="success-message">{message}</p>
                    )}

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    <button type="submit" className="auth-button">
                        Save Changes
                    </button>

                </form>
            </div>
        </div>
    );
}

export default EditProfile;
