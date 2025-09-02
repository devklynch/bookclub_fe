import { useEffect, useState } from "react";
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

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // If already authenticated, redirect to dashboard
    if (token && user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/sign_in", {
        email,
        password,
      });
      const token = response.data.token;
      const user = response.data.user;
      // Save the token (optional: localStorage, context, etc.)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Call any callback passed in (optional)
      if (onLogin) onLogin(token);

      // // Redirect to another page (home, dashboard, etc.)
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center p-0 login-page-container"
    >
      <div className="window-drops"></div>
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
          <Card className="cozy-container warm-glow login-card">
            <div className="book-corner top-left"></div>
            <div className="book-corner bottom-right"></div>
            <Card.Body>
              <h2 className="mb-4 text-center coffee-steam login-title">
                ☕ Login 📚
              </h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label className="login-form-label">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="login-form-input"
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label className="login-form-label">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-form-input"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3 warm-glow login-submit-button"
                >
                  Log In
                </Button>

                <div className="text-center">
                  <small className="auth-text">
                    Don't have an account?{" "}
                    <a href="/create_account" className="auth-link-create">
                      Create one here
                    </a>
                  </small>
                </div>
                <div className="text-center mt-2">
                  <small className="auth-text">
                    <a href="/forgot_password" className="auth-link-forgot">
                      Forgot your password?
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

export default Login;
