import React, { useState, useEffect } from "react";

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
        console.log(data);
        setJobs(data);
      } catch (err) {
        setError(err.message);
        console.log(err);
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
      console.log(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
    <h1 className="text-center pt-8 font-semibold text-3xl mb-8">Jobs Tailored for You</h1>
    <div className="space-y-6">
      {jobs.map((job) => (
        <div
          className="border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
          key={job._id}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-2 capitalize">{job.title}</h2>
          <p className="text-gray-600 mb-4 capitalize">{job.description}</p>
          <p className="text-sm text-gray-500 mb-4">
            Posted By: {job.creatorId.username || "Anonymous"}
          </p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
            onClick={() => handleApply(job._id)}
          >
            Apply
          </button>
        </div>
      ))}
    </div>
  </div>
  );
};

export default Jobs;

// first make all the jobs appear on the creator job page
// then put the apply option which will add the creator id to the list of applied candidates ka array.
// let the organisation be able to view who all applied for that particular job id
