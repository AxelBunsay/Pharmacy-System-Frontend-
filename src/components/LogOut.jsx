import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("profile");

    // Redirect to login page
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-green-600 to-green-700 p-6 font-poppins">
      <div className="relative bg-white/20 backdrop-blur-xl border border-white/30 p-10 rounded-3xl shadow-2xl max-w-md w-full flex flex-col items-center animate-[fadeIn_1s_ease]">
        <img
          src={logo}
          alt="Logo"
          className="h-24 w-24 object-contain drop-shadow-2xl mb-6 animate-[float_3s_ease-in-out_infinite]"
        />

        <h2 className="text-3xl font-extrabold text-white drop-shadow-lg mb-4">
          Logging Out
        </h2>

        <p className="text-white/80 text-center">
          You are being securely logged out...
        </p>
      </div>
    </div>
  );
}
