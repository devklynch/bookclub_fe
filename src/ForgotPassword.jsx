import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post("/users/password", {
        email: email,
      });

      setSuccess(
        <div>
          <p>{response.data.message}</p>
          <p className="mt-3">
            <strong>📧 Check your email!</strong>
          </p>
          <p className="text-muted">
            We've sent password reset instructions to your email address. Click
            the link in the email to reset your password.
          </p>
          <p className="text-muted small">
            <strong>Note:</strong> The reset link will expire in 6 hours.
          </p>
        </div>
      );
      setEmail("");
    } catch (err) {
      console.log("Error response:", err.response);
      console.log("Error data:", err.response?.data);

      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = err.response.data.errors.map(
          (error) => error.message
        );
        setError(errorMessages.join(", "));
      } else {
        setError("Failed to send password reset email. Please try again.");
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
              <h2 className="mb-4 text-center">Forgot Password</h2>
              <p className="text-muted text-center mb-4">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="text-center">
                  <small className="text-muted">
                    Remember your password?{" "}
                    <a href="/" className="text-decoration-none">
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

export default ForgotPassword;
