import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Topbar({ onToggle }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate("/logout");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-blue-400 px-6 py-3 shadow-lg rounded-b-lg">
      <div className="flex items-center justify-between w-full">
        {/* LEFT SIDE: Sidebar toggle + Logo + Text */}
        <div className="flex items-center">
          <button
            onClick={onToggle}
            className="sm:hidden p-2 rounded-md hover:bg-blue-500/20 focus:outline-none mr-3"
            aria-label="Toggle sidebar"
          >
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-lg font-bold font-poppins text-white">
              Marquez Pharmacy
            </h1>
          </div>
        </div>

        {/* RIGHT SIDE: Profile + Sign Out */}
        

          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-medium font-poppins"
          >
            Sign out
          </button>
        </div>
    
    </header>
  );
}