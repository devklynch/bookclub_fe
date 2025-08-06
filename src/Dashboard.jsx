import { useEffect, useState } from "react";
import { Row, Col, Dropdown, Button } from "react-bootstrap";
import BookClubCard from "./components/BookClubCard";
import EventCard from "./components/EventCard";
import PollCard from "./components/PollCard";
import CreateBookClubModal from "./components/CreateBookClubModal";
import axios from "axios";

function Dashboard() {
  const [clubData, setClubData] = useState(null);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchClubData = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.data.id;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/users/${userId}/all_club_data`,
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
            <Dropdown.Item>
              <i className="fas fa-cog me-2"></i>
              Settings
            </Dropdown.Item>
            <Dropdown.Item>
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <h3>Book Clubs</h3>
      <Row>
        {clubData.book_clubs.map((club) => (
          <Col key={club.id} md={4} className="mb-3">
            <BookClubCard club={club} />
          </Col>
        ))}
      </Row>
      <h3>Upcoming Events</h3>
      <Row>
        {clubData.upcoming_events.map((event) => (
          <Col key={event.id} md={4} className="mb-3">
            <EventCard event={event} bookClubId={event.book_club.id} />
          </Col>
        ))}
      </Row>

      <h3>Active Polls</h3>
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
