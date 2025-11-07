import React from 'react'
import { NavLink } from 'react-router-dom'

const NavItem = ({ to, children, onNavigate }) => (
  <NavLink
    to={to}
    onClick={onNavigate}
    className={({ isActive }) =>
      'block px-4 py-3 rounded-lg transition-colors duration-150 ' + 
      (isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100')
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
    <div className="h-full flex flex-col bg-white">
      {/* Mobile header with close button */}
        <div className="flex items-center justify-between p-4 border-b sm:hidden">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Pharmacy Admin</h2>
          <p className="text-sm text-gray-500">Inventory & reports</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
  </div>

      {/* Desktop header */}
        <div className="hidden md:flex md:flex-col p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">Pharmacy Admin</h2>
        <p className="text-sm text-gray-500">Inventory & reports</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavItem to="/" onNavigate={handleNavigate}>Dashboard</NavItem>
        <NavItem to="/inventory" onNavigate={handleNavigate}>Inventory</NavItem>
        <NavItem to="/orders" onNavigate={handleNavigate}>Orders</NavItem>
        <NavItem to="/suppliers" onNavigate={handleNavigate}>Suppliers</NavItem>
        <NavItem to="/reports" onNavigate={handleNavigate}>Reports</NavItem>
      </nav>

      {/* User info footer */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@pharmacy.local</p>
          </div>
        </div>
      </div>
    </div>
  )
}

