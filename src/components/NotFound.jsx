import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Page not found</p>
      <Link
        to="/dashboard"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}