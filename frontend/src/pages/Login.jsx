import React from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBriefcase, FaUserAstronaut } from 'react-icons/fa';
import ModernNavbar from '../components/ModernNavbar';

const Login = () => {
  const navigate = useNavigate();
  const handleBusinessLogin = () => {
    navigate('/business/login');
  };
  const handleCreatorLogin = () => {
    navigate('/creator/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#081A42] pt-20">
      <ModernNavbar />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-[#081A42] via-[#0F3A68] to-transparent"></div>
        <div className="absolute -right-48 top-48 w-96 h-96 bg-[#328AB0]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -left-48 bottom-48 w-96 h-96 bg-[#42A4E0]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-96 h-96 bg-[#1D78A0]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-lg border border-[#328AB0]/20"
        >
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-[#42A4E0] to-[#1D78A0] text-transparent bg-clip-text mb-8">
            Welcome to BrandBoost
          </h2>
          <p className="text-center text-[#081A42] mb-8">Choose your account type to continue</p>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBusinessLogin}
              className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-[#42A4E0] to-[#1D78A0] text-white p-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#328AB0]/20"
            >
              <FaBriefcase className="text-xl" />
              <span className="font-semibold">Business Account</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity"></div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreatorLogin}
              className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-[#328AB0] to-[#0F3A68] text-white p-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#328AB0]/20"
            >
              <FaUserAstronaut className="text-xl" />
              <span className="font-semibold">Creator Account</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity"></div>
            </motion.button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[#A1C6D2]">
              New to BrandBoost?{' '}
              <a href="/" className="text-[#42A4E0] hover:text-[#1D78A0] font-medium transition-colors">
                Learn more
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;