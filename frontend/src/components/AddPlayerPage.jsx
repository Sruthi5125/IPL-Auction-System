import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddPlayerPage.css";

const AddPlayerPage = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState({
    name: "",
    country: "",
    category: "",
    basePrice: "",
    age: "",
    overseas: false,
    battingStyle: "",
    bowlingStyle: "",
    fifties: "",
    hundreds: "",
    totalRuns: "",
    wicketsTaken: "",
    economy: "",
    strikeRate: "",
    matchesPlayed: "",
    image: null,
  });

  const countries = ["India", "Australia", "England", "South Africa", "Pakistan", "New Zealand", "West Indies", "Sri Lanka", "Bangladesh", "Afghanistan"];
  const categories = ["Batsman", "Bowler", "All Rounder"];
  const battingStyles = ["Right-hand Bat", "Left-hand Bat"];
  const bowlingStyles = ["Right-arm Fast", "Left-arm Fast", "Right-arm Medium", "Left-arm Medium", "Off Spin", "Leg Spin"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayer({
      ...player,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setPlayer({ ...player, image : e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(player).forEach((key) => {
      formData.append(key, player[key]);
    });
    try {
      //await axios.post("http://localhost:5001/api/players/add", player);
      await axios.post("http://localhost:5001/api/players/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Player added successfully!");
      navigate("/auction"); // Redirect to Auction Page
    } catch (error) {
      console.error("Error adding player:", error);
      alert("Failed to add player.");
    }
  };

  return (
    <div className="add-player-container">
      <h1>Add New Player</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Name:</label>
        <input type="text" name="name" value={player.name} onChange={handleChange} required />

        <label>Country:</label>
        <select name="country" value={player.country} onChange={handleChange} required>
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        <label>Category:</label>
        <select name="category" value={player.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

            <label>Batting Style:</label>
            <select name="battingStyle" value={player.battingStyle} onChange={handleChange}>
              <option value="">Select Batting Style</option>
              {battingStyles.map((style) => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>


            <label>Bowling Style:</label>
            <select name="bowlingStyle" value={player.bowlingStyle} onChange={handleChange}>
              <option value="">Select Bowling Style</option>
              {bowlingStyles.map((style) => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>


        <label>Base Price ($):</label>
        <input type="number" name="basePrice" value={player.basePrice} onChange={handleChange} required />

        <label>Age:</label>
        <input type="number" name="age" value={player.age} onChange={handleChange} required />

        <label>Overseas Player:</label>
        <select name="overseas" value={player.overseas} onChange={handleChange} required>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>

        <label>Fifties Scored:</label>
        <input type="number" name="fifties" value={player.fifties} onChange={handleChange} />

        <label>Hundreds Scored:</label>
        <input type="number" name="hundreds" value={player.hundreds} onChange={handleChange} />

        <label>Total Runs Scored:</label>
        <input type="number" name="totalRuns" value={player.totalRuns} onChange={handleChange} />

        <label>Wickets Taken:</label>
        <input type="number" name="wicketsTaken" value={player.wicketsTaken} onChange={handleChange} />

        <label>Economy:</label>
        <input type="number" name="economy" value={player.economy} onChange={handleChange} step="0.01" />

        <label>Strike Rate:</label>
        <input type="number" name="strikeRate" value={player.strikeRate} onChange={handleChange} step="0.01" />

        <label>Matches Played:</label>
        <input type="number" name="matchesPlayed" value={player.matchesPlayed} onChange={handleChange} />

        <label>Upload Player Image:</label>
        <input type="file" name="image" onChange={handleImageChange} accept="image/*" required />

        <button type="submit">Add Player</button>
      </form>
    </div>
  );
};

export default AddPlayerPage;
