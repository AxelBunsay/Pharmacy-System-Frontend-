const API_URL = import.meta.env.VITE_API_URL;

export async function getProducts(page = 1) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(${API_URL}/products?page=${page}, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: Bearer ${token},
    },
  });

  if (!res.ok) throw new Error("Fetching suppliers failed");

  return res.json();
}

export async function addProduct(product) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(${API_URL}/products/, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Bearer ${token},
    },
    body: JSON.stringify(product),
  });

  if (!res.ok) throw new Error("Adding product failed");

  return res.json();
}

export async function updateProduct(id, product) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(${API_URL}/products/${id}/, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: Bearer ${token},
    },
    body: JSON.stringify(product),
  });

  if (!res.ok) throw new Error("Updating product failed");

  return res.json();
}

export async function deleteProduct(id) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(${API_URL}/products/${id}/, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: Bearer ${token},
    },
  });

  if (!res.ok) throw new Error("Deleting product failed");

  return true;
}