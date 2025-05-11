// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const auctionRoutes = require("./routes/auctionRoutes.js");
const db = require("./config/db"); // Ensure MySQL connection is properly set up
const authRoutes = require("./routes/authRoutes.js");
const playerRoutes = require("./routes/playerRoutes.js");

dotenv.config();
const app = express();
const path = require('path');
app.use(cors());
app.use(express.json());

app.use("/api", auctionRoutes);
app.use('/images', express.static(path.join(__dirname, 'uploads')));
app.use('/api', authRoutes);
app.use("/api/players", playerRoutes);


const PORT = process.env.PORT || 5001;
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",  // Allow all origins (change as needed)
      methods: ["GET", "POST"]
    }
  });
  
  app.use(cors());
  app.use(express.json());
  
  let currentBid = 0;
  let highestBidder = null;
  let biddingPlayer = null;
  let timer = null;
  const biddingTime = 30; 

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    
    socket.on("startBid", async ({ playerId }) => {
      try{
        const [rows] = await db.promise().query(
          "SELECT id, name, basePrice,image_url FROM players WHERE id = ?", 
          [playerId]
        );
    
        if (rows.length === 0) {
          console.log("Player not found");
          return;
        }
        biddingPlayer = rows[0]; 
        currentBid = biddingPlayer.basePrice ;
        highestBidder = null;
    ``
        io.emit("bidStarted", { player: biddingPlayer, currentBid, highestBidder, biddingTime });
    
        if (timer) clearInterval(timer);
        let timeLeft = biddingTime;
    
        timer = setInterval(() => {
          timeLeft -= 1;
          io.emit("updateTimer", { timeLeft });
          if (timeLeft <= 0) {
            clearInterval(timer);
            io.emit("auctionEnded");
          }
        }, 1000);
      }
     catch(error)
     {
      console.error("Error fetching player data:", error);
     }
    });
  
    socket.on("placeBid", async ({ teamId, bidAmount }) => {
      if(bidAmount>currentBid){
      try{
        const [teamrows] = await db.promise().query(
          "SELECT name FROM teams WHERE id = ?", 
          [teamId]
        );
    
        if (teamrows.length === 0) {
          console.log("Team not found");
          return;
        }
          const teamName = teamrows[0].name;
          currentBid = bidAmount;
          highestBidder = {id:teamId, name: teamName};
          io.emit("updateBid", { currentBid, highestBidder });
        }
      catch(error)
     {
      console.error("Error fetching player data:", error);
     }
    }
    });
  
    
    socket.on("auctionEnd", () => {
      console.log("Auction End Triggered");
      io.emit("auctionEnded", { biddingPlayer, highestBidder, currentBid });
      biddingPlayer = null;
      highestBidder = null;
      currentBid = 0;
    });
  
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
  
  server.listen(5001, () => console.log("Server running on port 5001"));