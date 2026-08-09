import { useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch (error) {
    console.error(
      "Invalid user data:",
      error
    );
    localStorage.removeItem("user");
  }

  const isAdmin = user?.role === "admin";

  const navItemClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600 transition";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-700"
        >
          SmartLender AI
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink
            to="/"
            className={navItemClass}
          >
            Home
          </NavLink>

          {token && (
            <>
              <NavLink
                to="/loan-form"
                className={navItemClass}
              >
                Apply Loan
              </NavLink>

              <NavLink
                to="/emi-calculator"
                className={navItemClass}
              >
                EMI Calculator
              </NavLink>

              <NavLink
                to="/dashboard"
                className={navItemClass}
              >
                Dashboard
              </NavLink>

              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={navItemClass}
                >
                  Admin
                </NavLink>
              )}
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!token ? (
            <>
              <Link
                to="/login"
                className="border border-blue-600 text-blue-600 px-5 py-2 rounded-lg hover:bg-blue-50 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>

        <button
          type="button"
          className="md:hidden text-3xl text-gray-700"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="flex flex-col p-4 gap-4">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={navItemClass}
            >
              Home
            </NavLink>

            {token ? (
              <>
                <NavLink
                  to="/loan-form"
                  onClick={closeMenu}
                  className={navItemClass}
                >
                  Apply Loan
                </NavLink>

                <NavLink
                  to="/emi-calculator"
                  onClick={closeMenu}
                  className={navItemClass}
                >
                  EMI Calculator
                </NavLink>

                <NavLink
                  to="/dashboard"
                  onClick={closeMenu}
                  className={navItemClass}
                >
                  Dashboard
                </NavLink>

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={closeMenu}
                    className={navItemClass}
                  >
                    Admin
                  </NavLink>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="text-center border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;