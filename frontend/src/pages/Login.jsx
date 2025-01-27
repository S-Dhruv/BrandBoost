import React from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBriefcase, FaUserAstronaut } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const handleBusinessLogin = () => {
    navigate('/business/login');
  };
  const handleCreatorLogin = () => {
    navigate('/creator/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      {/* App Bar */}

      {/* Design Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#FFC971]/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-[#CC5803]/10 rounded-full blur-3xl"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E2711D]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-center text-[#CC5803] mb-8">
            Welcome to BrandBoost
          </h2>
          <p className="text-center text-gray-600 mb-8">Choose your account type to continue</p>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBusinessLogin}
              className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-[#CC5803] to-[#E2711D] text-white p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#CC5803]/20"
            >
              <FaBriefcase className="text-xl" />
              <span className="font-semibold">Business Account</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreatorLogin}
              className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF9505] to-[#FFB627] text-white p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FF9505]/20"
            >
              <FaUserAstronaut className="text-xl" />
              <span className="font-semibold">Creator Account</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
            </motion.button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              New to BrandBoost?{' '}
              <a href="/" className="text-[#FF9505] hover:text-[#FFB627] font-medium">
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
