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
        setJobs(data);
      } catch (err) {
        console.error(err);
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
      console.error(err);
    }
  };

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
        <h1 className="text-center text-4xl font-bold mb-12 bg-gradient-to-r from-[#42A4E0] to-[#1D78A0] text-transparent bg-clip-text">
          Manage Your Jobs
        </h1>

        {/* Job Posting Form */}
        <div className="max-w-2xl mx-auto mb-16 bg-white rounded-3xl shadow-lg border border-[#328AB0]/20 p-8">
          <h2 className="text-2xl font-bold text-[#081A42] mb-6">Post a New Job</h2>
          <form onSubmit={handleJobSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-[#081A42]">
                Job Title
              </label>
              <div className="relative group">
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-[#F9FAFB] border-2 border-[#328AB0]/20 
                    text-[#081A42] placeholder-[#A1C6D2] focus:outline-none focus:border-[#42A4E0] 
                    transition-all duration-300 group-hover:border-[#42A4E0]/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-[#081A42]">
                Job Description
              </label>
              <div className="relative group">
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-[#F9FAFB] border-2 border-[#328AB0]/20 
                    text-[#081A42] placeholder-[#A1C6D2] focus:outline-none focus:border-[#42A4E0] 
                    transition-all duration-300 group-hover:border-[#42A4E0]/50 min-h-32"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#42A4E0] to-[#1D78A0] text-white py-4 rounded-2xl
                hover:from-[#1D78A0] hover:to-[#42A4E0] transition-all duration-300 font-medium"
            >
              Post Job
            </button>
          </form>
        </div>

        {/* Jobs List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="group bg-white rounded-3xl shadow-lg border border-[#328AB0]/20 overflow-hidden 
                transition-all duration-300 hover:shadow-xl hover:scale-102"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#081A42] mb-3 capitalize">
                  {job.title}
                </h2>
                <p className="text-[#666] mb-4 capitalize">
                  {job.description}
                </p>
                <div className="space-y-2 pt-4 border-t border-[#328AB0]/10">
                  <div className="flex items-center text-sm text-[#A1C6D2]">
                    <span className="font-medium text-[#328AB0]">Room Code:</span>
                    <span className="ml-2">{job.roomCode}</span>
                  </div>
                  <div className="flex items-center text-sm text-[#A1C6D2]">
                    <span className="font-medium text-[#328AB0]">Posted By:</span>
                    <span className="ml-2">{job.creatorId?.username || "Anonymous"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center text-white mt-8">
            No jobs posted yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;