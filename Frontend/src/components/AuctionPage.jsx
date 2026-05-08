import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuctionPage.css";
import { io } from "socket.io-client";
import { API_URL } from "../config";

const socket = io(API_URL);

const AuctionPage = () => {
  const [players, setPlayers] = useState([]);
  const [biddingPlayer, setBiddingPlayer] = useState(null);
  const [timer, setTimer] = useState(0);
  const [currentBid, setCurrentBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/players`);
      setPlayers(response.data);
    } catch (error) {
      console.error("Failed to fetch players:", error);
    }
  };
  
  useEffect(() => {
    fetchPlayers();

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

    socket.on("auctionEnded", () => {
      setShowModal(false); 
      setBiddingPlayer(null);
      setCurrentBid(0);
      setHighestBidder(null);
    });

    socket.on("updateTimer", ({ timeLeft }) => {
      setTimer(timeLeft);
    });

    socket.on("playerAdded", fetchPlayers);

    return () => socket.off("playerAdded", fetchPlayers);
  }, []);

  const startBid = (player) => {
    socket.emit("startBid", { playerId: player.id });
  };

  return (
    <div className="auction-container">
      <h1 className="title">IPL Auction</h1>

      {showModal && biddingPlayer ?  (
        <div className="model-overlay">
          <div className="modal-content">
          <span className="close-button" onClick={() => setShowModal(false)}>&times;</span>
          <h2>{biddingPlayer.name}</h2>
          <img src={`${API_URL}/images/${biddingPlayer.image_url}`} alt={biddingPlayer.name} className="player-img" />
          <p>Base Price: ${biddingPlayer.basePrice}</p>
          <p>Current Bid: <span className="highlight">${currentBid}</span></p>
          <p>Highest Bidder: {highestBidder ? highestBidder.name : "None"}</p>
          <br></br>
        
          <button onClick={() => setShowModal(false)} className="modal-close-btn">Close</button>
        </div>
        </div>
      ) : (
        <div>
          <button className="add-player-btn" onClick={() => navigate("/add-player")}>
        Add New Player
      </button><br></br>
          <div className="player-grid">
            {players.map((player) => (
              <div key={player.id} className="player-card">
                <img src={`${API_URL}/images/${player.image_url}`} alt={player.name} className="player-img" />
                <h3>{player.name}</h3>
                <p>Base Price: ${player.basePrice}</p>
                {player.sold_to ? (
                  <>
                    <p className="sold-team">🏆 {player.sold_to_team}</p>
                    <p className="sold-price">Sold: ${player.sold_price}</p>
                    <button className="sold-btn" disabled>Sold</button>
                  </>
                ) : (
                  <button className="start-bid-btn" onClick={() => startBid(player)}>Start Bid</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <button className="back-btn" onClick={() => navigate("/main")}>Back to Home</button>
    </div>
  );
};

export default AuctionPage;
