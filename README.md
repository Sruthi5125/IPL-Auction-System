# IPL Auction System

A full-stack real-time IPL (Indian Premier League) auction management system where an admin conducts live player auctions and team management representatives bid on players in real time.

---

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Application Routes](#application-routes)
- [Socket.IO Events](#socketio-events)
- [Deployment](#deployment)

---

## Project Description

The IPL Auction System simulates a live cricket auction experience. An admin controls the auction by selecting players to put up for bid. Team management representatives log in, watch the live auction, and place bids in real time. The system tracks budgets, sold/unsold players, and team rosters automatically.

---

## Features

### Admin
- Secure admin login using environment variable credentials
- Add new players with photos, stats, and base price
- Conduct live auctions — start bidding on any player
- Real-time countdown timer per player
- View top buys and unsold players
- Overview of all teams with budgets and player counts

### Team Management
- Register a new team with team name, username, budget, coach, captain, owner, and team logo
- Login with registered credentials
- Watch live auctions in real time
- Place bids within remaining budget
- View team roster with sold prices
- View detailed player stats on click

### General
- Role-based access — Admin and Team Management have separate flows
- Real-time bid updates pushed to all connected clients via WebSockets
- Responsive UI with animated backgrounds

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.0 | UI framework |
| Vite | 6.2 | Build tool and dev server |
| React Router DOM | 7.3 | Client-side routing |
| Socket.IO Client | 4.8 | Real-time WebSocket communication |
| Axios | 1.8 | HTTP requests |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | — | Runtime |
| Express | 4.21 | REST API server |
| Socket.IO | 4.8 | Real-time WebSocket server |
| MySQL2 | 3.13 | Database driver |
| Multer | 1.4.5 | File upload handling |
| dotenv | 16.4 | Environment variable management |
| CORS | 2.8 | Cross-origin request handling |
| Nodemon | 3.1 | Dev auto-restart |

### Database
- **MySQL** — relational database for teams and players


---

## Project Structure

```
IPL PACKAGE/
├── Backend/
│   ├── config/
│   │   └── db.js               # MySQL connection
│   ├── routes/
│   │   ├── authRoutes.js       # Login, register, team endpoints
│   │   ├── auctionRoutes.js    # Player listing and bid endpoints
│   │   └── playerRoutes.js     # Add player, top buys, unsold players
│   ├── uploads/                # Uploaded player and team images (gitignored)
│   ├── server.js               # Express + Socket.IO server entry point
│   ├── .env                    # Environment variables (gitignored)
│   └── package.json
│
└── Frontend/
    ├── public/                 # Static background images
    ├── src/
    │   ├── components/
    │   │   ├── LoginPage.jsx       # Role-based login and team registration
    │   │   ├── MainPage.jsx        # Admin dashboard — team overview + navbar
    │   │   ├── AuctionPage.jsx     # Admin — conduct live auction
    │   │   ├── HomePage.jsx        # Team view — live bidding + roster
    │   │   ├── AddPlayerPage.jsx   # Admin — add new player
    │   │   ├── PlayersListPage.jsx # Top buys list
    │   │   └── UnsoldPlayersPage.jsx
    │   ├── config.js           # Central API URL config
    │   ├── App.jsx             # Route definitions
    │   └── main.jsx
    ├── .env                    # Frontend env variables (gitignored)
    ├── vercel.json             # Vercel SPA rewrite rule
    └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL (v8+)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/Sruthi5125/IPL-Auction-System.git
cd IPL-Auction-System
```

### 2. Set up the database

Create a MySQL database and run the following schema:

```sql
CREATE DATABASE ipl_auction;
USE ipl_auction;

CREATE TABLE teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(100),
  password VARCHAR(100),
  budget DECIMAL(10,2) DEFAULT 1000,
  coach VARCHAR(100),
  captain VARCHAR(100),
  owner VARCHAR(100),
  image_url VARCHAR(255)
);

CREATE TABLE players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(100),
  category VARCHAR(50),
  age INT,
  batting_style VARCHAR(50),
  bowling_style VARCHAR(50),
  fifty INT DEFAULT 0,
  hundred INT DEFAULT 0,
  total_runs INT DEFAULT 0,
  wickets_taken INT DEFAULT 0,
  basePrice DECIMAL(10,2),
  sold_price DECIMAL(10,2),
  sold_to INT,
  image_url VARCHAR(255),
  FOREIGN KEY (sold_to) REFERENCES teams(id)
);
```

### 3. Set up the Backend

```bash
cd Backend
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables)), then start the server:

```bash
npm start
```

The backend runs on `http://localhost:5000` by default.

### 4. Set up the Frontend

```bash
cd Frontend
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:5000
```

Then start the dev server:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

---

## Environment Variables

### Backend — `Backend/.env`

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ipl_auction
PORT=5000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:5173
```

### Frontend — `Frontend/.env`

```
VITE_API_URL=http://localhost:5000
```

---

## Database Schema

### `teams` table
| Column | Type | Description |
|---|---|---|
| id | INT | Primary key |
| name | VARCHAR | Team display name |
| username | VARCHAR | Login username |
| password | VARCHAR | Login password |
| budget | DECIMAL | Remaining auction budget |
| coach | VARCHAR | Team coach name |
| captain | VARCHAR | Team captain name |
| owner | VARCHAR | Team owner name |
| image_url | VARCHAR | Team logo filename |

### `players` table
| Column | Type | Description |
|---|---|---|
| id | INT | Primary key |
| name | VARCHAR | Player name |
| country | VARCHAR | Nationality |
| category | VARCHAR | Batsman / Bowler / All-rounder / WK |
| age | INT | Player age |
| batting_style | VARCHAR | Right/Left hand bat |
| bowling_style | VARCHAR | Bowling type |
| fifty | INT | Career half-centuries |
| hundred | INT | Career centuries |
| total_runs | INT | Career runs |
| wickets_taken | INT | Career wickets |
| basePrice | DECIMAL | Starting bid price |
| sold_price | DECIMAL | Final sold price (null if unsold) |
| sold_to | INT | Foreign key to teams.id |
| image_url | VARCHAR | Player photo filename |

---

## Application Routes

| Path | Component | Access |
|---|---|---|
| `/` | LoginPage | Public |
| `/main` | MainPage | Admin |
| `/auction` | AuctionPage | Admin |
| `/player` | PlayersListPage | Admin |
| `/unsold-players` | UnsoldPlayersPage | Admin |
| `/home` | HomePage | Team Management |

---

## Socket.IO Events

| Event | Direction | Description |
|---|---|---|
| `startBid` | Client → Server | Admin starts bidding on a player |
| `bidStarted` | Server → All clients | Broadcasts player info and base price |
| `placeBid` | Client → Server | Team places a bid |
| `updateBid` | Server → All clients | Broadcasts new highest bid and bidder |
| `updateTimer` | Server → All clients | Broadcasts remaining time each second |
| `auctionEnded` | Server → All clients | Signals bidding has closed for that player |

---
