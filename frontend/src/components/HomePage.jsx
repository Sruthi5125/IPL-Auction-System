import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./HomePage.css";

const socket = io("http://localhost:5001");

const HomePage = () => {
  const navigate = useNavigate();
  const teamData = JSON.parse(localStorage.getItem("teamData"));
  const [biddingPlayer, setBiddingPlayer] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState(null);
  const [timer, setTimer] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);


  const handleLogout = () => {
    localStorage.removeItem("teamData");
    navigate("/");
  };

  const fetchMembers = async () => {
    if (!teamData?.id) return;
    try {
      const response = await fetch("http://localhost:5001/api/teamMembers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamNo: teamData.id }),
      });
      const data = await response.json();
      setTeamMembers(data);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
    }
  };

  const fetchUpdatedTeamData = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/team/${teamData.id}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const updatedTeam = await response.json();
      localStorage.setItem("teamData", JSON.stringify(updatedTeam));
      navigate(0); // Reloads to reflect budget changes
    } catch (error) {
      console.error("Failed to fetch updated team data:", error);
    }
  };

  const fetchPlayerDetails = async (playerId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/players/${playerId}`);
      const playerDetails = await response.json();
      setSelectedPlayer(playerDetails);
      setShowPlayerModal(true);
    } catch (error) {
      console.error("Error fetching player details:", error);
    }
  };

  useEffect(() => {
    fetchMembers();

    socket.on("bidStarted", ({ player, currentBid, highestBidder }) => {
      setBiddingPlayer(player);
      setCurrentBid(currentBid);
      setHighestBidder(highestBidder);
      setShowModal(true);
    });

    socket.on("updateBid", ({ currentBid, highestBidder }) => {
      setCurrentBid(currentBid);
      setHighestBidder(highestBidder);
    });

    socket.on("updateTimer", ({ timeLeft }) => {
      setTimer(timeLeft);
    });

    socket.on("auctionEnded", async () => {
      if (biddingPlayer && highestBidder && currentBid > 0) {
        try {
          await fetch('http://localhost:5001/api/place-bid', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              playerId: biddingPlayer.id,
              teamId: highestBidder.id,
              bidAmount: currentBid
            })
          });
          fetchUpdatedTeamData();
        } catch (err) {
          console.error('Failed to update the database:', err);
        }
      }
      setShowModal(false);
      setBiddingPlayer(null);
      setCurrentBid(0);
      setHighestBidder(null);
      setTimer(0);
    });

    return () => {
      socket.off("bidStarted");
      socket.off("updateBid");
      socket.off("updateTimer");
      socket.off("auctionEnded");
    };
  }, [biddingPlayer, highestBidder, currentBid, teamData?.id]);

  const placeBid = (playerId) => {
    if (timer > 0) {
      const bidAmount = parseInt(prompt("Enter your bid:"), 10);
      if (bidAmount > currentBid && bidAmount <= teamData.budget) {
        socket.emit("placeBid", { playerId, teamId: teamData.id, bidAmount });
      } else {
        alert("Invalid bid!");
      }
    } else {
      alert("Bidding time is over! No further bids accepted.");
    }
  };

  return (
    <div className="homepage-container" >
      <h2>Welcome, {teamData?.name}!</h2>
      <h2>FUNDS REMAINING : ${teamData?.budget}</h2>

      {showModal && biddingPlayer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowModal(false)}>&times;</span>
            <img src={`http://localhost:5001/images/${biddingPlayer.image_url}`} alt={biddingPlayer.name} className="player-img" />
            <h2>Current Player: {biddingPlayer.name}</h2>
            <p>Base Price: ${biddingPlayer.basePrice}</p>
            <p>Highest Bid: ${currentBid}</p>
            <p>Highest Bidder: {highestBidder ? highestBidder.name : "None"}</p>
            <p>Time Left: {timer} seconds</p>
            <button onClick={() => placeBid(biddingPlayer.id)} className="bid-button">Place Bid</button>
            <button onClick={() => setShowModal(false)} className="modal-close-btn">Close</button>
          </div>
        </div>
      )}

      <h2>Team Members:</h2>
      <div className="player-list">
        {teamMembers.length > 0 ? (
          teamMembers.map((player) => (
            <div key={player.id} className="player-card" onClick={() => fetchPlayerDetails(player.id)}>
              <div className="player-img-container">
                <img src={`http://localhost:5001/images/${player.image_url}`} alt={player.name} className="player-img" />
              </div>
              <h3>{player.name}</h3>
              <p>Base Price: ${player.basePrice}</p>
            </div>
          ))
        ) : (
          <p>No members found.</p>
        )}
      </div>

      {/* Player Details Modal */}
      {showPlayerModal && selectedPlayer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowPlayerModal(false)}>&times;</span>
            <img src={`http://localhost:5001/images/${selectedPlayer.image_url}`} alt={selectedPlayer.name} className="player-img" />
            <h2>{selectedPlayer.name}</h2>
            <p>Category: {selectedPlayer.category}</p>
            <p>Age : {selectedPlayer.age}</p>
            <p>Country : {selectedPlayer.country}</p>
            <p>Sold Price : {selectedPlayer.sold_price}</p>
            <p>Batting Style : {selectedPlayer.batting_style}</p>
            <p>Bowling Style : {selectedPlayer.bowling_style}</p>
            <p>50s : {selectedPlayer.fifty}</p>
            <p>100s : {selectedPlayer.hundred}</p>
            <p>Total Runs : {selectedPlayer.total_runs}</p>
            <p>Wickets Taken : {selectedPlayer.wickets_taken}</p>
          </div>
        </div>
      )}

      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default HomePage;
