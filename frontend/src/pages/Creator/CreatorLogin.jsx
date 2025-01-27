import React from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatorLogin = () => {
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passRef.current.value;
    const response = await fetch("http://localhost:3000/creator/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json();
    if (data.message === "Login successful") {
      console.log("Login Success");
      const role = data.role;
      console.log(role);
      localStorage.setItem("role", role);
      localStorage.setItem("isLogin", true);
      nav("/creator/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#CC5803] via-[#E2711D] to-[#FF9505] p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#CC5803] mb-8">Creator Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              name="mail"
              ref={emailRef}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#FF9505] focus:ring-2 focus:ring-[#FF9505]/20 transition-all"
              required
            />
            
            <input
              type="password"
              name="pass"
              ref={passRef}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#FF9505] focus:ring-2 focus:ring-[#FF9505]/20 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF9505] hover:bg-[#FFB627] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <a href="/creator/signup" className="text-[#FF9505] hover:text-[#FFB627] font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default CreatorLogin;