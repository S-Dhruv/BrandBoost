import React from 'react'
import {  Link } from "react-router-dom";

const CreatorSidebar = () => {
  return (
        <div className="flex flex-col">
          <Link to="/creator/dashboard/jobs" className="sidebar-link">
            Jobs
          </Link>
          <Link to="/creator/dashboard/requests" className="sidebar-link">
            Requests
          </Link>
          <Link to="/creator/dashboard/ongoing" className="sidebar-link">
            Ongoing
          </Link>
          <Link to="/creator/dashboard/post" className="sidebar-link">
            Post
          </Link>
        </div>
  )
}

export default CreatorSidebar