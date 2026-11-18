
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import heroImage from "../assets/teamsphere-hero.png";
import API_URL from "../api";

function Home() {
    const [projects, setProjects] = useState([]);

    // Fetch featured projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${API_URL}/api/projects`);

                if (!response.ok) return;

                const data = await response.json();
                setProjects(Array.isArray(data) ? data.slice(0, 3) : []);
            } catch (error) {
                console.error("Unable to load featured projects:", error);
            }
        };

        fetchProjects();
    }, []);

    // Platform features
    const features = [
        {
            number: "01",
            title: "Register and Log In",
            description: "Create your student account and access your collaboration workspace."
        },
        {
            number: "02",
            title: "Manage Your Profile",
            description: "Showcase your skills, interests and availability to other students."
        },
        {
            number: "03",
            title: "Create Projects",
            description: "Share your ideas with descriptions, categories and required skills."
        },
        {
            number: "04",
            title: "Explore Projects",
            description: "Discover academic projects that match your interests."
        },
        {
            number: "05",
            title: "Find Teammates",
            description: "Connect with students who have the skills your project needs."
        },
        {
            number: "06",
            title: "Join Projects",
            description: "Find opportunities to contribute to projects created by others."
        },
        {
            number: "07",
            title: "Manage Your Teams",
            description: "View the projects you created and the projects you joined."
        },
        {
            number: "08",
            title: "Edit Projects",
            description: "Update your project details as your ideas develop."
        }
    ];

    // How it works
    const steps = [
        {
            number: "1",
            title: "Create your profile",
            description: "Sign up and add your skills and interests."
        },
        {
            number: "2",
            title: "Post or discover",
            description: "Create your own project or explore existing ideas."
        },
        {
            number: "3",
            title: "Build your team",
            description: "Find teammates and join projects that interest you."
        },
        {
            number: "4",
            title: "Manage together",
            description: "Keep track of your projects and team details."
        }
    ];

    return (
        <div className="home-page">
            <Navbar />

            {/* Hero Section */}
            <section className="home-hero">
                <div className="home-hero-inner">

                    {/* Left Side - Hero Content */}
                    <div className="home-hero-content">

                        <span className="home-eyebrow">
                            STUDENT PROJECT COLLABORATION PLATFORM
                        </span>

                        <h1>
                            Find your team.
                            <br />
                            Build your project.
                            <br />
                            <span>Ship it together.</span>
                        </h1>

                        <p>
                            TeamSphere helps students create academic projects,
                            discover what others are building, and connect with
                            teammates who match their skills and interests.
                        </p>

                        <div className="home-hero-actions">
                            <Link to="/register" className="home-primary-button">
                                Get started <span>→</span>
                            </Link>

                            <Link to="/projects" className="home-secondary-button">
                                Explore projects
                            </Link>
                        </div>

                        <div className="home-trust-text">
                            A better way to build academic projects together.
                        </div>
                    </div>

                    {/* Right Side - Illustration and Featured Projects */}
                    <div className="home-featured-panel">

                        <div className="home-panel-illustration">
                            <img
                                src={heroImage}
                                alt="Students collaborating on a project"
                            />
                        </div>

                        <div className="home-panel-heading">
                            <div>
                                <span>DISCOVER OPPORTUNITIES</span>
                                <h3>Projects looking for teammates</h3>
                            </div>

                            <span className="home-live-dot"></span>
                        </div>

                        {projects.length > 0 ? (
                            <div className="home-featured-list">
                                {projects.map(project => (
                                    <div
                                        className="home-featured-project"
                                        key={project._id}
                                    >
                                        <div className="home-featured-top">
                                            <span className="home-featured-category">
                                                {project.category || "General"}
                                            </span>

                                            <span className="home-featured-arrow">
                                                ↗
                                            </span>
                                        </div>

                                        <h4>{project.title}</h4>

                                        <p>{project.description}</p>

                                        <div className="home-featured-bottom">
                                            <span>
                                                {(project.teamMembers || []).length} team members
                                            </span>

                                            <span>
                                                {(project.skillsRequired || [])
                                                    .slice(0, 3)
                                                    .join(" · ")}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="home-no-projects">
                                <h4>Start something new</h4>

                                <p>
                                    Be the first to share a project idea with
                                    the TeamSphere community.
                                </p>

                                <Link to="/create-project">
                                    Create a project →
                                </Link>
                            </div>
                        )}

                        <Link
                            to="/projects"
                            className="home-view-all"
                        >
                            View all projects →
                        </Link>
                    </div>

                </div>
            </section>

            {/* Features Section */}
            <section className="home-features-section" id="features">

                <div className="home-section-heading">
                    <span>WHAT YOU CAN DO</span>

                    <h2>Everything your team needs, in one place</h2>

                    <p>
                        From the first idea to a growing team, TeamSphere
                        brings student project collaboration together.
                    </p>
                </div>

                <div className="home-feature-grid">
                    {features.map(feature => (
                        <div className="home-feature-item" key={feature.number}>
                            <span className="home-feature-number">
                                {feature.number}
                            </span>

                            <h3>{feature.title}</h3>

                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="home-how-section">

                <div className="home-section-heading">
                    <span>GET STARTED</span>

                    <h2>How TeamSphere works</h2>

                    <p>
                        Four simple steps to turn an idea into a team project.
                    </p>
                </div>

                <div className="home-steps-grid">
                    {steps.map((step, index) => (
                        <div className="home-step" key={step.number}>

                            <div className="home-step-number">
                                {step.number}
                            </div>

                            <h3>{step.title}</h3>

                            <p>{step.description}</p>

                            {index !== steps.length - 1 && (
                                <span className="home-step-arrow">→</span>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Call To Action */}
            <section className="home-cta-section">

                <div>
                    <span>YOUR NEXT PROJECT STARTS HERE</span>

                    <h2>Ready to build something together?</h2>

                    <p>
                        Create your student account, showcase your skills
                        and find people to bring your ideas to life.
                    </p>
                </div>

                <Link to="/register" className="home-primary-button">
                    Create your account →
                </Link>
            </section>

            {/* Footer */}
            <footer className="home-footer">

                <div>
                    <h3>TeamSphere<span>.</span></h3>

                    <p>
                        A student project collaboration and team management platform.
                    </p>
                </div>

                <div className="home-footer-links">
                    <Link to="/projects">Explore Projects</Link>
                    <Link to="/teammates">Find Teammates</Link>
                    <Link to="/my-teams">My Teams</Link>
                </div>

                <div className="home-footer-bottom">
                    © 2026 TeamSphere. All rights reserved.
                </div>

            </footer>
        </div>
    );
}

export default Home;
