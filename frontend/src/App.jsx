import CreateProject from "./pages/CreateProject";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/teammates" element={<Teammates />} />
            <Route path="/my-teams" element={<MyTeams />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/edit-project/:id" element={<EditProject />} />
        </Routes>
    );
}

export default App;
