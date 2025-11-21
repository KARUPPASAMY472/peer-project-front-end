import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Navbar() {
  const navigate = useNavigate();
  const [log, setLog] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setLog(!!user);
      console.log(user ? "user login" : "user not login");
    });
  }, []);

  const logout = () => {
    signOut(auth);
  };

  return (
    <nav className="py-4 px-6 bg-white shadow-md flex justify-between items-center">
      {/* Logo */}
      <h2 className="text-2xl font-bold text-slate-600">Peer Project</h2>

      {/* Links */}
      <div className="flex items-center space-x-6">

        <Link
          to="/"
          className="text-gray-700 hover:text-blue-600 font-medium transition"
        >
          Home
        </Link>

        <Link
          to="/profile"
          className="text-gray-700 hover:text-blue-600 font-medium transition"
        >
          Profile
        </Link>

        <Link
          to="/about"
          className="text-gray-700 hover:text-blue-600 font-medium transition">
          About
        </Link>

        
        <Link
          to="/feedback"
          className="text-gray-700 hover:text-blue-600 font-medium transition">
          FeedBack
        </Link>

        {/* Login / Logout */}
        {log ? (
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:text-black hover:bg-red-300 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
