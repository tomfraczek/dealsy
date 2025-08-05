import axios from "axios";

const BASE_URL = "https://dummyjson.com";

// Axios instance with dummyjson.com as the base URL
export const restClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// Simple response interceptor — logs API errors to the console
restClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Error parser — extracts message and status from failed API response
export const getResponseError = (
  error: unknown
): { status: number; message: string } => {
  const defaultError = {
    message: "Unknown error",
    status: 500,
  };

  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response === "object"
  ) {
    const response = (error as any).response;

    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      "status" in response
    ) {
      const data = response.data;
      const status = response.status;

      if ("message" in data && typeof data.message === "string") {
        return { message: data.message, status };
      }
    }
  }

  return defaultError;
};
