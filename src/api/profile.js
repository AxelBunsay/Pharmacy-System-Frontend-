const API_URL = import.meta.env.VITE_API_URL;

export async function fetchProfile() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(${API_URL}/profile/, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: Bearer ${token},
    },
  });

  return res.json();
}

export function getProfile() {
  const profile = localStorage.getItem("profile");
  if (!profile) throw new Error("No profile found. Please log in.");

  return profile === "true";
}