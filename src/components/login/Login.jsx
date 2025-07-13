import React, { useState, useContext } from "react";
import styles from '@/components/signup/SignUp.module.css';
import bgImage from '@/assets/images/bgImage.png';
import logo from '@/assets/images/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";
import { AuthContext } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get the intended destination from location state, or default to /homepage
  const from = location.state?.from || "/homepage";

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
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

      const data = await response.json();
      
      if (response.ok) {
        // Use the login function from AuthContext to set the token and user data
        login(data.access_token, {
          id: data.user_id,
          username: data.username,
          email: data.email
        });
        
        toast.success("Login successful");
        navigate(from); // Navigate to the intended destination
      } else {
        toast.error(data.detail || "Login failed. Check credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An error occurred during login.");
    } finally {
      setIsLoading(false);
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

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>
          <div className={styles.loginLink} onClick={() => navigate("/signup")}>Create a new account</div>
        </div>
      </div>
    </div>
  );
};

export default Login;