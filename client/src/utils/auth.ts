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
  const path = "/api/auth/refresh";
  const refreshResponse = await fetch(path, {
    method: "POST",
    credentials: "include" // sends the httpOnly refresh cookie automatically
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


export function validatePassword(password: string): string | null { // for new users
  if (password.length < 12) {
    return "Password must be at least 12 characters long";
  }
  if (password.length > 64) {
    return "Password must be at most 64 characters long";
  }
  // check against breached-password list here (HIBP k-anonymity API)
  return null;
}