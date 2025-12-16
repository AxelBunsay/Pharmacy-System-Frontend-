  export function isTokenValid() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      localStorage.removeItem("token");
      return false;
    }
    return true;
  } catch (err) {
    localStorage.removeItem("token");
    return false;
  }
}