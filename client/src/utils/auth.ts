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
    return await refreshFetch(url, options);
  }
  return response;
}


async function refreshFetch(url: string, options: RequestInit = {}) {
  const refreshToken = localStorage.getItem("refreshToken");
  const path = "/api/auth/refresh";
  const refreshResponse = await fetch(path, {
    method: "POST",
    headers: { 'Authorization': `Bearer ${refreshToken}`, },
  });
  if (refreshResponse.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    throw new Error("Session expired");
  }
  const data = await refreshResponse.json();
  localStorage.setItem('token', data.token);
  return await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${data.token}`,
      ...options.headers
    },
  });
}