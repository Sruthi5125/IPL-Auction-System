const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

require('dotenv').config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.post("/admin-login", (req, res) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  if (username === adminUsername && password === adminPassword) {
    return res.json({ message: "Admin login successful", role: "admin" });
  }
  return res.status(401).json({ error: "Invalid admin credentials" });
});

router.post("/register", upload.single("teamImage"), (req, res) => {
  const { teamName, username, password, budget, coach, captain, owner } = req.body;

  if (!teamName || !username || !password || !budget) {
    return res.status(400).json({ error: "Team name, username, password, and budget are required" });
  }

  const imageUrl = req.file ? req.file.filename : null;

  db.query("SELECT id, name, username FROM teams WHERE name = ?", [teamName], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ error: "Team not found. Check the team name and try again." });
    if (results[0].username) return res.status(400).json({ error: "Team already registered. Please login instead." });

    const teamId = results[0].id;

    db.query("SELECT id FROM teams WHERE username = ? AND id != ?", [username, teamId], (err2, usernameCheck) => {
      if (err2) return res.status(500).json({ error: "Database error" });
      if (usernameCheck.length > 0) return res.status(400).json({ error: "Username already taken. Choose a different username." });

      const updateValues = [
        username,
        password,
        Number(budget),
        coach || null,
        captain || null,
        owner || null,
      ];

      let sql = "UPDATE teams SET username = ?, password = ?, budget = ?, coach = ?, captain = ?, owner = ?";

      if (imageUrl) {
        sql += ", image_url = ?";
        updateValues.push(imageUrl);
      }

      sql += " WHERE id = ?";
      updateValues.push(teamId);

      db.query(sql, updateValues, (err3) => {
        if (err3) return res.status(500).json({ error: "Registration failed" });
        res.json({
          message: "Registration successful",
          team: { id: teamId, name: teamName, budget: Number(budget) }
        });
      });
    });
  });
});

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
    res.json({ message: "Login successful", team: { id: team.id, name: team.name, budget: team.budget } });
  });
});

router.get("/teams/available", (req, res) => {
  db.query("SELECT id, name FROM teams WHERE username IS NULL", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
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
