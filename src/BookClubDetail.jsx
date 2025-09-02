import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Container, Row, Col, Card, Badge } from "react-bootstrap";
import CreateEventModal from "./components/CreateEventModal";
import CreatePollModal from "./components/CreatePollModal";
import EditBookClubModal from "./components/EditBookClubModal";
import InviteMembersModal from "./components/InviteMembersModal";
import axios from "axios";
import { formatEventDate, formatPollDate } from "./utils/dateUtils";

function BookClubDetail() {
  const { id } = useParams(); // this is the bookclub_id
  const [clubData, setClubData] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.data.id;

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/users/${userId}/book_clubs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClubData(response.data.data);
      } catch (err) {
        setError("Failed to fetch book club data.");
        console.error(err);
      }
    };

    fetchClub();
  }, [id]);

  const handleEventCreated = (newEvent) => {
    setClubData((prevData) => ({
      ...prevData,
      attributes: {
        ...prevData.attributes,
        events: [...prevData.attributes.events, newEvent],
      },
    }));
  };

  const handlePollCreated = (newPoll) => {
    setClubData((prevData) => ({
      ...prevData,
      attributes: {
        ...prevData.attributes,
        polls: [...prevData.attributes.polls, newPoll],
      },
    }));
  };
  const handleBookClubUpdated = (updatedClub) => {
    setClubData(updatedClub); // ✅ Replace state with updated club data
  };

  if (error) {
    return (
      <Container className="mt-4">
        <Card className="cozy-container text-center">
          <Card.Body>
            <h3 style={{ color: "var(--danger-color)" }}>📚 Oops!</h3>
            <p>{error}</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (!clubData) {
    return (
      <Container className="mt-4">
        <Card className="cozy-container text-center">
          <Card.Body>
            <h3 style={{ color: "var(--primary-text)" }}>
              📖 Loading your book club...
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Please wait while we gather your literary community
            </p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid style={{ background: "transparent", maxWidth: "1200px" }}>
      {/* Hero Header Section */}
      <Row className="mb-4">
        <Col>
          <div
            style={{
              background: "linear-gradient(135deg, #2d5016 0%, #87a96b 100%)",
              borderRadius: "20px",
              boxShadow:
                "0 10px 40px rgba(61, 47, 42, 0.1), 0 2px 8px rgba(61, 47, 42, 0.05)",
              border: "1px solid rgba(212, 196, 176, 0.3)",
              margin: "1rem",
              padding: "2rem",
              position: "relative",
              overflow: "hidden",
              color: "#faf7f0",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                opacity: "0.3",
                fontSize: "3rem",
              }}
            >
              📚
            </div>
            <Row className="align-items-center">
              <Col md={8}>
                <h1
                  style={{
                    color: "#faf7f0",
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontSize: "2.5rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  📖 {clubData.attributes.name}
                </h1>
                <p
                  style={{
                    color: "#faf7f0",
                    fontSize: "1.1rem",
                    lineHeight: "1.6",
                    marginBottom: "1.5rem",
                    opacity: "0.95",
                  }}
                >
                  {clubData.attributes.description}
                </p>
                <Badge
                  style={{
                    backgroundColor: "rgba(250, 247, 240, 0.2)",
                    color: "#faf7f0",
                    fontSize: "0.9rem",
                    padding: "0.5rem 1rem",
                  }}
                >
                  👥 {clubData.attributes.members.length} member
                  {clubData.attributes.members.length !== 1 ? "s" : ""}
                </Badge>
              </Col>
              <Col md={4} className="text-end">
                {clubData.attributes.user_is_admin && (
                  <Button
                    onClick={() => setShowEditModal(true)}
                    style={{
                      backgroundColor: "rgba(250, 247, 240, 0.15)",
                      borderColor: "rgba(250, 247, 240, 0.3)",
                      color: "#faf7f0",
                      borderRadius: "12px",
                      padding: "0.75rem 1.5rem",
                      fontSize: "1rem",
                      fontWeight: "500",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor =
                        "rgba(250, 247, 240, 0.25)";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor =
                        "rgba(250, 247, 240, 0.15)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    ✏️ Edit Book Club
                  </Button>
                )}
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* Main Content Grid */}
      <Row>
        {/* Members Section */}
        <Col lg={4} className="mb-4">
          <Card className="cozy-container h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3
                  style={{
                    color: "var(--primary-text)",
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontSize: "1.5rem",
                    marginBottom: "0",
                  }}
                >
                  👥 Our Members
                </h3>
                {clubData.attributes.user_is_admin && (
                  <Button
                    size="sm"
                    onClick={() => setShowInviteModal(true)}
                    style={{
                      backgroundColor: "#2d5016",
                      borderColor: "#2d5016",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                    }}
                  >
                    ✉️ Invite
                  </Button>
                )}
              </div>

              {clubData.attributes.members.length === 0 ? (
                <div className="text-center py-4">
                  <div
                    style={{
                      fontSize: "3rem",
                      marginBottom: "1rem",
                      opacity: "0.5",
                    }}
                  >
                    📚
                  </div>
                  <p style={{ color: "var(--text-secondary)" }}>
                    No members yet. Invite some friends to start your literary
                    journey!
                  </p>
                </div>
              ) : (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {clubData.attributes.members.map((member) => (
                    <div
                      key={member.id}
                      style={{
                        padding: "0.75rem",
                        marginBottom: "0.5rem",
                        backgroundColor: "rgba(160, 120, 90, 0.08)",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor =
                          "rgba(160, 120, 90, 0.15)";
                        e.target.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor =
                          "rgba(160, 120, 90, 0.08)";
                        e.target.style.transform = "translateX(0)";
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "#2d5016",
                            color: "#faf7f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            marginRight: "1rem",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          {member.display_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: "500",
                              color: "var(--primary-text)",
                              fontSize: "1rem",
                            }}
                          >
                            {member.display_name}
                          </div>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Events and Polls Section */}
        <Col lg={8}>
          <Row>
            {/* Events Section */}
            <Col className="mb-4">
              <Card className="cozy-container h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3
                      style={{
                        color: "var(--primary-text)",
                        fontFamily: "'Georgia', 'Times New Roman', serif",
                        fontSize: "1.5rem",
                        marginBottom: "0",
                      }}
                    >
                      📅 Upcoming Events
                    </h3>
                    {clubData.attributes.user_is_admin && (
                      <Button
                        size="sm"
                        onClick={() => setShowEventModal(true)}
                        style={{
                          backgroundColor: "#722f37",
                          borderColor: "#722f37",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                        }}
                      >
                        ➕ New Event
                      </Button>
                    )}
                  </div>

                  {clubData.attributes.events.length === 0 ? (
                    <div className="text-center py-4">
                      <div
                        style={{
                          fontSize: "3rem",
                          marginBottom: "1rem",
                          opacity: "0.5",
                        }}
                      >
                        📅
                      </div>
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          marginBottom: "1rem",
                        }}
                      >
                        No events scheduled yet. Create your first book
                        discussion!
                      </p>
                      {clubData.attributes.user_is_admin && (
                        <Button
                          onClick={() => setShowEventModal(true)}
                          style={{
                            backgroundColor: "#722f37",
                            borderColor: "#722f37",
                            borderRadius: "8px",
                          }}
                        >
                          📅 Schedule First Event
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {clubData.attributes.events.map((event) => (
                        <Link
                          key={event.id}
                          to={`/book_clubs/${id}/event/${event.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <div
                            style={{
                              padding: "1rem",
                              marginBottom: "1rem",
                              background:
                                "linear-gradient(135deg, #722f37 0%, #2f4f4f 100%)",
                              color: "#faf7f0",
                              borderRadius: "12px",
                              transition: "all 0.3s ease",
                              position: "relative",
                              overflow: "hidden",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = "translateY(-2px)";
                              e.target.style.boxShadow =
                                "0 8px 20px rgba(114, 47, 55, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = "translateY(0)";
                              e.target.style.boxShadow = "none";
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                opacity: "0.3",
                                fontSize: "2rem",
                              }}
                            >
                              📖
                            </div>
                            <h5
                              style={{
                                color: "#faf7f0",
                                fontSize: "1.1rem",
                                fontWeight: "600",
                                marginBottom: "0.5rem",
                              }}
                            >
                              {event.event_name}
                            </h5>
                            <p
                              style={{
                                color: "#faf7f0",
                                opacity: "0.9",
                                marginBottom: "0.5rem",
                                fontSize: "0.9rem",
                              }}
                            >
                              📅 {formatEventDate(event.event_date)}
                            </p>
                            <p
                              style={{
                                color: "#faf7f0",
                                opacity: "0.8",
                                marginBottom: "0",
                                fontSize: "0.85rem",
                                fontStyle: "italic",
                              }}
                            >
                              📚 {event.book}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Polls Section */}
          <Row>
            <Col>
              <Card className="cozy-container">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3
                      style={{
                        color: "var(--primary-text)",
                        fontFamily: "'Georgia', 'Times New Roman', serif",
                        fontSize: "1.5rem",
                        marginBottom: "0",
                      }}
                    >
                      🗳️ Active Polls
                    </h3>
                    {clubData.attributes.user_is_admin && (
                      <Button
                        size="sm"
                        onClick={() => setShowPollModal(true)}
                        style={{
                          backgroundColor: "#b7472a",
                          borderColor: "#b7472a",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                        }}
                      >
                        ➕ New Poll
                      </Button>
                    )}
                  </div>

                  {clubData.attributes.polls.length === 0 ? (
                    <div className="text-center py-4">
                      <div
                        style={{
                          fontSize: "3rem",
                          marginBottom: "1rem",
                          opacity: "0.5",
                        }}
                      >
                        🗳️
                      </div>
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          marginBottom: "1rem",
                        }}
                      >
                        No polls active. Create one to let members vote on book
                        choices!
                      </p>
                      {clubData.attributes.user_is_admin && (
                        <Button
                          onClick={() => setShowPollModal(true)}
                          style={{
                            backgroundColor: "#b7472a",
                            borderColor: "#b7472a",
                            borderRadius: "8px",
                          }}
                        >
                          🗳️ Create First Poll
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                      {clubData.attributes.polls.map((poll) => (
                        <Link
                          key={poll.id}
                          to={`/poll/${poll.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <div
                            style={{
                              padding: "1rem",
                              marginBottom: "1rem",
                              background:
                                "linear-gradient(135deg, #b7472a 0%, #d4af37 100%)",
                              color: "#faf7f0",
                              borderRadius: "12px",
                              transition: "all 0.3s ease",
                              position: "relative",
                              overflow: "hidden",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = "translateY(-2px)";
                              e.target.style.boxShadow =
                                "0 8px 20px rgba(183, 71, 42, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = "translateY(0)";
                              e.target.style.boxShadow = "none";
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                opacity: "0.3",
                                fontSize: "2rem",
                              }}
                            >
                              🗳️
                            </div>
                            <h5
                              style={{
                                color: "#faf7f0",
                                fontSize: "1.1rem",
                                fontWeight: "600",
                                marginBottom: "0.5rem",
                              }}
                            >
                              {poll.poll_question}
                            </h5>
                            <p
                              style={{
                                color: "#faf7f0",
                                opacity: "0.9",
                                marginBottom: "0",
                                fontSize: "0.85rem",
                              }}
                            >
                              ⏰ Expires: {formatPollDate(poll.expiration_date)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Modals */}
      <EditBookClubModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        bookClub={clubData}
        onBookClubUpdated={handleBookClubUpdated}
      />

      <CreateEventModal
        show={showEventModal}
        handleClose={() => setShowEventModal(false)}
        bookClubId={id}
        onEventCreated={handleEventCreated}
      />

      <CreatePollModal
        show={showPollModal}
        handleClose={() => setShowPollModal(false)}
        bookClubId={id}
        onPollCreated={handlePollCreated}
      />

      <InviteMembersModal
        show={showInviteModal}
        onHide={() => setShowInviteModal(false)}
        bookClubId={id}
        onInvitationSent={() => {
          // Optionally refresh the book club data to show new members
          // For now, we'll just close the modal
        }}
      />
    </Container>
  );
}
export default BookClubDetail;
