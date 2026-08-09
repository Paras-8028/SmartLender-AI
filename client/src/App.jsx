import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import LoanForm from "./pages/LoanForm";
import EMICalculator from "./pages/EMICalculator";
import Prediction from "./pages/Prediction";
import Admin from "./pages/Admin";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/loan-form"
            element={<LoanForm />}
          />

          <Route
            path="/emi-calculator"
            element={<EMICalculator />}
          />

          <Route
            path="/prediction"
            element={<Prediction />}
          />
        </Route>

        <Route
          element={<ProtectedRoute adminOnly />}
        >
          <Route
            path="/admin"
            element={<Admin />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;