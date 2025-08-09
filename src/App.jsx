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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
