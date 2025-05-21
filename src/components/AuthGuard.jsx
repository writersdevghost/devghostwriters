import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

// AuthGuard component to protect routes
const AuthGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication state on component mount
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setAuthenticated(true);
      } else {
        // User is signed out, redirect to signin page
        window.location.href = "/signin";
      }
      setLoading(false);
    });

    // Handle the case where Firebase might not initialize fast enough
    const checkLocalAuth = () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          // No user data in localStorage, redirect
          window.location.href = "/signin";
        }
      } catch (error) {
        console.error("Error checking local auth:", error);
        // On error, redirect to be safe
        window.location.href = "/signin";
      }
    };

    // If Firebase auth doesn't respond quickly, use localStorage as fallback
    const timeoutId = setTimeout(() => {
      if (loading) {
        checkLocalAuth();
      }
    }, 1000);

    // Cleanup
    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="code-loader">
            <span>{"{"}</span>
            <span className="text-cyan-400">"loading"</span>
            <span>:</span>
            <span className="text-green-400">"authentication"</span>
            <span>{"}"}</span>
          </div>
          <p className="mt-4 text-cyan-300">Verifying your credentials...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render children components
  return authenticated ? <>{children}</> : null;
};

export default AuthGuard;
