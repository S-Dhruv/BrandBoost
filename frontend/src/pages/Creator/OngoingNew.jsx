import React, { useState, useEffect } from "react";

const OngoingNew = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOngoingJobs = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/creator/dashboard/ongoing",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch ongoing jobs");
        }

        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingJobs();
  }, []);

  if (loading) {
    return <div>Loading ongoing jobs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white">
      <h1>Ongoing Jobs</h1>
      <br />
      <div className="jobs-list">
        {jobs.map((job) => (
          <div key={job._id} className="job-card bg-white">
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p>{job.roomCode}</p>
            <div className="job-details"></div>
            <br />
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OngoingNew;
