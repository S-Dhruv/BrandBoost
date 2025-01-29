import React from "react";
import BusinessSidebar from "./BusinessSidebar";
import ModernNavbar from "../../components/ModernNavbar";

const links = {
  business: {
    jobs: "/business/dashboard/jobs",
    posts: "/business/dashboard/post",
    requests: "/business/dashboard/requests",
    ongoing: "/business/dashboard/ongoing"
  
  },
  creator: {
    jobs: "/creator/dashboard/jobs",
    posts: "/creator/dashboard/post",
    requests: "/creator/dashboard/requests",
    ongoing: "/creator/dashboard/ongoing"
    
  }
};



const BusinessDashboard = () => {

  const userType = localStorage.getItem("role")

  const userLinks = (userType === "business" ? links.business : links.creator);

  

  return (
    
      <>
      <ModernNavbar {...userLinks}/>
      </>
    
  );
};

export default BusinessDashboard;
