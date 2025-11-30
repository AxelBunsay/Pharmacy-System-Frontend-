import React from 'react'
import { Link, useLocation } from "react-router-dom"
import { NavLink } from "react-router-dom";

const NavItem = ({ to, children, onNavigate }) => (
  <NavLink
    to={to}
    onClick={onNavigate}
    className={({ isActive }) =>
      'block px-4 py-3 rounded-lg transition-colors duration-150 ' + 
      (isActive ? 'bg-white/20 text-white font-medium' : 'text-white hover:bg-white/10')
    }
  >
    {children}
  </NavLink>
)

export default function Sidebar({ onClose }) {
  // Handle navigation - closes sidebar on mobile and small tablets
  const handleNavigate = () => {
    // Close sidebar on screens smaller than md breakpoint (768px)
    if (window.innerWidth < 768) {
      onClose?.();
    }
  };

  return (
  <aside className="fixed top-0 left-0 w-[240px] h-screen bg-red-600 px-6 py-6 flex flex-col gap-4 overflow-y-auto pt-[80px]">
      <div className="flex flex-col h-full">
        {/* Mobile header with close button */}
        <div className="flex items-center justify-between p-4 border-b sm:hidden">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Pharmacy Admin</h2>
            <p className="text-sm text-gray-500">Inventory & reports</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Navigation with scroll */}
        <nav className="flex-1 overflow-y-auto py-4 text-white">
          <div className="px-3 space-y-1">
            <NavItem to="/dashboard" onNavigate={handleNavigate}>Dashboard</NavItem>
            <NavItem to="/inventory" onNavigate={handleNavigate}>Inventory</NavItem>
            <NavItem to="/POS" onNavigate={handleNavigate}>POS</NavItem>
            <NavItem to="/suppliers" onNavigate={handleNavigate}>Suppliers</NavItem>
            <NavItem to="/reports" onNavigate={handleNavigate}>Reports</NavItem>
          </div>
        </nav>
      </div>

      {/* User info footer - fixed at bottom */}
      <div className="shrink-0 bg-red-600 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-sm font-medium text-white items-center">A</span>
          </div>
           <button
            onClick={() => window.location.href = "/Login"}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-medium"
          >Sign out</button>
         </div>
      </div>
    </aside>
  )
}

