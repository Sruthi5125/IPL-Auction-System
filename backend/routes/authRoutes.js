const express = require('express');
const router = express.Router();
const db = require('../config/db');

require('dotenv').config();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const sql = "SELECT * FROM teams WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const team = results[0];
    res.json({ message: "Login successful", team: { id: team.id, name: team.name, budget:team.budget} });
  });
});


router.post("/teamMembers", (req, res) => {
  const { teamNo } = req.body;

  if (!teamNo) {
    return res.status(400).json({ error: "Team Number is required" });
  }
  const sql = "SELECT * FROM players WHERE sold_to = ?";
  db.query(sql, [teamNo], (err, results) => {
    if (err) {
      console.error("Error fetching players:", err);
      res.status(500).send("Database error");
    } else {
      res.json(results);
    }
  });
});

module.exports = router;