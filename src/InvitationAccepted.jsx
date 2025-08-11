import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";

function InvitationAccepted() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = searchParams.get("token");
  const bookClub = searchParams.get("book_club");

  useEffect(() => {
    // Check if user is logged in
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      setError("Please log in to complete your invitation acceptance.");
      setLoading(false);
      return;
    }

    // If user is logged in and we have the token, they should already be in the club
    setLoading(false);
  }, [token]);

  if (loading) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Body className="text-center">
                <h3>Processing your invitation...</h3>
                <p>Please wait while we add you to the book club.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Alert variant="danger">
              <h4>Something went wrong</h4>
              <p>{error}</p>
              <Button
                variant="primary"
                onClick={() => navigate("/")}
                className="me-2"
              >
                Go to Login
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="text-center">
            <Card.Body>
              <div className="mb-4">
                <h1>🎉 Welcome to the Book Club!</h1>
                <h3 className="text-success">{decodeURIComponent(bookClub)}</h3>
              </div>

              <Alert variant="success">
                <h4>You've successfully joined!</h4>
                <p>
                  You're now a member of{" "}
                  <strong>{decodeURIComponent(bookClub)}</strong>. You can start
                  participating in discussions, events, and polls right away!
                </p>
              </Alert>

              <div className="mt-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/dashboard")}
                  className="me-3"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={() => navigate("/bookclubs")}
                >
                  View All Book Clubs
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default InvitationAccepted;
