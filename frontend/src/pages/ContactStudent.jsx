
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API_URL from "../api";

function ContactStudent() {
    const { id } = useParams();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await fetch(`${API_URL}/api/users`);

                if (!response.ok) {
                    throw new Error("Unable to load student details.");
                }

                const data = await response.json();

                const selectedStudent = data.find(
                    item => item._id === id
                );

                if (!selectedStudent) {
                    throw new Error("Student not found.");
                }

                setStudent(selectedStudent);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [id]);

    if (loading) {
        return (
            <div className="contact-student-page">
                <div className="contact-student-message">
                    Loading student profile...
                </div>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="contact-student-page">
                <div className="contact-student-message">
                    <h2>{error || "Student not found."}</h2>
                    <Link to="/teammates">← Back to Teammates</Link>
                </div>
            </div>
        );
    }

    const initials = (student.name || "Student")
        .split(" ")
        .filter(Boolean)
        .map(word => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="contact-student-page">

            <div className="contact-student-container">

                <Link to="/teammates" className="contact-student-back">
                    ← Back to Find Teammates
                </Link>

                <div className="contact-student-heading">
                    <span>STUDENT PROFILE</span>
                    <h1>Connect with a Student</h1>
                    <p>
                        Learn more about this student and get in touch
                        to explore collaboration opportunities.
                    </p>
                </div>

                <div className="contact-student-card">

                    {/* Student Profile */}
                    <div className="contact-student-profile">

                        <div className="contact-student-avatar">
                            {initials}
                        </div>

                        <h2>{student.name || "Student"}</h2>

                        <p className="contact-student-department">
                            {student.department || "Department not added"}
                        </p>

                        <span className="contact-student-year">
                            {student.year
                                ? `Year ${student.year}`
                                : "Student"}
                        </span>

                    </div>

                    <div className="contact-student-divider"></div>

                    {/* Student Information */}
                    <div className="contact-student-information">

                        {/* About Me */}
                        <div className="contact-student-section">
                            <h3>About Me</h3>
                            <p>
                                {student.aboutMe?.trim()
                                    ? student.aboutMe
                                    : "This student hasn't added an introduction yet."}
                            </p>
                        </div>

                        {/* Skills */}
                        <div className="contact-student-section">
                            <h3>Skills</h3>

                            <div className="contact-student-tags">
                                {student.skills?.length > 0 ? (
                                    student.skills.map((skill, index) => (
                                        <span key={index}>{skill}</span>
                                    ))
                                ) : (
                                    <small>No skills added yet.</small>
                                )}
                            </div>
                        </div>

                        {/* Interests */}
                        <div className="contact-student-section">
                            <h3>Interests</h3>

                            <div className="contact-student-tags interest">
                                {student.interests?.length > 0 ? (
                                    student.interests.map((interest, index) => (
                                        <span key={index}>{interest}</span>
                                    ))
                                ) : (
                                    <small>No interests added yet.</small>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="contact-student-section">
                            <h3>Email Address</h3>
                            <p>
                                {student.email || "Email not available"}
                            </p>
                        </div>

                        {student.email && (
                            <a
                                href={`mailto:${student.email}?subject=${encodeURIComponent("TeamSphere - Project Collaboration")}`}
                                className="contact-student-email-button"
                            >
                                Send Email →
                            </a>
                        )}

                    </div>

                </div>

            </div>
        </div>
    );
}

export default ContactStudent;
