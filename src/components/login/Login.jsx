import React, { useState } from "react";
import styles from '@/components/signup/SignUp.module.css'; // Reusing the signup styles
import bgImage from '@/assets/images/bgImage.png';
import logo from '@/assets/images/logo.png';
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
    <div className={styles.pageContainer}>
      <div className='absolute bottom-0 left-0 right-0 h-[45%] bg-cover' style={{ backgroundImage: `url(${bgImage})` }} />
      <div className={styles.mainContainer}>
        <div className='h-[20%] w-full flex justify-center items-center'>
          <img src={logo} alt="logo" className='w-full max-h-full object-fill' />
        </div>
        <div className='h-[70%] w-full'>
          <h1 className="text-3xl font-bold text-center m-9">Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mt-6">
              <label className="text-sm font-semibold">Email</label>
              <input 
                type="email" 
                className={styles.formInput} 
                placeholder="Email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold">Password</label>
              <input 
                type="password" 
                className={styles.formInput} 
                placeholder="Password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Log in
            </button>
          </form>
          <div className={styles.loginLink} onClick={() => navigate("/signup")}>Create a new account</div>
        </div>
      </div>
    </div>
  );
};

export default Login;