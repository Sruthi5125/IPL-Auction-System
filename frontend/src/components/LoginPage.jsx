//login page 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Username and Password are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        setError(data.error || "Login failed");
      } else {
        setError("");
        localStorage.setItem("teamData", JSON.stringify(data.team)); // Store user data
        navigate("/home"); // Redirect to MainPage
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">IPL Auction Login</h2>
        <button className="back-btn" onClick={() => navigate("/")}>Back to Home</button>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
      <br></br>
    </div>

  );
};

export default LoginPage;