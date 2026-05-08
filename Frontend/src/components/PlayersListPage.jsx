import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PlayersListPage.css";
import { API_URL } from "../config";

const PlayersListPage = () => {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/players/top_players`);
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
            <th>Sold To</th>
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
                <td>{player.sold_to_team || "—"}</td>
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
      <button className="back-btn" onClick={() => navigate("/main")}>Back to Home</button>
    </div>
    </div>
  );
};

export default PlayersListPage;
