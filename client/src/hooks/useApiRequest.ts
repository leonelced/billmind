import { useState, useCallback } from "react";
import { apiFetch } from "../utils/auth";


export function useApiRequest() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const run = useCallback(async <T,>(path: string, options?: RequestInit): Promise<{ success: boolean; data?: T }> => {
    setLoading(true);
    setError("")
    try {
      const response = await apiFetch(path, options);
      const text = await response.text();
      const parsed = text ? JSON.parse(text) : undefined;
      if (!response.ok) {
        throw new Error(parsed?.message || "Request failed");
      }
      return { success: true, data: parsed as T };
    } catch(err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      return { success: false};
    } finally {
      setLoading(false);
    }
  }, []);

  return { run, loading, error };
}