import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PlayersListPage.css"; // Import the CSS for styling

const PlayersListPage = () => {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlayers();
    /*  fetch("http://localhost:5001/api/players/top-players")  // Adjust if needed
        .then((res) => res.json())
        .then((data) => {
          setlayers(data);
        })
        .catch((error) => console.error("Error fetching top players:", error));   */ 
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/players/top_players");
      console.log("Players API Response:", response.data);
      // Sort players in descending order based on sold_price
      const sortedPlayers = response.data.sort((a, b) => b.sold_price - a.sold_price);
      setPlayers(sortedPlayers);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  return (
    <div className="page-container">
    <div className="players-list-container">
      <h1>Players List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Category</th>
            <th>Sold Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {players.length > 0 ? (
            players.map((player) => (
              <tr key={player.id}>
                <td>{player.name}</td>
                <td>{player.country}</td>
                <td>{player.category}</td>
                <td>${player.sold_price}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">No players available</td>
            </tr>
          )}
        </tbody>
      </table>
      <br></br>
      <button className="back-btn" onClick={() => navigate("/")}>Back to Home</button>
    </div>
    </div>
  );
};

export default PlayersListPage;
