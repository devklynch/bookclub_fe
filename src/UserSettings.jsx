import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { updateUser } from "./api";

function UserSettings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form states
  const [profileForm, setProfileForm] = useState({
    email: "",
    display_name: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.data) {
      setUser(userData.data);
      setProfileForm({
        email: userData.data.attributes.email,
        display_name: userData.data.attributes.display_name,
      });
    } else {
      // Redirect to login if no user data
      navigate("/");
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    return errors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    setProfileErrors({});

    // Client-side validation
    const errors = {};
    if (!profileForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(profileForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!profileForm.display_name.trim()) {
      errors.display_name = "Display name is required";
    } else if (profileForm.display_name.trim().length < 2) {
      errors.display_name = "Display name must be at least 2 characters";
    } else if (profileForm.display_name.trim().length > 50) {
      errors.display_name = "Display name must be less than 50 characters";
    }

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const result = await updateUser(user.id, {
        email: profileForm.email.trim(),
        display_name: profileForm.display_name.trim(),
      });

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        setUser(result.user);
      } else {
        setMessage({ type: "danger", text: result.message });
        setProfileErrors(result.errors || {});
      }
    } catch (error) {
      setMessage({ type: "danger", text: "An unexpected error occurred" });
    }

    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    setPasswordErrors({});

    // Client-side validation
    const errors = {};
    if (!passwordForm.current_password) {
      errors.current_password = "Current password is required";
    }

    if (!passwordForm.password) {
      errors.password = "New password is required";
    } else {
      const passwordValidationErrors = validatePassword(passwordForm.password);
      if (passwordValidationErrors.length > 0) {
        errors.password = passwordValidationErrors;
      }
    }

    if (!passwordForm.password_confirmation) {
      errors.password_confirmation = "Password confirmation is required";
    } else if (passwordForm.password !== passwordForm.password_confirmation) {
      errors.password_confirmation = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const result = await updateUser(user.id, passwordForm);

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        setPasswordForm({
          current_password: "",
          password: "",
          password_confirmation: "",
        });
      } else {
        setMessage({ type: "danger", text: result.message });
        setPasswordErrors(result.errors || {});
      }
    } catch (error) {
      setMessage({ type: "danger", text: "An unexpected error occurred" });
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Account Settings</h2>
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>

          {message.text && (
            <Alert variant={message.type} className="mb-4">
              {message.text}
            </Alert>
          )}

          {/* Profile Information Card */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Profile Information</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleProfileSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    isInvalid={!!profileErrors.email}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {Array.isArray(profileErrors.email)
                      ? profileErrors.email.join(", ")
                      : profileErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileForm.display_name}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        display_name: e.target.value,
                      })
                    }
                    isInvalid={!!profileErrors.display_name}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {Array.isArray(profileErrors.display_name)
                      ? profileErrors.display_name.join(", ")
                      : profileErrors.display_name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  style={{ backgroundColor: "#058789", borderColor: "#058789" }}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Change Password Card */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Change Password</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordForm.current_password}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        current_password: e.target.value,
                      })
                    }
                    isInvalid={!!passwordErrors.current_password}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {Array.isArray(passwordErrors.current_password)
                      ? passwordErrors.current_password.join(", ")
                      : passwordErrors.current_password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordForm.password}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        password: e.target.value,
                      })
                    }
                    isInvalid={!!passwordErrors.password}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {Array.isArray(passwordErrors.password)
                      ? passwordErrors.password.join(", ")
                      : passwordErrors.password}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Password must be at least 6 characters with 1 uppercase
                    letter, 1 lowercase letter, and 1 number.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordForm.password_confirmation}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        password_confirmation: e.target.value,
                      })
                    }
                    isInvalid={!!passwordErrors.password_confirmation}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {Array.isArray(passwordErrors.password_confirmation)
                      ? passwordErrors.password_confirmation.join(", ")
                      : passwordErrors.password_confirmation}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  style={{ backgroundColor: "#058789", borderColor: "#058789" }}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UserSettings;
