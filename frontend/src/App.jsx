import "./App.css";
import LandingPage from "./pages/LandingPage";
import CreatorSignup from "./pages/Creator/CreatorSignUp";
import CreatorLogin from "./pages/Creator/CreatorLogin";
import CreatorDashboard from "./pages/Creator/CreatorDashboard";
import BusinessDashboard from "./pages/Business/BusinessDashboard";
import BusinessSignup from "./pages/Business/BusinessSignUp";
import BusinessLogin from "./pages/Business/BusinessLogin";
import { useState } from "react";
import BusinessJobs from "./pages/Business/Jobs";
import BusinessRequests from "./pages/Business/Requests";
import BusinessOngoing from "./pages/Business/Ongoing";
import BusinessPosts from "./pages/Business/Posts";

import CreatorJobs from "./pages/Creator/Jobs";
import CreatorRequests from "./pages/Creator/Requests";
import CreatorOngoing from "./pages/Creator/OngoingNew";
import CreatorPosts from "./pages/Creator/Posts";
import BusinessWorkspace from "./pages/Business/BusinessWorkspace.jsx"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CreatorWorkspace from "./pages/Creator/CreatorWorkspace.jsx";
function App() {
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("isLogin") === "true"
  );
  const [userType, setUserType] = useState(localStorage.getItem("role") || "");

  const ProtectedRoute1 = ({ children }) => {
    console.log(userType);
    return isLogin === true && userType === "creator" ? (
      children
    ) : (
      <Navigate to="/creator/login" replace />
    );
  };
  const ProtectedRoute2 = ({ children }) => {
    return isLogin === true && userType === "business" ? (
      children
    ) : (
      <Navigate to="/business/login" replace />
    );
  };
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />({userType === "creator"}
          )?(
          <Route path="/creator/signup" element={<CreatorSignup />} />
          <Route path="/creator/login" element={<CreatorLogin />} />
          <Route
            path="/creator/dashboard"
            element={
              <ProtectedRoute1>
                <CreatorDashboard />
              </ProtectedRoute1>
            }
          />
          <Route
            path="/creator/dashboard/jobs"
            element={
              <ProtectedRoute1>
                <CreatorJobs />
              </ProtectedRoute1>
            }
          />
          <Route
            path="/creator/dashboard/requests"
            element={
              <ProtectedRoute1>
                <CreatorRequests />
              </ProtectedRoute1>
            }
          />
          <Route
            path="/creator/dashboard/ongoing"
            element={
              <ProtectedRoute1>
                <CreatorOngoing />
              </ProtectedRoute1>
            }
          />
          <Route
            path="/creator/dashboard/ongoing/workspace"
            element={
              <ProtectedRoute1>
                <CreatorWorkspace />
              </ProtectedRoute1>
            }
          />
          <Route
            path="/creator/dashboard/post"
            element={
              <ProtectedRoute1>
                <CreatorPosts />
              </ProtectedRoute1>
            }
          />
          <Route path="*" element={<div>Page Not Found</div>} />
          ) :(
          <Route path="/business/signup" element={<BusinessSignup />} />
          <Route path="/business/login" element={<BusinessLogin />} />
          <Route
            path="/business/dashboard"
            element={
              <ProtectedRoute2>
                <BusinessDashboard />
              </ProtectedRoute2>
            }
          />
          <Route
            path="/business/dashboard/jobs"
            element={
              <ProtectedRoute2>
                <BusinessJobs />
              </ProtectedRoute2>
            }
          />
          <Route
            path="/business/dashboard/requests"
            element={
              <ProtectedRoute2>
                <BusinessRequests />
              </ProtectedRoute2>
            }
          />
          <Route
            path="/business/dashboard/ongoing"
            element={
              <ProtectedRoute2>
                <BusinessOngoing />
              </ProtectedRoute2>
            }
          />
          <Route
            path="/business/dashboard/ongoing/workspace"
            element={
              <ProtectedRoute2>
                <BusinessWorkspace />
              </ProtectedRoute2>
            }
          />
          
          <Route
            path="/business/dashboard/post"
            element={
              <ProtectedRoute2>
                <BusinessPosts />
              </ProtectedRoute2>
            }
          />
          <Route path="*" element={<div>Page Not Found</div>} />)
        </Routes>
      </Router>
    </>
  );
}

export default App;
