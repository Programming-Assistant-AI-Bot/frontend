import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token); // Save JWT
        alert("Login successful");
        // Navigate to dashboard or homepage
        navigate("/chatbot");
      } else {
        alert("Login failed. Check credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred during login.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <h1>Archelon AI</h1>
          <p>The Wise Coding Companion</p>
        </div>

        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Log in</button>
        </form>

        <p
          className="register-link cursor-pointer text-blue-600 hover:underline"
          onClick={() => navigate("/signup")}
        >
          Create a new account
        </p>
      </div>

      <div className="background-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#4c1d95"
            fillOpacity="1"
            d="M0,160L34.3,149.3C68.6,139,137,117..."
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Login;
