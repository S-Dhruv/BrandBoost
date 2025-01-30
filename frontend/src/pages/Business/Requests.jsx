import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import  WaveDecoration  from "../../components/WaveDecoration";

const RequestsBackground = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#006494" strokeOpacity="0.2"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);



const Requests = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});
  const nav = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");
        const response = await fetch(
          "http://localhost:3000/business/dashboard/requests",
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
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  const handleViewApplicants = async (jobId) => {
    try {
      setLoading((prev) => ({ ...prev, [jobId]: true }));
      setError((prev) => ({ ...prev, [jobId]: null }));

      const response = await fetch(
        `http://localhost:3000/business/dashboard/requests/${jobId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setApplications((prev) => ({
        ...prev,
        [jobId]: data.detailsOfCandidates || [],
      }));
    } catch (err) {
      console.error("Error fetching applicants:", err);
      setError((prev) => ({ ...prev, [jobId]: err.message }));
    } finally {
      setLoading((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const handleApproveApplicant = async (jobId, applicantId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/business/dashboard/requests/${jobId}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ approvedId: applicantId }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.message);
        throw new Error("Failed to approve applicant");
      }
      const data = await response.json();
      alert("Applicant approved successfully");
      handleViewApplicants(jobId);
    } catch (err) {
      console.error("Error approving applicant:", err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#003554] to-[#006494]">
      <RequestsBackground />
      <WaveDecoration />

      <div className="relative z-10 container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Job Requests Dashboard
            <div className="h-1 w-24 bg-[#00A6FB] mt-2 rounded-full transform transition-all duration-300 hover:w-32" />
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="group relative bg-white/95 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,166,251,0.3)] hover:transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00A6FB]/0 to-[#00A6FB]/0 group-hover:from-[#00A6FB]/5 group-hover:to-[#0582CA]/5 transition-all duration-500" />
              
              <div className="relative p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-6 h-6 text-[#00A6FB]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-[#051923] group-hover:text-[#00A6FB] transition-colors duration-300">
                    {job.title}
                  </h2>
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span>Room Code: {job.roomCode}</span>
                </div>

                <button
                  onClick={() => handleViewApplicants(job._id)}
                  className="w-full px-4 py-2 bg-[#00A6FB] text-white rounded-lg transform transition-all duration-300 hover:bg-[#0582CA] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#00A6FB] focus:ring-offset-2"
                  disabled={loading[job._id]}
                >
                  {loading[job._id] ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    "View Applicants"
                  )}
                </button>

                {error[job._id] && (
                  <p className="mt-2 text-red-500 text-sm">{error[job._id]}</p>
                )}

                {applications[job._id] && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="text-lg font-semibold text-[#051923] mb-3">Applicants</h3>
                    {applications[job._id].length > 0 ? (
                      <ul className="space-y-3">
                        {applications[job._id].map((applicant) => (
                          <li
                            key={applicant._id}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-[#00A6FB]/10 flex items-center justify-center">
                                <svg className="w-4 h-4 text-[#00A6FB]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-[#051923]">{applicant.username}</p>
                                <p className="text-sm text-gray-500">{applicant.email}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleApproveApplicant(job._id, applicant._id)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg transform transition-all duration-300 hover:bg-green-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                              Approve
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p>No applicants yet.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Requests;