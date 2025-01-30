import React, { useState } from 'react';
import { Menu, X, Search, Bell, User } from 'lucide-react';
import logo from '../assets/logo.png';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ModernNavbar = ({jobs , posts , requests , ongoing}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-9999">
      <div className="w-full px-2">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">

            <button onClick={() => { 
              navigate('/')} }className="flex items-center space-x-2">

              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#00A6FB] to-[#0582CA] p-1 shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
                <img
                  src={logo}
                  alt="BrandBoost Logo"
                  className="h-full w-full object-contain rounded-full bg-white p-1"
                />
              </div>
              </button>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-[#00A6FB] to-[#0582CA] bg-clip-text text-transparent">
                BrandBoost
              </span>
             
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
                  
                    
                   {jobs && (<a href = {jobs} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#00A6FB]" >
                      Jobs
                    </a>)}
                    
                    {requests && (<a href = {requests} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#00A6FB]">
                      Requests
                    </a>)}
                    {ongoing && (<a href = {ongoing} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#00A6FB]">
                      Ongoing
                    </a>)}

            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:text-[#00A6FB] rounded-full hover:bg-blue-50">
              <Bell className="h-5 w-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative ml-4">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-[#00A6FB] focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#0582CA] to-[#006494] flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#00A6FB]">
                      Profile
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#00A6FB]">
                      Dashboard
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#00A6FB]">
                      Settings
                    </a>
                    <div className="border-t border-gray-100"></div>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#00A6FB]">
                      Sign out
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Login Button */}
            <a
              href="/login"
              className="ml-4 px-4 py-2 rounded-lg bg-[#00A6FB] hover:bg-[#0582CA] text-white font-medium transition-colors duration-200"
            >
              Login
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-[#00A6FB] hover:bg-blue-50 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Search */}
            <div className="px-3 pb-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6FB] focus:border-transparent"
                  placeholder="Search content..."
                />
              </div>
            </div>

            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[#00A6FB] hover:bg-blue-50"
              >
                {item.name}
              </a>
            ))}

            <div className="border-t border-gray-200 pt-4">
              <a
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-[#00A6FB] hover:bg-blue-50"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ModernNavbar;