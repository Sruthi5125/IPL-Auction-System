// auctionRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require("multer");
const path = require("path");

// 1. Get all players
router.get("/players", (req, res) => {
    db.query("SELECT * FROM players", (err, results) => {
      if (err) {
        console.error("Error fetching players:", err);
        res.status(500).send("Database error");
      } else {
        res.json(results);
      }
    });
  });
  
// Fetch teams with derived player counts
router.get("/teams", (req, res) => {
  const sql = `
    SELECT 
      t.id, 
      t.name, 
      t.budget, 
      COUNT(p.id) AS total_players, 
      SUM(CASE WHEN p.overseas = 'Yes' THEN 1 ELSE 0 END) AS overseas_players,
      t.image_url
    FROM teams t
    LEFT JOIN players p ON t.id = p.sold_to
    GROUP BY t.id, t.name, t.budget
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching teams:", err);
      res.status(500).send("Error retrieving team data.");
    } else {
      res.json(results);
    }
  });
});

module.exports = router;


router.post('/place-bid', async (req, res) => {
  const { playerId, teamId, bidAmount } = req.body;

  try {

        // Get the team's current budget
        const [team] = await db.promise().query(
          "SELECT budget FROM teams WHERE id = ?",
          [teamId]
        );
    
        if (team.length === 0) {
          return res.status(404).json({ error: "Team not found" });
        }
    
        const teamBudget = team[0].budget;
    
        if (bidAmount > teamBudget) {
          return res.status(400).json({ error: "Insufficient budget!" });
        }
    
    // Ensure only the highest bid is stored
    const [player] = await db.promise().query(
      `SELECT sold_price FROM players WHERE id = ?`, [playerId]
    );

    if (player.length === 0) {
      return res.status(404).send("Player not found.");
    }

    const currentSoldPrice = player[0].sold_price;

    if (currentSoldPrice === null || bidAmount > currentSoldPrice) {
      // Update the player's sold price, sold_to, and team's budget only if bidAmount is higher
      const [result] = await db.promise().query(
        `UPDATE players p 
         JOIN teams t ON t.id = ?
         SET p.sold_price = ?, p.sold_to = ?, t.budget = t.budget - ?
         WHERE p.id = ? AND t.id = ?`,
        [teamId,bidAmount, teamId, bidAmount, playerId, teamId]
      );

      if (result.affectedRows > 0) {
        res.status(200).send("Bid placed successfully!");
      } else {
        res.status(400).send("Bid placement failed.");
      }
    } else {
      res.status(400).send("Bid is not higher than the current bid.");
    }
  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({error : "Server error" });
  }
});

// Get a specific team by ID
router.get("/team/:teamId", async (req, res) => {
  const { teamId } = req.params;

  try {
    const [team] = await db.promise().query(
      "SELECT * FROM teams WHERE id = ?",
      [teamId]
    );

    if (team.length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.json(team[0]); // Return team data
  } catch (error) {
    console.error("Error fetching team data:", error);
    res.status(500).json({ error: "Failed to fetch team data" });
  }
});

// Get all unsold players (sold_to IS NULL)
router.get("/unsold-players", async (req, res) => {
  try {
    const query = `
      SELECT p.id, p.name, p.country, p.category, p.basePrice, p.image_url
      FROM players p
      WHERE p.sold_to IS NULL;
    `;

    const [unsoldPlayers] = await db.promise().query(query);
    res.json(unsoldPlayers);
  } catch (error) {
    console.error("Error fetching unsold players:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original filename
  },
});

const upload = multer({ storage });


router.post("/players/add", upload.single("image"), (req, res) => {
  const { name, country, category, basePrice, age, overseas, battingStyle, bowlingStyle, fifties, hundreds, totalRuns, wicketsTaken, economy, strikeRate, matchesPlayed } = req.body;

  const imageUrl = req.file ? req.file.originalname : null; // Store filename as 'filename.extension'
  const overseasValue = overseas === "Yes" ? "Yes" : "No";
  const sql = `INSERT INTO players (name, country, category, basePrice, age, overseas, batting_style, bowling_style, fifty, hundred, total_runs, wickets_taken, economy, strike_rate, matches_played, image_url) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [name, country, category, basePrice, age, overseasValue, battingStyle, bowlingStyle, fifties, hundreds, totalRuns, wicketsTaken, economy, strikeRate, matchesPlayed, imageUrl], 
  (err, result) => {
      if (err) {
          console.error("Error adding player:", err);
          res.status(500).send("Error adding player to database.");
      } else {
          res.status(201).send("Player added successfully.");
      }
  });
});

// Fetch player details by ID
router.get("/:playerId", async (req, res) => {
  const { playerId } = req.params;

  try {
    const query = "SELECT * FROM players WHERE id = ?";
    db.query(query, [playerId], (err, results) => {
      if (err) {
        console.error("Error fetching player details:", err);
        return res.status(500).json({ error: "Database query error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json(results[0]);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
