import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Dashboard from "./Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import BookClubDetail from "./BookClubDetail";
import PollDetail from "./PollDetail";
import EventDetail from "./EventDetail";
import AllBookClubs from "./AllBookClubs";
import AllEvents from "./AllEvents";
import AllPolls from "./AllPolls";
import InvitationAccepted from "./InvitationAccepted";
import UserSettings from "./UserSettings";

function App() {
  const handleLogin = (token) => {};

  return (
    <div
      className="min-vh-100"
      style={{
        background:
          "linear-gradient(135deg, #f5f1eb 0%, #e8ddd4 50%, #d6c8b5 100%)",
        position: "relative",
      }}
    >
      <div className="container-fluid p-4">
        <h1
          className="text-center my-4"
          style={{
            color: "#3d2f2a",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "3rem",
            fontWeight: "600",
            textShadow: "0 2px 4px rgba(61, 47, 42, 0.1)",
            marginBottom: "2rem",
          }}
        >
          ☕ Booked & Busy 📚
        </h1>
        <Router>
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/create_account" element={<CreateAccount />} />
            <Route path="/forgot_password" element={<ForgotPassword />} />
            <Route path="/reset_password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookclubs" element={<AllBookClubs />} />
            <Route path="/events" element={<AllEvents />} />
            <Route path="/polls" element={<AllPolls />} />
            <Route path="/bookclub/:id" element={<BookClubDetail />} />
            <Route path="/poll/:id" element={<PollDetail />} />
            <Route
              path="/book_clubs/:bookClubId/event/:id"
              element={<EventDetail />}
            />
            <Route
              path="/invitation-accepted"
              element={<InvitationAccepted />}
            />
            <Route path="/settings" element={<UserSettings />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
