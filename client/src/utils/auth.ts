export function isAuthenticated() {
  return !!localStorage.getItem("token");
}


export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers
    },
  });
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
  }
  return response
}