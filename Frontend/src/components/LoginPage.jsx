import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { API_URL } from "../config";

const LoginPage = () => {
  const [role, setRole] = useState("team"); // "admin" | "team"
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [teamName, setTeamName] = useState("");
  const [budget, setBudget] = useState("");
  const [coach, setCoach] = useState("");
  const [captain, setCaptain] = useState("");
  const [owner, setOwner] = useState("");
  const [teamImage, setTeamImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setTeamName("");
    setBudget("");
    setCoach("");
    setCaptain("");
    setOwner("");
    setTeamImage(null);
    setError("");
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setMode("login");
    resetForm();
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        navigate("/main");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  const handleTeamLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        localStorage.setItem("teamData", JSON.stringify(data.team));
        navigate("/home");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  const handleTeamRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!teamName || !username || !password || !budget) {
      setError("Team name, username, password, and budget are required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("teamName", teamName);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("budget", budget);
      formData.append("coach", coach);
      formData.append("captain", captain);
      formData.append("owner", owner);
      if (teamImage) formData.append("image", teamImage);

      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        localStorage.setItem("teamData", JSON.stringify(data.team));
        navigate("/home");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">IPL Auction</h2>

        <div className="role-selector">
          <button
            type="button"
            className={`role-btn ${role === "admin" ? "active" : ""}`}
            onClick={() => handleRoleChange("admin")}
          >
            Admin
          </button>
          <button
            type="button"
            className={`role-btn ${role === "team" ? "active" : ""}`}
            onClick={() => handleRoleChange("team")}
          >
            Team Management
          </button>
        </div>

        {role === "admin" ? (
          <form onSubmit={handleAdminLogin}>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <button type="submit" className="login-button">Login as Admin</button>
          </form>
        ) : (
          <>
            {mode === "login" ? (
              <form onSubmit={handleTeamLogin}>
                <div className="input-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                <p className="switch-mode-text">
                  Don't have an account?{" "}
                  <span className="switch-mode-link" onClick={() => handleModeChange("register")}>
                    Register here
                  </span>
                </p>
              </form>
            ) : (
              <form onSubmit={handleTeamRegister}>
                <div className="input-group">
                  <label>Team Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Chennai Super Kings"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    placeholder="Choose a login username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label>Budget ($) *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter your budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label>Coach</label>
                  <input
                    type="text"
                    placeholder="e.g. Ricky Ponting"
                    value={coach}
                    onChange={(e) => setCoach(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label>Captain</label>
                  <input
                    type="text"
                    placeholder="e.g. MS Dhoni"
                    value={captain}
                    onChange={(e) => setCaptain(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label>Owner</label>
                  <input
                    type="text"
                    placeholder="e.g. N. Srinivasan"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label>Team Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setTeamImage(e.target.files[0])}
                    className="input-field file-input"
                  />
                </div>
                {error && <p className="error-text">{error}</p>}
                <button type="submit" className="login-button">Register</button>
                <p className="switch-mode-text">
                  Already have an account?{" "}
                  <span className="switch-mode-link" onClick={() => handleModeChange("login")}>
                    Login here
                  </span>
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
