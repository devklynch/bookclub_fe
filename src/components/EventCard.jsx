import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function EventCard({ event, bookClubId }) {
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <Link
      to={`/book_clubs/${bookClubId}/event/${event.id}`}
      style={{ textDecoration: "none", color: "#058789" }}
    >
      <Card
        className="p-3 border rounded mb-2 shadow-sm h-100"
        style={{ backgroundColor: "#f0ecc9" }}
      >
        <Card.Body>
          <Card.Title>{event.event_name}</Card.Title>
          <Card.Text>{formatEventDate(event.event_date)}</Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
}

export default EventCard;
