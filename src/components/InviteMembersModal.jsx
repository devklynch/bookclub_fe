import React, { useState } from "react";
import { Modal, Button, Form, Alert, ListGroup } from "react-bootstrap";
import axios from "axios";

function InviteMembersModal({ show, onHide, bookClubId, onInvitationSent }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [invitations, setInvitations] = useState([]);
  const [showInvitations, setShowInvitations] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:3000/api/v1/book_clubs/${bookClubId}/invitations`,
        { invitation: { email } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(`Invitation sent to ${email}!`);
      setEmail("");

      // Refresh invitations list
      fetchInvitations();

      if (onInvitationSent) {
        onInvitationSent();
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(", "));
      } else {
        setError("Failed to send invitation. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/v1/book_clubs/${bookClubId}/invitations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInvitations(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch invitations:", err);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      accepted: "success",
      declined: "danger",
      expired: "secondary",
    };
    return (
      <span className={`badge bg-${variants[status] || "secondary"}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Invite Members</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
            <Form.Text className="text-muted">
              We'll send an invitation email to this address. If they don't have
              an account yet, they'll be prompted to create one.
            </Form.Text>
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <div className="d-flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Invitation"}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => {
                setShowInvitations(!showInvitations);
                if (!showInvitations) {
                  fetchInvitations();
                }
              }}
            >
              {showInvitations ? "Hide" : "View"} Invitations
            </Button>
          </div>
        </Form>

        {showInvitations && (
          <div className="mt-4">
            <h6>Recent Invitations</h6>
            {invitations.length === 0 ? (
              <p className="text-muted">No invitations sent yet.</p>
            ) : (
              <ListGroup>
                {invitations.map((invitation) => (
                  <ListGroup.Item
                    key={invitation.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{invitation.attributes.email}</strong>
                      <br />
                      <small className="text-muted">
                        Sent by {invitation.attributes.invited_by.email} on{" "}
                        {formatDate(invitation.attributes.created_at)}
                      </small>
                    </div>
                    <div className="text-end">
                      {getStatusBadge(invitation.attributes.status)}
                      {invitation.attributes.is_expired && (
                        <div className="text-danger small">Expired</div>
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default InviteMembersModal;
