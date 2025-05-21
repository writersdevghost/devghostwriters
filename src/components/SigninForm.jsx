import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase-config";

const SigninForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Successfully signed in!");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90 backdrop-blur-md z-50">
        <div className="code-loader">
          <span>{"{"}</span>
          <span className="text-cyan-400">"loading"</span>
          <span>:</span>
          <span className="text-green-400">"DevGhostWriters"</span>
          <span>{"}"}</span>
        </div>
        <div className="mt-4 text-base text-cyan-300">
          Initializing AI Development Environment...
        </div>
        <div className="code-typing mt-8 text-sm text-left w-64 h-24 overflow-hidden">
          <div>npm install dependencies...</div>
          <div>configuring environment...</div>
          <div>initializing AI modules...</div>
          <div>loading development tools...</div>
          <div>preparing workspace...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto p-8 relative">
      <div className="relative backdrop-blur-lg bg-white bg-opacity-10 p-8 rounded-xl shadow-2xl border border-white border-opacity-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent opacity-10"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-cyan-400 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-cyan-400 opacity-20 blur-3xl"></div>

        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Welcome Back
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 text-center text-white text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30 text-center text-white text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm text-gray-300 ml-1">Email</label>
            <input
              type="email"
              className={`w-full px-4 py-3 rounded-lg bg-gray-800 bg-opacity-50 border ${
                errors.email ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:border-cyan-400 transition-colors`}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-300 ml-1">Password</label>
            <input
              type="password"
              className={`w-full px-4 py-3 rounded-lg bg-gray-800 bg-opacity-50 border ${
                errors.password ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:border-cyan-400 transition-colors`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 py-3 px-4 rounded-lg text-white font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Don't have an account?
          <a href="/signup" className="ml-2 text-cyan-400 hover:text-cyan-300">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SigninForm;
