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
    <div>
      <h1>Jobs</h1>
      {jobs.map((job) => (
        <div key={job._id}>
          <h2>{job.title}</h2>
          <p>{job.description}</p>
          <p>Posted By : {job.creatorId.username || "Anonymous"}</p>
          <button
            className="bg-blue-500 cursor-pointer"
            onClick={() => handleApply(job._id)}>
            Apply
          </button>
        </div>
      ))}
    </div>
  );
};

export default Jobs;

// first make all the jobs appear on the creator job page
// then put the apply option which will add the creator id to the list of applied candidates ka array.
// let the organisation be able to view who all applied for that particular job id
