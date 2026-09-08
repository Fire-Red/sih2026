import { getValidAuthToken } from "@/lib/auth/session";

export interface ProxyResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

export async function proxyFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ProxyResponse<T>> {
  const token = await getValidAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(path, {
      ...options,
      headers,
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const payload = isJson ? await response.json() : null;

    if (!response.ok) {
      return {
        success: false,
        error: payload?.error || `Request failed with status ${response.status}`,
        status: response.status,
      };
    }

    return {
      success: true,
      data: (payload?.data !== undefined ? payload.data : payload) as T,
      status: response.status,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
      status: 500,
    };
  }
}

export const proxy = {
  get: <T = unknown>(path: string, options?: RequestInit) =>
    proxyFetch<T>(path, { ...options, method: "GET" }),

  post: <T = unknown>(path: string, body?: unknown, options?: RequestInit) =>
    proxyFetch<T>(path, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T = unknown>(path: string, body?: unknown, options?: RequestInit) =>
    proxyFetch<T>(path, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T = unknown>(path: string, options?: RequestInit) =>
    proxyFetch<T>(path, { ...options, method: "DELETE" }),
};
