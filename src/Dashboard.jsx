import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import BookClubCard from "./components/BookClubCard";
import EventCard from "./components/EventCard";
import PollCard from "./components/PollCard";
import axios from "axios";

function Dashboard() {
  const [clubData, setClubData] = useState(null);
  const [error, setError] = useState(null);

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

  return (
    <div className="p-4">
      <h2>Welcome, {clubData.display_name}</h2>

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
            <EventCard event={event} onClick={(event) => console.log(event)} />
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
    </div>
  );
}

export default Dashboard;
