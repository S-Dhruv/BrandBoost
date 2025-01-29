import React from 'react'
import CreatorSidebar from './CreatorSidebar';
import ModernNavbar from '../../components/ModernNavbar';


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

const CreatorDashboard = () => {


  const userType = localStorage.getItem("role")

  const userLinks = (userType === "creator" ? links.creator : links.business);

  return (
        <ModernNavbar {...userLinks}/>
  )
}

export default CreatorDashboard