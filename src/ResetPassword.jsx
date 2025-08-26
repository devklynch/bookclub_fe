import { useState, useEffect } from "react";
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

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const resetToken = searchParams.get("reset_password_token");
    if (resetToken) {
      setToken(resetToken);
    } else {
      setError(
        "Invalid or missing reset token. Please request a new password reset."
      );
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
      const response = await api.put("/users/password", {
        reset_password_token: token,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      console.log("Password reset successfully");

      // Clear any existing auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page
      navigate("/");
    } catch (err) {
      console.log("Error response:", err.response);
      console.log("Error data:", err.response?.data);
      console.log("Error data type:", typeof err.response?.data?.errors);
      console.log(
        "Error data is array:",
        Array.isArray(err.response?.data?.errors)
      );

      if (err.response && err.response.data && err.response.data.errors) {
        // Handle array of error strings
        if (Array.isArray(err.response.data.errors)) {
          setError(err.response.data.errors.join(", "));
        } else {
          // Handle array of error objects
          const errorMessages = err.response.data.errors.map((error) =>
            typeof error === "string" ? error : error.message || error
          );
          setError(errorMessages.join(", "));
        }
      } else if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center p-0 bg-light"
        style={{ minHeight: "100vh", width: "100vh" }}
      >
        <Row className="w-100">
          <Col md={{ span: 6, offset: 3 }}>
            <Card className="bg-secondary">
              <Card.Body>
                <h2 className="mb-4 text-center">Invalid Reset Link</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <div className="text-center">
                  <a href="/forgot_password" className="btn btn-primary">
                    Request New Reset Link
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center p-0 bg-light"
      style={{ minHeight: "100vh", width: "100vh" }}
    >
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="bg-secondary">
            <Card.Body>
              <h2 className="mb-4 text-center">Reset Password</h2>
              <p className="text-muted text-center mb-4">
                Enter your new password below.
              </p>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group
                  controlId="formPasswordConfirmation"
                  className="mb-3"
                >
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirm new password"
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
                  {loading ? "Resetting Password..." : "Reset Password"}
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

export default ResetPassword;
