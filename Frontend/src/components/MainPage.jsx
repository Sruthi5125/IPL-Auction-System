import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MainPage.css";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const MainPage = () => {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/api/teams`)
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="main-container">
      <button className="main-logout-btn" onClick={handleLogout}>Logout</button>

      <h1>IPL AUCTION</h1>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/player">Top Buys</Link>
        <Link to="/unsold-players">Unsold Players</Link>
        <Link to="/auction">Conduct Auction</Link>
      </nav>

      {/* Overview Section */}
      <div className="overview">
        <div className="team-list">
          {teams.map((team) => (
            <div key={team.id} className="team-card">
              <h3>{team.name}</h3>
              <div class="team-img-container">
                <img src={`${API_URL}/images/${team.image_url}`} alt={team.name} className="team-img" />
              </div>
              <p><strong>Budget:  </strong> ${team.budget}</p>
              <p><strong>Players:  </strong> {team.total_players}</p>
              <p><strong>Overseas Players:  </strong> {team.overseas_players}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
