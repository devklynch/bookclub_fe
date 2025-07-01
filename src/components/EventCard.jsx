import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function EventCard({ event }) {
  return (
    <Link
      to={`/event/${event.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Card className="p-3 border rounded mb-2 shadow-sm h-100">
        <Card.Body>
          <Card.Title>{event.event_name}</Card.Title>
          <Card.Text>{event.event_date}</Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
}

export default EventCard;
