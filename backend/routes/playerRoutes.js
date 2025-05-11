const express = require("express");
const router = express.Router();
const db = require("../config/db");

/*router.get("/top_players", async (req, res) => {
    try {
      //const [players] = await con.promise().query("SELECT * FROM players ORDER BY sold_price DESC limit ");
      const query = `
        SELECT id, name, country, category, sold_price
            FROM players
        WHERE sold_to IS NOT NULL
        ORDER BY sold_price DESC;
      `;
  
      const [players] = await db.promise().query(query);
      res.json(players);
    } catch (error) {
      console.error("Error fetching players:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });*/
router.get("/top_players", async (req, res) => {
    try {
      const query = `
        SELECT id, name,country, category, sold_price, image_url 
        FROM players 
        WHERE sold_price IS NOT NULL 
        ORDER BY sold_price DESC 
        LIMIT 10
      `;
  
      const [topPlayers] = await db.promise().query(query);
      res.json(topPlayers);
    } catch (error) {
      console.error("Error fetching top players:", error);
      res.status(500).json({ message: "Server Error" });
    }
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
