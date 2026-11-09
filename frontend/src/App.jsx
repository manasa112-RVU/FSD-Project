import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import Projects from "./pages/Projects";
import Teammates from "./pages/Teammates";
import MyTeams from "./pages/MyTeams";
import EditProfile from "./pages/EditProfile";
import EditProject from "./pages/EditProject";

import "./App.css";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Projects */}
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/edit-project/:id" element={<EditProject />} />

            {/* Team Management */}
            <Route path="/teammates" element={<Teammates />} />
            <Route path="/my-teams" element={<MyTeams />} />

            {/* Profile */}
            <Route path="/profile" element={<EditProfile />} />
            <Route path="/edit-profile" element={<EditProfile />} />

            {/* Fallback */}
            <Route
                path="*"
                element={<h2 style={{ textAlign: "center", marginTop: "50px" }}>404 - Page Not Found</h2>}
            />
        </Routes>
    );
}

export default App;
