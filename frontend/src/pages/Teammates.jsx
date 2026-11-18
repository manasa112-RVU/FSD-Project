
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";

function Teammates() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("All");
    const [skillFilter, setSkillFilter] = useState("All");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(`${API_URL}/api/users`);

                if (!response.ok) {
                    throw new Error("Unable to fetch students.");
                }

                const data = await response.json();
                setStudents(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Get unique departments
    const departments = useMemo(() => {
        return [
            "All",
            ...new Set(
                students
                    .map(student => student.department)
                    .filter(Boolean)
            )
        ];
    }, [students]);

    // Get unique skills
    const skills = useMemo(() => {
        return [
            "All",
            ...new Set(
                students.flatMap(student => student.skills || [])
            )
        ];
    }, [students]);

    // Search and filter students
    const filteredStudents = students.filter(student => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            (student.name || "").toLowerCase().includes(searchText) ||
            (student.department || "").toLowerCase().includes(searchText) ||
            (student.skills || []).some(skill =>
                skill.toLowerCase().includes(searchText)
            ) ||
            (student.interests || []).some(interest =>
                interest.toLowerCase().includes(searchText)
            );

        const matchesDepartment =
            departmentFilter === "All" ||
            student.department === departmentFilter;

        const matchesSkill =
            skillFilter === "All" ||
            (student.skills || []).includes(skillFilter);

        return matchesSearch && matchesDepartment && matchesSkill;
    });

    return (
        <div className="teammates-page">

            <div className="teammates-container">

                <Link to="/dashboard" className="teammates-back">
                    ← Back to Dashboard
                </Link>

                {/* Header */}
                <div className="teammates-header">
                    <span>BUILD YOUR DREAM TEAM</span>

                    <h1>Find Your Teammates</h1>

                    <p>
                        Discover talented students, explore their skills
                        and connect with people who share your interests.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="teammates-filter-panel">

                    <div className="teammates-search">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search by name, skill or interest..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="teammates-filter-group">

                        <div>
                            <label>Department</label>

                            <select
                                value={departmentFilter}
                                onChange={e => setDepartmentFilter(e.target.value)}
                            >
                                {departments.map(department => (
                                    <option key={department} value={department}>
                                        {department === "All"
                                            ? "All Departments"
                                            : department}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Skills</label>

                            <select
                                value={skillFilter}
                                onChange={e => setSkillFilter(e.target.value)}
                            >
                                {skills.map(skill => (
                                    <option key={skill} value={skill}>
                                        {skill === "All" ? "All Skills" : skill}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>
                </div>

                {/* Student Count */}
                <div className="teammates-results-heading">
                    <div>
                        <h2>Explore Students</h2>
                        <p>
                            {filteredStudents.length} student
                            {filteredStudents.length !== 1 ? "s" : ""} found
                        </p>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="teammates-message">
                        Loading students...
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="teammates-message teammates-error">
                        {error}
                    </div>
                )}

                {/* Empty Results */}
                {!loading && !error && filteredStudents.length === 0 && (
                    <div className="teammates-message">
                        <h3>No students found</h3>
                        <p>
                            Try changing your search or filters.
                        </p>

                        <button
                            onClick={() => {
                                setSearch("");
                                setDepartmentFilter("All");
                                setSkillFilter("All");
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Student Cards */}
                {!loading && !error && filteredStudents.length > 0 && (
                    <div className="teammates-grid">

                        {filteredStudents.map(student => {
                            const initials = (student.name || "Student")
                                .split(" ")
                                .filter(Boolean)
                                .map(word => word[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase();

                            return (
                                <div
                                    className="teammate-card"
                                    key={student._id}
                                >

                                    <div className="teammate-card-top">
                                        <div className="teammate-avatar">
                                            {initials}
                                        </div>

                                        <span className="teammate-year">
                                            {student.year
                                                ? `Year ${student.year}`
                                                : "Student"}
                                        </span>
                                    </div>

                                    <h3>{student.name || "Student"}</h3>

                                    <p className="teammate-department">
                                        {student.department || "Department not added"}
                                    </p>

                                    <div className="teammate-divider"></div>

                                    <div className="teammate-details">
                                        <h4>Skills</h4>

                                        <div className="teammate-tags">
                                            {student.skills?.length > 0 ? (
                                                student.skills.map((skill, index) => (
                                                    <span key={index}>
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <small>No skills added</small>
                                            )}
                                        </div>
                                    </div>

                                    <div className="teammate-details">
                                        <h4>Interests</h4>

                                        <div className="teammate-tags teammate-interest-tags">
                                            {student.interests?.length > 0 ? (
                                                student.interests.map((interest, index) => (
                                                    <span key={index}>
                                                        {interest}
                                                    </span>
                                                ))
                                            ) : (
                                                <small>No interests added</small>
                                            )}
                                        </div>
                                    </div>

                                    <Link
                                        to={`/contact-student/${student._id}`}
                                        className="teammate-contact-button"
                                    
                                    >
                                        Contact Student
                                    </Link>
                                </div>
                            );
                        })}

                    </div>
                )}

            </div>
        </div>
    );
}

export default Teammates;
