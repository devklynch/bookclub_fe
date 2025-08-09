import { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import BookClubCard from "./components/BookClubCard";
import axios from "axios";

function AllBookClubs() {
  const [bookClubs, setBookClubs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookClubs = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.data.id;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/users/${userId}/book_clubs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookClubs(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch book clubs");
        setLoading(false);
        console.error(err);
      }
    };

    fetchBookClubs();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Book Clubs</h2>
        <Button variant="outline-secondary" href="/dashboard">
          ← Back to Dashboard
        </Button>
      </div>

      {bookClubs.length === 0 ? (
        <div className="text-center py-5">
          <h4>No book clubs found</h4>
          <p>You haven't joined any book clubs yet.</p>
        </div>
      ) : (
        <Row>
          {bookClubs.map((club) => (
            <Col key={club.id} md={4} className="mb-3">
              <BookClubCard club={club.attributes} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default AllBookClubs;
