import { auth } from "../../../firebase";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const customBackEndFetch = async (
  url: string,
  method: string,
  body?: any
) => {
  try {
    const result = await fetch(`${baseUrl}/${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!result.ok) {
      const error = await result.json();
      throw new Error(error.message || "Request failed");
    }

    return await result.json();
  } catch (error) {
    console.error("customBackEndFetch error:", error);
    throw error;
  }
};

export const customTokenFreeFetch = async (
  url: string,
  method: string,
  body: any
) => {
  try {
    const result = await fetch(`${baseUrl}/${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!result.ok) {
      const error = await result.json();
      console.error("customTokenFreeFetch error response:", error);

      const message =
        typeof error === "object"
          ? JSON.stringify(error)
          : error?.message || "Request failed";

      throw new Error(message);
    }

    return await result.json();
  } catch (error) {
    console.error("customTokenFreeFetch error:", error);
    throw error;
  }
};

export const customAuthFetch = async (
  url: string,
  method: string,
  token: string,
  body?: any,
  retry = true
): Promise<any> => {
  try {
    const response = await fetch(`${baseUrl}/${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      if (response.status === 401 && retry) {
        console.warn("Token expired. Attempting to refresh...");

        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("No authenticated user found.");

        const newToken = await currentUser.getIdToken(true);

        // Optionally store token in localStorage or cookie
        localStorage.setItem("AUTH_TOKEN", newToken);

        return customAuthFetch(url, method, newToken, body, false);
      }

      const error = await response.json();
      const message =
        typeof error === "object"
          ? JSON.stringify(error)
          : error?.message || "Request failed";

      throw new Error(message);
    }

    return await response.json();
  } catch (error: any) {
    console.error("customAuthFetch error:", error.message);
    throw error;
  }
};

export async function getToken(): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  } catch (err) {
    console.error("getToken error:", err);
    return null;
  }
}
