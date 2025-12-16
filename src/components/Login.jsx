import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { login } from "../api/auth.js";
import { fetchProfile } from "../api/profile";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    login({ username: email, password })
      .then(async (data) => {
        localStorage.setItem("token", data.token);
        return await fetchProfile();
      })
      .then((profile) => {
        localStorage.setItem("profile", JSON.stringify(profile.isAdmin));
        navigate("/dashboard");
      })
      .catch((err) => {
        alert(err.message || "Login failed");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-green-600 to-green-700 p-6 relative font-poppins">
      <div className="absolute w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-30 -top-10 -left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-green-500 rounded-full blur-3xl opacity-30 bottom-0 right-0 animate-pulse"></div>

      <div className="relative bg-white/20 backdrop-blur-xl border border-white/30 p-10 rounded-3xl shadow-2xl max-w-md w-full flex flex-col items-center animate-[fadeIn_1s_ease] font-poppins">
        <img
          src={logo}
          alt="Logo"
          className="h-32 w-32 object-contain drop-shadow-2xl mb-6 animate-[float_3s_ease-in-out_infinite]"
        />

        <h2 className="text-4xl font-extrabold text-white drop-shadow-lg mb-8 tracking-wide">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="flex flex-col">
            <label className="text-white/80 font-semibold mb-1">Email</label>
            <input
              type="username"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-300 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-white/80 font-semibold mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-300 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-600 rounded-xl text-white font-bold text-lg hover:opacity-90 shadow-lg shadow-blue-900/40 transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
