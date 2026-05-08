const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/top_players", async (req, res) => {
    try {
      const query = `
        SELECT p.id, p.name, p.country, p.category, p.sold_price, p.image_url, t.name AS sold_to_team
        FROM players p
        LEFT JOIN teams t ON t.id = p.sold_to
        WHERE p.sold_price IS NOT NULL
        ORDER BY p.sold_price DESC
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
