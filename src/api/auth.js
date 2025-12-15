const API_URL = import.meta.env.VITE_API_URL;
export async function login({ username, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Login failed");

  return res.json();
}