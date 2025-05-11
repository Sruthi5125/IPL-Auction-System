import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MainPage.css";
import { Link } from "react-router-dom";

const MainPage = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Fetch teams data from API
    axios.get("http://localhost:5001/api/teams")
      .then((response) => {
        setTeams(response.data); // Store fetched data
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  }, []);

  return (
    <div className="main-container">

      <h1>IPL AUCTION</h1>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/login">Login</Link>
        <Link to="/player">Top Buys</Link>
        <Link to="/unsold-players">Unsold Players</Link>
        <Link to="/auction">Conduct   Auction</Link>
      </nav>

      {/* Overview Section */}
      <div className="overview">
        <div className="team-list">
          {teams.map((team) => (
            <div key={team.id} className="team-card">
              <h3>{team.name}</h3>
              <div class="team-img-container">
                <img src={`http://localhost:5001/images/${team.image_url}`} alt={team.name} className="team-img" />
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
