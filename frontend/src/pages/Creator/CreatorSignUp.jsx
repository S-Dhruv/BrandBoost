import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import ModernNavbar from '../../components/ModernNavbar';



const CreatorSignUp = () => {
  
  const emailRef = useRef(null);  // To access the email input
  const usernameRef = useRef(null);  // To access the username input
  const passRef = useRef(null);   // To access the password input
  const confirmPassRef = useRef(null);   // To access the confirm password input
  const phoneRef = useRef(null);   // To access the phone input

 
  const [errorMessage, setErrorMessage] = useState();  // To handle errors (e.g., password mismatch)

  const handleSignup = (e) => {
    e.preventDefault();  // Prevent form from reloading the page

    const email = emailRef.current.value;
    const username = usernameRef.current.value;
    const password = passRef.current.value;
    const confirmPassword = confirmPassRef.current.value;
    const phone = phoneRef.current.value;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setErrorMessage("");  // Clear error message if passwords match

    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Phone:", phone);

    // Add your signup logic here (e.g., API request)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      {/* Background Elements */}
      <ModernNavbar/>
      <div className="absolute inset-0 overflow-hidden m-4">
      
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#FFC971]/10 rounded-full blur-3xl"></div>
        
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-[#CC5803]/10 rounded-full blur-3xl"></div>
        
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E2711D]/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
      
      
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-[#CC5803] mb-8">Creator Signup</h2>

          {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>} {/* Display error message */}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                name="username"
                ref={usernameRef}
                placeholder="Username"
                className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-md border border-gray-200 focus:outline-none focus:border-[#FF9505] focus:ring-2 focus:ring-[#FF9505]/20 transition-all"
                required
              />

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

              <input
                type="password"
                name="confirmpass"
                ref={confirmPassRef}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-md border border-gray-200 focus:outline-none focus:border-[#FF9505] focus:ring-2 focus:ring-[#FF9505]/20 transition-all"
                required
              />

              <input
                type="tel"
                name="phone"
                ref={phoneRef}
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-md border border-gray-200 focus:outline-none focus:border-[#FF9505] focus:ring-2 focus:ring-[#FF9505]/20 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#CC5803] to-[#E2711D] hover:from-[#E2711D] hover:to-[#FF9505] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#CC5803]/20"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
  

export default CreatorSignUp