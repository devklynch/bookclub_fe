import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Dropdown, Button } from "react-bootstrap";
import BookClubCard from "./components/BookClubCard";
import EventCard from "./components/EventCard";
import PollCard from "./components/PollCard";
import CreateBookClubModal from "./components/CreateBookClubModal";
import { logout } from "./api";
import axios from "axios";

function Dashboard() {
  const [clubData, setClubData] = useState(null);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubData = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.data.id;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/all_club_data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClubData(response.data.data.attributes);
      } catch (err) {
        setError("Failed to fetch club data");
        console.error(err);
      }
    };

    fetchClubData();
  }, []);

  if (error) return <p>{error}</p>;
  if (!clubData) return <p>Loading...</p>;

  const handleBookClubCreated = (newBookClub) => {
    setClubData((prevData) => ({
      ...prevData,
      book_clubs: [...prevData.book_clubs, newBookClub],
    }));
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        // Navigate to login page
        navigate("/");
      } else {
        // Show error but still redirect (since localStorage is cleared)
        console.error("Logout error:", result.message);
        navigate("/");
      }
    } catch (error) {
      // If anything goes wrong, still redirect to login
      console.error("Logout failed:", error);
      navigate("/");
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {clubData.display_name}</h2>
        <Dropdown>
          <Dropdown.Toggle
            variant="outline-secondary"
            id="dropdown-basic"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              border: "2px solid #6c757d",
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
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Book Clubs</h3>
        <a
          href="/bookclubs"
          className="btn btn-outline-primary btn-sm"
          style={{ borderColor: "#058789", color: "#058789" }}
        >
          Show all clubs
        </a>
      </div>
      <Row>
        {clubData.book_clubs.map((club) => (
          <Col key={club.id} md={4} className="mb-3">
            <BookClubCard club={club} />
          </Col>
        ))}
      </Row>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Upcoming Events</h3>
        <a
          href="/events"
          className="btn btn-outline-primary btn-sm"
          style={{ borderColor: "#058789", color: "#058789" }}
        >
          Show all events
        </a>
      </div>
      <Row>
        {clubData.upcoming_events.map((event) => (
          <Col key={event.id} md={4} className="mb-3">
            <EventCard event={event} bookClubId={event.book_club.id} />
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Active Polls</h3>
        <a
          href="/polls"
          className="btn btn-outline-primary btn-sm"
          style={{ borderColor: "#058789", color: "#058789" }}
        >
          Show all polls
        </a>
      </div>
      <Row>
        {clubData.active_polls.map((poll) => (
          <Col key={poll.id} md={4} className="mb-3">
            <PollCard poll={poll} />
          </Col>
        ))}
      </Row>

      <CreateBookClubModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onBookClubCreated={handleBookClubCreated}
      />
    </div>
  );
}

export default Dashboard;
