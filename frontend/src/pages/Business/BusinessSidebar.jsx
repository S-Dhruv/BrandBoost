import React from 'react'
import { Link } from "react-router-dom";

const BusinessSidebar = () => {
  return (
    <>
        <div className="flex flex-col">
          <Link to="/business/dashboard/jobs" className="sidebar-link">
            Jobs
          </Link>
          <Link to="/business/dashboard/requests" className="sidebar-link">
            Requests
          </Link>
          <Link to="/business/dashboard/ongoing" className="sidebar-link">
            Ongoing
          </Link>
          <Link to="/business/dashboard/post" className="sidebar-link">
            Post
          </Link>
          </div>
       </>
  )
}

export default BusinessSidebar