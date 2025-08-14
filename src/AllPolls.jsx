import { useEffect, useState } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import PollCard from "./components/PollCard";
import axios from "axios";

function AllPolls() {
  const [polls, setPolls] = useState({ active_polls: [], expired_polls: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.data.id;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/polls`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPolls(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch polls");
        setLoading(false);
        console.error(err);
      }
    };

    fetchPolls();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Polls</h2>
        <Button variant="outline-secondary" href="/dashboard">
          ← Back to Dashboard
        </Button>
      </div>

      {/* Active Polls Section */}
      <div className="mb-5">
        <h3 className="mb-3">Active Polls</h3>
        {polls.active_polls.length === 0 ? (
          <Card
            className="p-4 text-center"
            style={{ backgroundColor: "#f0ecc9" }}
          >
            <p className="mb-0">No active polls found.</p>
          </Card>
        ) : (
          <Row>
            {polls.active_polls.map((poll) => (
              <Col key={poll.id} md={4} className="mb-3">
                <PollCard
                  poll={{
                    ...poll.attributes,
                    id: poll.id,
                    book_club: { id: poll.attributes.book_club_id },
                  }}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Expired Polls Section */}
      <div>
        <h3 className="mb-3">Expired Polls</h3>
        {polls.expired_polls.length === 0 ? (
          <Card
            className="p-4 text-center"
            style={{ backgroundColor: "#f0ecc9" }}
          >
            <p className="mb-0">No expired polls found.</p>
          </Card>
        ) : (
          <Row>
            {polls.expired_polls.map((poll) => (
              <Col key={poll.id} md={4} className="mb-3">
                <PollCard
                  poll={{
                    ...poll.attributes,
                    id: poll.id,
                    book_club: { id: poll.attributes.book_club_id },
                  }}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default AllPolls;
