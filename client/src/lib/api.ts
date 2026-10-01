const API_BASE = "/api";

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("nexus_token");
  const customGeminiKey = localStorage.getItem("nexus_gemini_key");
  const enterpriseApiKey = localStorage.getItem("nexus_api_key");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (enterpriseApiKey) {
    headers["x-api-key"] = enterpriseApiKey;
  }

  if (customGeminiKey) {
    headers["x-gemini-key"] = customGeminiKey;
  }

  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (netErr: any) {
    throw new ApiError(
      `Network connection failed: ${netErr.message || "Cannot reach server"}. Make sure the backend server is running on http://localhost:5005.`,
      0
    );
  }

  // Parse response body safely
  let data: any = {};
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = {};
    }
  } else {
    try {
      const rawText = await response.text();
      // If HTML error from tunnel or proxy (e.g. 503 no tunnel here)
      if (rawText.includes("no tunnel here") || response.status === 503) {
        data = { error: `Tunnel connection dropped (HTTP 503). Please open the direct local URL: http://localhost:5173` };
      } else if (rawText.length < 300) {
        data = { error: rawText.replace(/<[^>]*>/g, "").trim() };
      }
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    let errorMsg = data.error || data.message;
    if (!errorMsg) {
      if (response.status === 409) {
        errorMsg = "An account with this email address already exists. Please switch to Sign In.";
      } else if (response.status === 401) {
        errorMsg = "Invalid email or password. Please verify your credentials.";
      } else if (response.status === 503 || response.status === 502) {
        errorMsg = `Gateway/Tunnel unavailable (HTTP ${response.status}). Access via http://localhost:5173 for 100% stability.`;
      } else {
        errorMsg = `Server returned HTTP ${response.status} (${response.statusText || "Error"})`;
      }
    }

    if (Array.isArray(data.details) && data.details.length > 0) {
      errorMsg = data.details.map((d: any) => d.message || d.field).filter(Boolean).join(". ");
    }
    throw new ApiError(errorMsg, response.status, data.details);
  }

  return data as T;
}
