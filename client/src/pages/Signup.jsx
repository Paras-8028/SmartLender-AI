import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import api from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const getPasswordStrength = (password) => {
    if (password.length < 6) {
      return {
        text: "Weak",
        color: "bg-red-500",
        width: "w-1/4",
      };
    }

    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password)
    ) {
      return {
        text: "Strong",
        color: "bg-green-500",
        width: "w-full",
      };
    }

    return {
      text: "Medium",
      color: "bg-yellow-500",
      width: "w-2/3",
    };
  };

  const strength = getPasswordStrength(
    formData.password
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (
      !name ||
      !email ||
      !phone ||
      !formData.password
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      alert(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    if (!formData.acceptTerms) {
      alert(
        "Please accept the Terms & Conditions."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/register",
        {
          name,
          email,
          phone,
          password: formData.password,
        }
      );

      const data = response.data;

      if (!data.success) {
        alert(
          data.message || "Signup failed."
        );
        return;
      }

      alert(
        "Account created successfully. Please login."
      );

      navigate("/login");
    } catch (error) {
      console.error(
        "Signup Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">
        <div className="bg-blue-700 text-white p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold">
            Join SmartLender AI
          </h1>

          <p className="mt-5 text-blue-100 leading-7">
            Create your account to apply for
            loans, calculate EMI, receive
            AI-powered loan approval predictions
            and monitor your financial health.
          </p>

          <div className="mt-10">
            <img
              src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=700"
              alt="SmartLender AI"
              className="rounded-xl shadow-lg w-full"
            />
          </div>
        </div>

        <div className="p-8 md:p-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Create Account
          </h2>

          <p className="text-gray-500 mt-2">
            Fill your information below
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="block font-medium text-gray-700">
                Full Name
              </label>

              <div className="flex items-center border border-gray-300 rounded-lg mt-2 px-4 focus-within:ring-2 focus-within:ring-blue-500">
                <FaUser className="text-gray-400" />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 outline-none"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Email
              </label>

              <div className="flex items-center border border-gray-300 rounded-lg mt-2 px-4 focus-within:ring-2 focus-within:ring-blue-500">
                <FaEnvelope className="text-gray-400" />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 outline-none"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Phone Number
              </label>

              <div className="flex items-center border border-gray-300 rounded-lg mt-2 px-4 focus-within:ring-2 focus-within:ring-blue-500">
                <FaPhone className="text-gray-400" />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 outline-none"
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700">
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
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 outline-none"
                  autoComplete="new-password"
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

              {formData.password && (
                <>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${strength.color} ${strength.width}`}
                    />
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    Password Strength:
                    <span className="font-semibold ml-1">
                      {strength.text}
                    </span>
                  </p>
                </>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Confirm Password
              </label>

              <div className="flex items-center border border-gray-300 rounded-lg mt-2 px-4 focus-within:ring-2 focus-within:ring-blue-500">
                <FaLock className="text-gray-400" />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 outline-none"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  className="text-gray-500 hover:text-gray-700"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4"
              />

              <span className="text-sm text-gray-600">
                I agree to the Terms & Conditions
                and Privacy Policy.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Already have an account?

            <Link
              to="/login"
              className="text-blue-600 ml-2 font-semibold hover:text-blue-700"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;