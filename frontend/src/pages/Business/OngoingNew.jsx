import React, { useState, useEffect } from "react";

const Ongoing = () => {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const fetchOngoingJobs = async () => {
      const response = await fetch(
        "http://https://brandboost-8v1b.onrender.com/business/dashboard/ongoing",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      setJobs(data);
      console.log(jobs);
    };
    fetchOngoingJobs();
  }, []);

  return (
    <div>
      <p>Ongoing projects</p>
      {jobs.map((job) => (
        <div key={job._id}>
          <p>{job.title}</p>
          <p>{job.description}</p>
          <p>{job.roomCode}</p>
        </div>
      ))}
    </div>
  );
};

export default Ongoing;
