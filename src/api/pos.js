const API_URL = import.meta.env.VITE_API_URL;

export async function checkOutBulk(items) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(${API_URL}/sales/bulk, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Bearer ${token},
    },
    body: JSON.stringify(items),
  });

  if (!res.ok) throw new Error("Fetching suppliers failed");

  return true;
}