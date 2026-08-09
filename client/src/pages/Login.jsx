import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      const data = response.data;

      if (!data.success) {
        alert(data.message || "Login failed.");
        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login successful.");

      if (data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">
        <div className="bg-blue-700 text-white p-8 md:p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold">
            Welcome Back
          </h1>

          <p className="mt-5 text-blue-100 leading-relaxed">
            Login to your SmartLender AI account
            and manage loan applications, EMI
            calculations and AI predictions.
          </p>

          <div className="mt-8 space-y-3 text-blue-100 text-sm">
            <p>✓ AI-powered loan approval</p>
            <p>✓ Explainable AI predictions</p>
            <p>✓ Loan application tracking</p>
            <p>✓ EMI calculation</p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Login
          </h2>

          <p className="text-gray-500 mt-2">
            Sign in to continue
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>

              <div className="flex items-center border border-gray-300 rounded-lg mt-2 px-4 focus-within:ring-2 focus-within:ring-blue-500">
                <FaEnvelope className="text-gray-400" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full p-3 outline-none"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="flex items-center border border-gray-300 rounded-lg mt-2 px-4 focus-within:ring-2 focus-within:ring-blue-500">
                <FaLock className="text-gray-400" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full p-3 outline-none"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="text-gray-500 hover:text-gray-700"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading
                ? "Signing In..."
                : "Login"}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Don't have an account?

            <Link
              to="/signup"
              className="text-blue-600 ml-2 font-semibold hover:text-blue-700"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;