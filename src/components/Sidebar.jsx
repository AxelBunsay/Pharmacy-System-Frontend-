import React from 'react'
import { NavLink } from 'react-router-dom'

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      'block px-3 py-2 rounded-md mb-1 ' + (isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50')
    }
  >
    {children}
  </NavLink>
)

export default function Sidebar() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Pharmacy Admin</h2>
        <p className="text-sm text-gray-500">Inventory & reports</p>
      </div>
      <nav>
        <NavItem to="/">Dashboard</NavItem>
        <NavItem to="/inventory">Inventory</NavItem>
        <NavItem to="/orders">Orders</NavItem>
        <NavItem to="/suppliers">Suppliers</NavItem>
        <NavItem to="/reports">Reports</NavItem>
      </nav>
      <div className="mt-8 text-xs text-gray-500">Logged in as: admin@pharmacy.local</div>
    </div>
  )
}
