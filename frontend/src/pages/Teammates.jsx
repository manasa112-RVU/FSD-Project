
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Teammates() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/users"
                );

                if (!response.ok) {
                    throw new Error("Unable to fetch students.");
                }

                const data = await response.json();
                setStudents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    return (
        <div className="teammates-page">
            <Link to="/dashboard" className="back-home">
                ← Back to Dashboard
            </Link>

            <div className="teammates-header">
                <h1>Find Your Teammates</h1>
                <p>Discover students and connect with people who share your interests.</p>
            </div>

            {loading && <p>Loading students...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && students.length === 0 && (
                <p>No students registered yet.</p>
            )}

            <div className="teammates-grid">
                {students.map((student) => (
                    <div className="teammate-card" key={student._id}>
                        <div className="student-avatar">
                            {student.name?.charAt(0).toUpperCase()}
                        </div>

                        <h2>{student.name}</h2>

                        <p>{student.department}</p>
                        <p>Year {student.year}</p>

                        <h4>Skills</h4>
                        <div className="student-tags">
                            {student.skills?.length > 0
                                ? student.skills.map((skill, index) => (
                                    <span key={index}>{skill}</span>
                                ))
                                : "No skills added"}
                        </div>

                        <h4>Interests</h4>
                        <div className="student-tags">
                            {student.interests?.length > 0
                                ? student.interests.map((interest, index) => (
                                    <span key={index}>{interest}</span>
                                ))
                                : "No interests added"}
                        </div>

                        <a href={`mailto:${student.email}`}>
                            Contact Student →
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Teammates;
