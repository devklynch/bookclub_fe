import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Dropdown } from "react-bootstrap";
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
import CreateBookClubModal from "./components/CreateBookClubModal";
import { logout } from "./api";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    setIsAuthenticated(token && user);
  }, [location]);

  const handleLogin = (token) => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        setIsAuthenticated(false);
        navigate("/");
      } else {
        console.error("Logout error:", result.message);
        setIsAuthenticated(false);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setIsAuthenticated(false);
      navigate("/");
    }
  };

  const handleBookClubCreated = () => {
    setShowCreateModal(false);
    // Refresh the current page to show the new book club
    window.location.reload();
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background:
          "linear-gradient(135deg, #f5f1eb 0%, #e8ddd4 50%, #d6c8b5 100%)",
        position: "relative",
      }}
    >
      {/* Rain effect element for green and purple raindrops */}
      <div className="rain"></div>
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center my-4">
          <h1
            className="text-center flex-grow-1"
            style={{
              color: "#3d2f2a",
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "3rem",
              fontWeight: "600",
              textShadow: "0 2px 4px rgba(61, 47, 42, 0.1)",
              marginBottom: "0",
            }}
          >
            ☕ Booked & Busy 📚
          </h1>
          {isAuthenticated && (
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                id="dropdown-basic"
                className="warm-glow"
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  border: "2px solid var(--accent-color)",
                  backgroundColor: "var(--card-bg)",
                  color: "var(--primary-text)",
                  boxShadow: "0 4px 12px rgba(61, 47, 42, 0.15)",
                  transition: "all 0.3s ease",
                }}
              >
                ☰
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setShowCreateModal(true)}>
                  <i className="fas fa-plus me-2"></i>
                  Create Book Club
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => navigate("/settings")}>
                  <i className="fas fa-cog me-2"></i>
                  Settings
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
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
          <Route path="/invitation-accepted" element={<InvitationAccepted />} />
          <Route path="/settings" element={<UserSettings />} />
        </Routes>

        <CreateBookClubModal
          show={showCreateModal}
          handleClose={() => setShowCreateModal(false)}
          onBookClubCreated={handleBookClubCreated}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
