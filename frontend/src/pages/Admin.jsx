import React, { useRef } from 'react';

const Admin = () => {
  const emailRef = useRef(null);

  const checkForApproval = async () => {
    try {
      const email = emailRef.current.value;
      if (!email) {
        console.log("Email is not set");
        return;
      }

      const response = await fetch(`http://localhost:3000/admin/approve/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, isApproved: true }), // Pass the email value, not the ref
      });

      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const checkForApproval2 = async () => {
    try {
      const email = emailRef.current.value;
      if (!email) {
        console.log("Email is not set");
        return;
      }

      const response = await fetch(`http://localhost:3000/admin/approve/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, isApproved: false }), // Pass the email value, not the ref
      });

      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <input type="email" ref={emailRef} placeholder="Enter email" />
      <button type="button" onClick={checkForApproval}>Agree Approval</button>
      <button type="button" onClick={checkForApproval2}>Disagree Approval</button>
    </div>
  );
};

export default Admin;