const API_URL = process.env.REACT_APP_API_URL;

export async function getSuppliers() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(`${API_URL}/suppliers/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Fetching suppliers failed");

  return res.json();
}

export async function addSupplier(supplier) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(${API_URL}/suppliers/, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Bearer ${token},
    },
    body: JSON.stringify(supplier),
  });

  if (!res.ok) throw new Error("Adding supplier failed");

  return res.json();
}

export async function deleteSupplier(supplierId) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(${API_URL}/suppliers/${supplierId}, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: Bearer ${token},
    },
  });

  if (!res.ok) throw new Error("Deleting supplier failed");

  return true;
}