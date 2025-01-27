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
    <div className="min-h-screen flex items-center justify-center bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#FFC971]/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-[#CC5803]/10 rounded-full blur-3xl"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E2711D]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-[#CC5803] mb-8">Creator Login</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <input
                type="email"
                name="mail"
                ref={emailRef}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-md border border-gray-200 focus:outline-none focus:border-[#FF9505] focus:ring-2 focus:ring-[#FF9505]/20 transition-all"
                required
              />
              
              <input
                type="password"
                name="pass"
                ref={passRef}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-md border border-gray-200 focus:outline-none focus:border-[#FF9505] focus:ring-2 focus:ring-[#FF9505]/20 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF9505] to-[#FFB627] hover:from-[#FFB627] hover:to-[#FFC971] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FF9505]/20"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <a href="/creator/signup" className="text-[#FF9505] hover:text-[#FFB627] font-medium transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreatorLogin;