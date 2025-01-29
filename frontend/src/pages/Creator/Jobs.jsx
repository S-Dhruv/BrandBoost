import React, { useState, useEffect } from 'react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");
        const response = await fetch(
          "http://localhost:3000/creator/dashboard/jobs",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");
      const response = await fetch(
        `http://localhost:3000/creator/dashboard/jobs/apply/${jobId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const message = await response.json();
      if (!response.ok) throw new Error(message);
      alert("Successfully applied for job");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#081A42] flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#081A42] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-[#081A42] via-[#0F3A68] to-transparent"></div>
        <div className="absolute -right-48 top-48 w-96 h-96 bg-[#328AB0]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -left-48 bottom-48 w-96 h-96 bg-[#42A4E0]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-96 h-96 bg-[#1D78A0]/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-center pt-8 text-4xl font-bold mb-12 bg-gradient-to-r from-[#42A4E0] to-[#1D78A0] text-transparent bg-clip-text">
          Jobs Tailored for You
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="group relative bg-white rounded-3xl shadow-lg border border-[#328AB0]/20 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-102"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#42A4E0]/5 to-[#1D78A0]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="p-6 relative z-10">
                <h2 className="text-xl font-bold text-[#081A42] mb-3 capitalize">
                  {job.title}
                </h2>
                <p className="text-[#666] mb-4 capitalize line-clamp-3">
                  {job.description}
                </p>
                <div className="flex items-center mb-4 text-sm text-[#A1C6D2]">
                  <span className="mr-2">Posted by:</span>
                  <span className="font-medium text-[#328AB0]">
                    {job.creatorId.username || "Anonymous"}
                  </span>
                </div>
                
                <button
                  onClick={() => handleApply(job._id)}
                  className="w-full bg-gradient-to-r from-[#42A4E0] to-[#1D78A0] text-white py-3 px-6 rounded-xl
                    hover:from-[#1D78A0] hover:to-[#42A4E0] transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-[#42A4E0]/50"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center text-white mt-8">
            No jobs available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;