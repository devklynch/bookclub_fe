import { useEffect, useState } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import EventCard from "./components/EventCard";
import axios from "axios";

function AllEvents() {
  const [events, setEvents] = useState({
    upcoming_events: [],
    past_events: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.data.id;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/users/${userId}/events`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvents(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch events");
        setLoading(false);
        console.error(err);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Events</h2>
        <Button variant="outline-secondary" href="/dashboard">
          ← Back to Dashboard
        </Button>
      </div>

      {/* Upcoming Events Section */}
      <div className="mb-5">
        <h3 className="mb-3">Upcoming Events</h3>
        {events.upcoming_events.length === 0 ? (
          <Card
            className="p-4 text-center"
            style={{ backgroundColor: "#f0ecc9" }}
          >
            <p className="mb-0">No upcoming events found.</p>
          </Card>
        ) : (
          <Row>
            {events.upcoming_events.map((event) => (
              <Col key={event.id} md={4} className="mb-3">
                <EventCard
                  event={{
                    ...event.attributes,
                    id: event.id,
                    book_club: { id: event.attributes.book_club_id },
                  }}
                  bookClubId={event.attributes.book_club_id}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Past Events Section */}
      <div>
        <h3 className="mb-3">Past Events</h3>
        {events.past_events.length === 0 ? (
          <Card
            className="p-4 text-center"
            style={{ backgroundColor: "#f0ecc9" }}
          >
            <p className="mb-0">No past events found.</p>
          </Card>
        ) : (
          <Row>
            {events.past_events.map((event) => (
              <Col key={event.id} md={4} className="mb-3">
                <EventCard
                  event={{
                    ...event.attributes,
                    id: event.id,
                    book_club: { id: event.attributes.book_club_id },
                  }}
                  bookClubId={event.attributes.book_club_id}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default AllEvents;
