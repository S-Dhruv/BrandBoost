import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../util/SocketProvider";
import shortId from "shortid"; 

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");
        const response = await fetch(
          "http://localhost:3000/business/dashboard/jobs",
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
        console.log(err);
      }
    };
    fetchJobs();
  }, []);

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const roomCode = shortId.generate();
      const response = await fetch(
        "http://localhost:3000/business/dashboard/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ title, description, roomCode }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      alert("Job Posted Successfully");

      setJobs((prevJobs) => [...prevJobs, { ...data, roomCode }]);

      setTitle("");
      setDescription("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1>Jobs</h1>

      <h2>Post a Job</h2>
      <form onSubmit={handleJobSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          />
        </div>
        <button type="submit"> Create Job </button>
      </form>

      <h1>All jobs</h1>
      {jobs.map((job) => (
        <div key={job._id}>
          <h2>{job.title}</h2>
          <p>{job.description}</p>
          <p>Room Code: {job.roomCode}</p>
          <p>Posted By: {job.creatorId?.username || "Anonymous"}</p>
        </div>
      ))}
    </>
  );
};

export default Jobs;
