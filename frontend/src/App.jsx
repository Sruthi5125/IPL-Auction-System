import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import AuctionPage from "./components/AuctionPage";
import AddPlayerPage from "./components/AddPlayerPage";
import PlayerListPage from "./components/PlayersListPage";
import UnsoldPlayersPage from "./components/UnsoldPlayersPage";
import MainPage from "./components/MainPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/auction" element={<AuctionPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/add-player" element={<AddPlayerPage />} />
        <Route path="/player" element={<PlayerListPage />} />
        <Route path="/unsold-players" element={<UnsoldPlayersPage />} />
        <Route path="/" element={<MainPage />} />

      </Routes>
    </Router>
  );
}

export default App;
