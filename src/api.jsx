import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login if needed
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Handle other errors
    if (error.response?.status === 422) {
      console.error("Validation error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

// Logout function
export const logout = async () => {
  try {
    // Call the logout endpoint
    await api.delete("/users/sign_out");

    // Clear localStorage regardless of response
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    // Even if the API call fails, clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    console.error("Logout error:", error);
    return {
      success: false,
      message: error.response?.data?.error || "Logout failed",
    };
  }
};

export default api;
