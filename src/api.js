const BASE =
  import.meta.env.VITE_API_URL ||
  "https://teachlim-backend.onrender.com/api";

export async function api(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong. Try again.");
  }

  return data;
}

export const qs = (o) =>
  new URLSearchParams(
    Object.entries(o).filter(([, v]) => v)
  ).toString();
