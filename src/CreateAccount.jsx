import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "./api";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";

function CreateAccount() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    display_name: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invitationToken, setInvitationToken] = useState(null);
  const [bookClubName, setBookClubName] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for invitation token in URL
  useEffect(() => {
    const token = searchParams.get("invitation_token");
    if (token) {
      setInvitationToken(token);
      // You could also fetch book club info here if needed
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userData = {
        user: formData,
      };

      // Add invitation token if present
      if (invitationToken) {
        userData.invitation_token = invitationToken;
      }

      const response = await api.post("/users", userData);

      const token = response.data.token;
      const user = response.data.user;

      // Save the token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Account created successfully:", user);

      // If there was an invitation, redirect to the book club
      if (invitationToken) {
        navigate("/dashboard");
      } else {
        // Redirect to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        // Extract error messages from the error objects
        const errorMessages = err.response.data.errors.map(
          (error) => error.message
        );
        setError(errorMessages.join(", "));
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center p-0"
      style={{ minHeight: "100vh", width: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="bg-secondary">
            <Card.Body>
              <h2 className="mb-4 text-center">Create Account</h2>

              {/* Show invitation info if present */}
              {invitationToken && (
                <Alert variant="info" className="mb-3">
                  🎉 You're joining a book club! Complete your account to get
                  started.
                </Alert>
              )}

              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formDisplayName" className="mb-3">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="display_name"
                    placeholder="Enter your display name"
                    value={formData.display_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group
                  controlId="formPasswordConfirmation"
                  className="mb-3"
                >
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirm password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="text-center">
                  <small className="text-muted">
                    Already have an account?{" "}
                    <a href="/" style={{ textDecoration: "none" }}>
                      Log in here
                    </a>
                  </small>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateAccount;
