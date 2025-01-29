import React, { useRef } from 'react'

const WaitingApproval = () => {
    const emailRef = useRef(null);
    const check = async () => {
        try {
          const response = await fetch("http://localhost:3000/admin/waiting", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: emailRef.current.value }),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
          if (data.message === "Approved") {
            alert("You have been approved");
          } else {
            alert("Oops, you aren't approved");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("An error occurred. Please try again.");
        }
      };
  return (
    <div>
        <input type="email" ref={emailRef} placeholder="Enter your email"/>
        <button onClick={check}>Check</button>
    </div>
  )
}

export default WaitingApproval