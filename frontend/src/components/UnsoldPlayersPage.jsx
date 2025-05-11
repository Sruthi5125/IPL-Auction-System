import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UnsoldPlayersPage.css"; // Add CSS for styling

const UnsoldPlayersPage = () => {
  const [unsoldPlayers, setUnsoldPlayers] = useState([]);
  const navigate = useNavigate();

  /*useEffect(() => {
    fetchUnsoldPlayers();
  }, []);*/

  useEffect(() => {
      fetch("http://localhost:5001/api/unsold-players")
          .then(response => response.json())
          .then(data => {
              console.log("API Response (Unsold Players):", data);  // Check what's received
              setUnsoldPlayers(data);  // Make sure you're updating state correctly
          })
          .catch(error => console.error("Error fetching unsold players:", error));
  }, []);

  return (
    <div className="unsold-players-container">
      <h1>Unsold Players</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Category</th>
            <th>Base Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {unsoldPlayers.length > 0 ? (
            unsoldPlayers.map((player) => (
              <tr key={player.id}>
                <td>{player.name}</td>
                <td>{player.country}</td>
                <td>{player.category}</td>
                <td>${player.basePrice.toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">No unsold players</td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="back-btn" onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default UnsoldPlayersPage;
