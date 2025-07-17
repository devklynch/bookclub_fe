import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import BookClubDetail from "./BookClubDetail";
import PollDetail from "./PollDetail";
import EventDetail from "./EventDetail";

function App() {
  const handleLogin = (token) => {
    console.log("Logged in with token:", token);
  };

  return (
    <div className="bg-primary p-2">
      <h1 className="text-center my-4">Booked & Busy</h1>
      <Router>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookclub/:id" element={<BookClubDetail />} />
          <Route path="/poll/:id" element={<PollDetail />} />
          <Route
            path="/book_clubs/:bookClubId/event/:id"
            element={<EventDetail />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
