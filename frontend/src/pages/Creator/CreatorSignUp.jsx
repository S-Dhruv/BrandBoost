import React, { useRef, useState } from "react";
import ModernNavbar from "../../components/ModernNavbar";
import { useNavigate } from "react-router-dom";

const CreatorSignUp = () => {
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passRef = useRef(null);
  const confirmPassRef = useRef(null);
  const phoneRef = useRef(null);
  const nav = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const username = usernameRef.current.value;
    const password = passRef.current.value;
    const confirmPassword = confirmPassRef.current.value;
    const phone = phoneRef.current.value;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setErrorMessage("");
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Phone:", phone);
    try{
      const response = await fetch("http://localhost:3000/creator/signup", {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username , email, password ,confirmPassword , phone})
      });
  
      const data = await response.json();
      
      
      
      if(data.message === "User successfully created"){
        console.log("User successfully created");
        nav("/creator/login", { replace: true });
      }else{
        console.log("failed")
      }
    }catch(error){
      console.log(error)
    }
      
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-[#081A42] pt-20"> {/* Added pt-20 for spacing */}
      <ModernNavbar />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-[#081A42] via-[#0F3A68] to-transparent"></div>
        <div className="absolute -right-48 top-48 w-96 h-96 bg-[#328AB0]/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -left-48 bottom-48 w-96 h-96 bg-[#42A4E0]/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute left-1/2 top-1/3 -translate-x-1/2 w-96 h-96 bg-[#1D78A0]/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-[#328AB0]/20">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#42A4E0] to-[#1D78A0] text-transparent bg-clip-text">
              Creator Signup
            </h2>
            <p className="mt-2 text-[#081A42]">Sign up to become a Creator</p>
          </div>

          {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="text"
                  name="username"
                  ref={usernameRef}
                  placeholder="Username"
                  className="w-full px-5 py-4 rounded-2xl bg-[#F9FAFB] border-2 border-[#328AB0]/20 text-[#081A42] placeholder-[#A1C6D2] focus:outline-none focus:border-[#42A4E0] transition-all duration-300 group-hover:border-[#42A4E0]/50"
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#42A4E0]/20 to-[#1D78A0]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur"></div>
              </div>

              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  ref={emailRef}
                  placeholder="Email"
                  className="w-full px-5 py-4 rounded-2xl bg-[#F9FAFB] border-2 border-[#328AB0]/20 text-[#081A42] placeholder-[#A1C6D2] focus:outline-none focus:border-[#42A4E0] transition-all duration-300 group-hover:border-[#42A4E0]/50"
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#42A4E0]/20 to-[#1D78A0]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur"></div>
              </div>

              <div className="relative group">
                <input
                  type="password"
                  name="password"
                  ref={passRef}
                  placeholder="Password"
                  className="w-full px-5 py-4 rounded-2xl bg-[#F9FAFB] border-2 border-[#328AB0]/20 text-[#081A42] placeholder-[#A1C6D2] focus:outline-none focus:border-[#42A4E0] transition-all duration-300 group-hover:border-[#42A4E0]/50"
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#42A4E0]/20 to-[#1D78A0]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur"></div>
              </div>

              <div className="relative group">
                <input
                  type="password"
                  name="confirmPassword"
                  ref={confirmPassRef}
                  placeholder="Confirm Password"
                  className="w-full px-5 py-4 rounded-2xl bg-[#F9FAFB] border-2 border-[#328AB0]/20 text-[#081A42] placeholder-[#A1C6D2] focus:outline-none focus:border-[#42A4E0] transition-all duration-300 group-hover:border-[#42A4E0]/50"
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#42A4E0]/20 to-[#1D78A0]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur"></div>
              </div>

              <div className="relative group">
                <input
                  type="tel"
                  name="phone"
                  ref={phoneRef}
                  placeholder="Phone Number"
                  className="w-full px-5 py-4 rounded-2xl bg-[#F9FAFB] border-2 border-[#328AB0]/20 text-[#081A42] placeholder-[#A1C6D2] focus:outline-none focus:border-[#42A4E0] transition-all duration-300 group-hover:border-[#42A4E0]/50"
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#42A4E0]/20 to-[#1D78A0]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur"></div>
              </div>
            </div>

            <button type="submit" className="w-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#42A4E0] to-[#1D78A0] rounded-2xl transition-all duration-300"></div>
              <div className="relative w-full bg-gradient-to-r from-[#42A4E0] to-[#1D78A0] text-white font-semibold py-4 rounded-2xl">
                Sign Up
              </div>
            </button>
          </form>

          <p className="mt-8 text-center text-[#081A42]">
            Already have an account?{" "}
            <a
              href="/creator/login"
              className="text-[#42A4E0] hover:text-[#1D78A0] font-medium transition-colors"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatorSignUp;
