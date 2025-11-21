import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddProject from "./pages/AddProject";
import ProjectDetails from "./pages/ProjectDetails";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Feedback from "./pages/Feedback";

function App(){
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/add" element={<AddProject />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
