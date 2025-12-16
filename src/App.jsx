import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";
import POS from "./components/POS";
import Suppliers from "./components/Suppliers";
import Reports from "./components/Reports";
import Login from "./components/Login";
import Logout from "./components/LogOut";
import NotFound from "./components/NotFound";
import { isTokenValid } from "./utils/validateToken";

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={handleToggleSidebar} />

      <div className="flex-1 min-h-screen ml-[200px]">
        {/* Topbar */}
        <Topbar onToggle={handleToggleSidebar} />

        {/* Main Content */}
        <main className="p-6 mt-[64px]">{children}</main>
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  return isTokenValid() ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  return isTokenValid() ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* PUBLIC ROUTES */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* PRIVATE ROUTES */}
        <Route
          path="/logout"
          element={
            <PrivateRoute>
              <Logout />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <PrivateRoute>
              <AppLayout>
                <Inventory />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/pos"
          element={
            <PrivateRoute>
              <AppLayout>
                <POS />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/suppliers"
          element={
            <PrivateRoute>
              <AppLayout>
                <Suppliers />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <AppLayout>
                <Reports />
              </AppLayout>
            </PrivateRoute>
          }
        />

        {/* NOT FOUND */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
