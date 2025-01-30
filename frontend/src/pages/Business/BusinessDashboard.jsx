import React from "react";
import BusinessSidebar from "./BusinessSidebar";
import ModernNavbar from "../../components/ModernNavbar";
import Gemini from "./Gemini";

// Define navigation links for different user types
const NAV_LINKS = {
  business: {
    jobs: "/business/dashboard/jobs",
    posts: "/business/dashboard/post",
    requests: "/business/dashboard/requests",
    ongoing: "/business/dashboard/ongoing",
  },
  creator: {
    jobs: "/creator/dashboard/jobs",
    posts: "/creator/dashboard/post",
    requests: "/creator/dashboard/requests",
    ongoing: "/creator/dashboard/ongoing",
  },
};

const BusinessDashboard = () => {
  // Get the user role from localStorage
  const userType = localStorage.getItem("role");

  // Determine the appropriate links based on the user role
  const userLinks = userType === "business" ? NAV_LINKS.business : NAV_LINKS.creator;

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#ffffff] text-white">
      {/* ModernNavbar with user-specific links */}
      <ModernNavbar {...userLinks} />

      {/* Spacing (using padding instead of <br> tags) */}
      <div className="pt-24"></div>

      {/* Main content area */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 text-center shadow-b shadow-[0_0_20px_5px_rgba(0,166,251,0.5)]">
          <h1 className="text-3xl font-bold mb-6 text-[#00A6FB]">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            Manage your jobs, posts, requests, and ongoing projects seamlessly.
          </p>

          {/* Gemini component */}
          <div className="bg-white/20 rounded-lg p-6 ">
            {/* Add black outlines to input boxes */}
            <style>
              {`
                input, textarea, select {
                  border: 2px solid black !important;
                  border-radius: 0.375rem !important; /* rounded-md */
                  padding: 0.5rem 1rem !important;
                  width: 100% !important;
                  background-color: transparent !important;
                  color: black !important;
                }
                input::placeholder, textarea::placeholder {
                  color: rgba(255, 255, 255, 0.7) !important;
                }
              `}
            </style>
            <Gemini />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;