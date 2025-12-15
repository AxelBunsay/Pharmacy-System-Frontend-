const API_URL = import.meta.env.VITE_API_URL;

export async function fetchReportsDaily(date, page = 1) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(${API_URL}/sales/daily/${date}?page=${page}, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: Bearer ${token},
    },
  });

  if (!res.ok) throw new Error("Failed to fetch daily reports.");

  return res.json();
}
export async function fetchReportsWeekly(page = 1) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(${API_URL}/sales/weekly?page=${page}, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: Bearer ${token},
    },
  });

  if (!res.ok) throw new Error("Failed to fetch weekly reports.");

  return res.json();
}

export async function fetchReportsMonthly(month, year, page = 1) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(
    ${API_URL}/sales/monthly/${month}/${year}?page=${page},
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Bearer ${token},
      },
    },
  );

  if (!res.ok) throw new Error("Failed to fetch monthly reports.");

  return res.json();
}