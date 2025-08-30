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
      // Don't redirect if this is a login attempt failure
      const isLoginAttempt = error.config?.url?.includes("/users/sign_in");

      if (!isLoginAttempt) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirect to login if needed (only if not already on login page and not a login attempt)
        if (
          window.location.pathname !== "/" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/";
        }
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

// Update user profile function
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.patch(`/users/${userId}`, {
      user: userData,
    });

    // Update user in localStorage if the update was successful
    if (response.data.data) {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser) {
        currentUser.data = response.data.data;
        localStorage.setItem("user", JSON.stringify(currentUser));
      }
    }

    return {
      success: true,
      message: response.data.message,
      user: response.data.data,
    };
  } catch (error) {
    console.error("Update user error:", error);
    return {
      success: false,
      message: error.response?.data?.error || "Failed to update profile",
      errors: error.response?.data?.errors || {},
    };
  }
};

export default api;
