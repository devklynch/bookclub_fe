import { useEffect, useState } from "react";
import axios from "axios";
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
      console.log(
        "Token:",
        token,
        "Email:",
        email,
        "User:",
        user,
        "User ID:",
        user.data.id
      );
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
      className="d-flex justify-content-center align-items-center p-0 bg-primary"
      style={{ minHeight: "100vh", width: "100vh" }}
    >
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="bg-secondary">
            <Card.Body>
              <h2 className="mb-4 text-center">Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Log In
                </Button>

                <div className="text-center">
                  <small className="text-muted">
                    Don't have an account?{" "}
                    <a
                      href="/create_account"
                      style={{ textDecoration: "none" }}
                    >
                      Create one here
                    </a>
                  </small>
                </div>
                <div className="text-center mt-2">
                  <small className="text-muted">
                    <a
                      href="/forgot_password"
                      style={{ textDecoration: "none" }}
                    >
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
