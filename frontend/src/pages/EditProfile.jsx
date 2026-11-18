
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
        interests: user?.interests?.join(", ") || "",
        aboutMe: user?.aboutMe || ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

        setLoading(true);

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
                            .filter(Boolean),
                        aboutMe: formData.aboutMe.trim()
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
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="profile-edit-page">
                <div className="profile-edit-card">
                    <h2>Please Login</h2>
                    <Link to="/login">Go to Login →</Link>
                </div>
            </div>
        );
    }

    const initials = (user.name || "Student")
        .split(" ")
        .filter(Boolean)
        .map(word => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="profile-edit-page">

            <div className="profile-edit-container">

                <Link to="/dashboard" className="profile-back-link">
                    ← Back to Dashboard
                </Link>

                {/* Page Heading */}
                <div className="profile-edit-heading">
                    <span>YOUR ACCOUNT</span>
                    <h1>Edit Your Profile</h1>
                    <p>
                        Keep your academic information and skills
                        up to date so other students can discover you.
                    </p>
                </div>

                <div className="profile-edit-layout">

                    {/* Profile Summary */}
                    <aside className="profile-edit-sidebar">

                        <div className="profile-avatar">
                            {initials}
                        </div>

                        <h2>{user.name}</h2>

                        <p className="profile-user-email">
                            {user.email}
                        </p>

                        <div className="profile-sidebar-divider"></div>

                        <div className="profile-sidebar-info">
                            <span>DEPARTMENT</span>
                            <p>{formData.department || "Not added yet"}</p>
                        </div>

                        <div className="profile-sidebar-info">
                            <span>ACADEMIC YEAR</span>
                            <p>
                                {formData.year
                                    ? `${formData.year}${formData.year === "1" ? "st" : formData.year === "2" ? "nd" : formData.year === "3" ? "rd" : "th"} Year`
                                    : "Not added yet"}
                            </p>
                        </div>

                        <div className="profile-sidebar-note">
                            <span>💡</span>
                            <p>
                                A complete profile helps you connect
                                with students who share your interests.
                            </p>
                        </div>

                    </aside>

                    {/* Edit Form */}
                    <main className="profile-edit-form-card">

                        <div className="profile-form-heading">
                            <h2>Personal Information</h2>
                            <p>Update your details below.</p>
                        </div>

                        <form onSubmit={handleSubmit}>

                            {/* Full Name */}
                            <div className="profile-form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="profile-form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                />
                                <small>
                                    Email address cannot be changed here.
                                </small>
                            </div>

                            {/* Department and Year */}
                            <div className="profile-form-row">

                                <div className="profile-form-group">
                                    <label>Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        placeholder="e.g. Computer Science"
                                        required
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label>Academic Year</label>
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
                                </div>

                            </div>

                            {/* Skills */}
                            <div className="profile-form-group">
                                <label>Skills</label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="Python, React, MongoDB"
                                />
                                <small>
                                    Separate each skill with a comma.
                                </small>
                            </div>

                            {/* Interests */}
                            <div className="profile-form-group">
                                <label>Interests</label>
                                <input
                                    type="text"
                                    name="interests"
                                    value={formData.interests}
                                    onChange={handleChange}
                                    placeholder="Web Development, AI, Data Science"
                                />
                                <small>
                                    Add topics and areas you enjoy exploring.
                                </small>
                            </div>

                            {/* About Me */}
                            <div className="profile-form-group">
                                <label>About Me</label>
                                <textarea
                                    name="aboutMe"
                                    value={formData.aboutMe}
                                    onChange={handleChange}
                                    placeholder="Tell other students about yourself, your interests, skills and the projects you enjoy working on..."
                                    rows="5"
                                    maxLength="500"
                                />
                                <small>
                                    Write a short introduction about yourself
                                    (maximum 500 characters).
                                </small>
                            </div>

                            {/* Success Message */}
                            {message && (
                                <div className="profile-success-message">
                                    ✓ {message}
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="profile-error-message">
                                    {error}
                                </div>
                            )}

                            {/* Form Actions */}
                            <div className="profile-form-actions">

                                <Link
                                    to="/dashboard"
                                    className="profile-cancel-button"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    className="profile-save-button"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save Changes →"}
                                </button>

                            </div>

                        </form>
                    </main>

                </div>
            </div>
        </div>
    );
}

export default EditProfile;
