import { apiFetch } from "./auth";


export async function fetchBills() { // not being used in useBills anymore
  const url: string = "/api/bills/";
  try {
    const response = await apiFetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error("Request failed");          
    }
    return await response.json();
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Something went wrong");
  }
}