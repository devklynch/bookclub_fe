import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
function PollCard({ poll }) {
  return (
    <Link
      to={`/poll/${poll.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Card className="p-3 border rounded mb-2 shadow-sm h-100">
        <Card.Body>
          <Card.Title>{poll.question}</Card.Title>
          <Card.Text>Poll Info</Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
}
export default PollCard;
