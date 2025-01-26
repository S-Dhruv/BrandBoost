import './App.css'
import CreatorSignup from "./pages/CreatorSignUp";
import CreatorLogin from "./pages/CreatorLogin";
import CreatorDashboard from "./pages/CreatorDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import BusinessSignup from "./pages/BusinessSignup";
import BusinessLogin from "./pages/BusinessLogin";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
function App() {
  const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin") === "true")
  const [userType, setUserType] = useState(localStorage.getItem("role")||"creator")

  const ProtectedRoute1 = ({children}) =>{
    console.log(userType);
    return isLogin === true ? children : <Navigate to="/creator/login" replace />
  }
  const ProtectedRoute2 = ({children}) =>{
    return isLogin === true ? children : <Navigate to="/business/login" replace />
  }
  return (
    <>
    <Router>
      <Routes>
        ({userType === "creator"})?(
          <Route path="/creator/signup" element={<CreatorSignup />} />
          <Route path="/creator/login" element={<CreatorLogin />} />
          <Route path="/creator/dashboard" element={
            <ProtectedRoute1>
            <CreatorDashboard />
            </ProtectedRoute1>
            } />
        ) :(
          <Route path="/business/signup" element={<BusinessSignup />} />
          <Route path="/business/login" element={<BusinessLogin />} />
          <Route path="/business/dashboard" element={
            <ProtectedRoute2>
            <BusinessDashboard />
            </ProtectedRoute2>
            } />
        )   
      </Routes>
    </Router>
    </>
  )
}

export default App
