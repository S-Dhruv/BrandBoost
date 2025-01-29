import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
        console.log(data);
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

      // Update applications state with the detailsOfCandidates array
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
        alert(response.message);
        console.log(body);
        throw new Error("Failed to approve applicant");
      }
      const data = await response.json();
      console.log(data);
      alert("Applicant approved successfully");
      handleViewApplicants(jobId);
    } catch (err) {
      console.error("Error approving applicant:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Job Requests Dashboard</h1>

      <div className="space-y-6">
        {jobs.map((job) => (
          <div key={job._id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="mt-2 text-gray-600">{job.description}</p>
            <p className="mt-1 text-sm text-gray-500">
              Room Code: {job.roomCode}
            </p>

            <button
              onClick={() => handleViewApplicants(job._id)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading[job._id]}>
              {loading[job._id] ? "Loading..." : "View Applicants"}
            </button>

            {error[job._id] && (
              <p className="mt-2 text-red-500">{error[job._id]}</p>
            )}

            {applications[job._id] && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Applicants</h3>
                {applications[job._id].length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {applications[job._id].map((applicant) => (
                      <li
                        key={applicant._id}
                        className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{applicant.username}</p>
                          <p className="text-sm text-gray-500">
                            {applicant.email}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleApproveApplicant(job._id, applicant._id)
                          }
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                          Approve
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-gray-500">No applicants yet.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
