import React from 'react'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
const CreatorLogin = () => {
  const emailRef = useRef(null);
  const passRef = useRef(null); 
  const nav = useNavigate();
 
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passRef.current.value;
    const response = await fetch("http://localhost:3000/creator/login",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body : JSON.stringify({email,password}),
    })
    const data = await response.json();
    if(data.message ===  "Login successful"){
      console.log("Login Success");
      const role = data.role;
      console.log(role);
      localStorage.setItem("role",role);
      localStorage.setItem("isLogin",true);
      nav("/creator/dashboard");
    }
  }
  return (
    <>
    <form>
      <input type="email" name="mail" ref={emailRef} placeholder="Email" />
      <input type="password" name="pass" ref={passRef} placeholder="Password" />
      <button onClick={handleLogin}>Submit</button>
    </form>
    </>
  )
}

export default CreatorLogin