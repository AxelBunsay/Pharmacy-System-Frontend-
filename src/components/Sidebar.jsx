import { NavLink } from "react-router-dom";
import { getProfile } from "../api/profile";

const NavItem = ({ to, children, onNavigate }) => (
  <NavLink
    to={to}
    onClick={onNavigate}
    className={({ isActive }) =>
      "block px-2 py-3 rounded-lg transition-colors duration-150 " +
      (isActive
        ? "bg-white/20 text-white font-medium"
        : "text-white hover:bg-white/10")
    }
  >
    {children}
  </NavLink>
);

export default function Sidebar({ onClose }) {
  const isAdmin = getProfile();

  const handleNavigate = () => {
    if (window.innerWidth < 768) {
      onClose?.();
    }
  };

  return (
    <aside className="fixed top-0 left-0 w-[200px] h-screen bg-green-600 px-6 py-6 flex flex-col gap-4 overflow-y-auto pt-[80px] shadow-xl">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b sm:hidden">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              Pharmacy Admin
            </h2>
            <p className="text-sm text-gray-550">Inventory & reports</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 text-white">
          <div className="px-3 space-y-1">
            <NavItem to="/dashboard" onNavigate={handleNavigate}>
              Dashboard
            </NavItem>
            <NavItem to="/inventory" onNavigate={handleNavigate}>
              Inventory
            </NavItem>
            <NavItem to="/pos" onNavigate={handleNavigate}>
              POS
            </NavItem>
            <NavItem to="/suppliers" onNavigate={handleNavigate}>
              Suppliers
            </NavItem>

            {isAdmin && (
              <NavItem to="/reports" onNavigate={handleNavigate}>
                Sales
              </NavItem>
            )}
          </div>
        </nav>

        {/* ✅ Removed logout from sidebar */}
      </div>
    </aside>
  );
}
