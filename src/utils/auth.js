// src/utils/auth.js
// Utility functions for authentication

/**
 * Check if user is authenticated based on localStorage
 * This is useful for SSR or when Firebase auth state isn't immediately available
 */
export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const userData = localStorage.getItem("user");
    return !!userData;
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
};

/**
 * Redirect to sign-in page if not authenticated
 * Returns true if auth check was successful (user is authenticated)
 * Returns false if auth check failed (user is not authenticated and was redirected)
 */
export const checkAuthAndRedirect = () => {
  const authenticated = isAuthenticated();

  if (!authenticated && typeof window !== "undefined") {
    window.location.href = "/signin";
    return false;
  }

  return authenticated;
};

/**
 * Get current user data from localStorage
 * Returns null if no user is found
 */
export const getCurrentUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
