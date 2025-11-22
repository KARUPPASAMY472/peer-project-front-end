import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Navbar() {
  const navigate = useNavigate();
  const [log, setLog] = useState(false);
  const [open, setOpen] = useState(false); // <-- NEW STATE

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setLog(!!user);
    });
  }, []);

  const logout = () => {
    signOut(auth);
  };

  return (
    <>
      {/* MAIN NAVBAR */}
      <nav className="px-4 sm:px-6 py-4 bg-white shadow-md flex justify-between items-center">
        {/* Logo */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-700">
          Peer Project
        </h2>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center space-x-6">

          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </Link>

          <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
            Profile
          </Link>

          <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">
            About
          </Link>

          <Link to="/feedback" className="text-gray-700 hover:text-blue-600 font-medium">
            Feedback
          </Link>

          {log ? (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden">
          <button
            onClick={() => setOpen(!open)} // <-- TOGGLE MENU
            className="text-gray-700 text-2xl"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN MENU */}
      {open && (
        <div className="sm:hidden bg-white shadow-md px-4 py-4 space-y-4">

          <Link
            to="/"
            className="block text-gray-700 font-medium"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/profile"
            className="block text-gray-700 font-medium"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>

          <Link
            to="/about"
            className="block text-gray-700 font-medium"
            onClick={() => setOpen(false)}
          >
            About
          </Link>

          <Link
            to="/feedback"
            className="block text-gray-700 font-medium"
            onClick={() => setOpen(false)}
          >
            Feedback
          </Link>

          {log ? (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Login
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;
