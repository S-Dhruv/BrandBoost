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

  return (
    <div className="w-full max-w-lg bg-white p-6 rounded-3xl shadow-lg border border-[#328AB0]/20 mt-6 md:mt-0 md:ml-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-[#42A4E0] to-[#1D78A0] text-transparent bg-clip-text text-center mb-4">
        Ongoing Jobs
      </h2>
      {loading ? (
        <p className="text-center text-[#081A42]/60">Loading ongoing jobs...</p>
      ) : error ? (
        <p className="text-center text-red-600">Error: {error}</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="p-4 rounded-2xl bg-[#F9FAFB] border-2 border-[#328AB0]/20">
              <h3 className="text-lg font-semibold text-[#081A42]">{job.title}</h3>
              <p className="text-[#081A42]/60 mt-1">{job.description}</p>
              <p className="text-sm text-[#42A4E0] mt-2">Room Code: {job.roomCode}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OngoingNew;
