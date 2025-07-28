import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function EditEventModal({ show, handleClose, eventData, onEventUpdated }) {
  const [formData, setFormData] = useState({
    event_name: "",
    event_date: "",
    location: "",
    event_notes: "",
    book: "",
  });

  useEffect(() => {
    if (eventData) {
      setFormData({
        event_name: eventData.attributes.event_name || "",
        event_date: eventData.attributes.event_date
          ? eventData.attributes.event_date.slice(0, 10)
          : "",
        location: eventData.attributes.location || "",
        event_notes: eventData.attributes.event_notes || "",
        book: eventData.attributes.book || "",
      });
    }
  }, [eventData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      event: {
        event_name: formData.event_name,
        event_date: new Date(formData.event_date).toISOString(),
        location: formData.location,
        event_notes: formData.event_notes,
        book: formData.book,
      },
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/v1/book_clubs/${eventData.attributes.book_club_id}/events/${eventData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const updatedEventJson = await response.json();
        onEventUpdated(updatedEventJson.data);
        handleClose();
      } else {
        console.error("Failed to update event");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="eventName">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              type="text"
              name="event_name"
              value={formData.event_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="eventDate">
            <Form.Label>Event Date</Form.Label>
            <Form.Control
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="location">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="book">
            <Form.Label>Book</Form.Label>
            <Form.Control
              type="text"
              name="book"
              value={formData.book}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="eventNotes">
            <Form.Label>Event Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="event_notes"
              value={formData.event_notes}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditEventModal;
