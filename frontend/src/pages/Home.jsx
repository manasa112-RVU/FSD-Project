
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
    return (
        <div>
            <Navbar />

            <section className="hero">
                <div className="hero-content">

                    <p className="tagline">
                        COLLABORATE • CREATE • ACHIEVE
                    </p>

                    <h1>
                        Great Projects Begin
                        <br />
                        With Great <span>Teams.</span>
                    </h1>

                    <p className="hero-description">
                        Find talented students, build amazing projects,
                        share ideas and turn your creativity into reality.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/register" className="primary-btn">
                            Get Started →
                        </Link>

                        <Link to="/login" className="secondary-btn">
                            Login
                        </Link>
                    </div>
                </div>

                <div className="hero-card">
                    <div className="card-icon">🚀</div>
                    <h2>Build Together</h2>
                    <p>
                        Connect with students who share your interests
                        and create something meaningful.
                    </p>

                    <div className="mini-stats">
                        <div>
                            <h3>01</h3>
                            <p>Find Teammates</p>
                        </div>

                        <div>
                            <h3>02</h3>
                            <p>Build Projects</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features" id="features">
                <h2>Everything You Need to Collaborate</h2>

                <p className="features-subtitle">
                    One platform to manage your academic projects.
                </p>

                <div className="feature-grid">

                    <div className="feature-card">
                        <div className="feature-icon">👥</div>
                        <h3>Find Teammates</h3>
                        <p>
                            Discover students based on their skills
                            and interests.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">💡</div>
                        <h3>Create Projects</h3>
                        <p>
                            Share project ideas and bring your
                            academic ideas to life.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📋</div>
                        <h3>Manage Tasks</h3>
                        <p>
                            Assign tasks and keep track of your
                            team's activities.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Track Progress</h3>
                        <p>
                            Monitor project progress and
                            celebrate completed work.
                        </p>
                    </div>

                </div>
            </section>

            <footer>
                <h3>TeamSphere.</h3>
                <p>Bringing student ideas and talented teams together.</p>
                <p>© 2026 TeamSphere. All rights reserved.</p>
            </footer>

        </div>
    );
}

export default Home;
