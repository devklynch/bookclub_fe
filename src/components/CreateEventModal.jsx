import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function CreateEventModal({ show, handleClose, bookClubId, onEventCreated }) {
  const [formData, setFormData] = useState({
    event_name: "",
    event_date: "",
    event_time: "",
    location: "",
    book: "",
    event_notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const combinedDateTime = new Date(
      `${formData.event_date}T${formData.event_time}`
    );
    const eventDateISO = combinedDateTime.toISOString();

    const payload = {
      ...formData,
      event_date: eventDateISO, // overwrite with full datetime
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/v1/book_clubs/${bookClubId}/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const newEventJson = await response.json();
        const newEvent = {
          id: newEventJson.data.id,
          ...newEventJson.data.attributes,
        };
        onEventCreated(newEvent);
        handleClose();
        setFormData({
          event_name: "",
          event_date: "",
          location: "",
          book: "",
          event_notes: "",
        });
      } else {
        console.error("Failed to create event");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Event</Modal.Title>
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
          <Form.Group controlId="eventTime">
            <Form.Label>Event Time</Form.Label>
            <Form.Control
              type="time"
              name="event_time"
              value={formData.event_time}
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
              name="event_notes"
              rows={3}
              value={formData.event_notes}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateEventModal;
