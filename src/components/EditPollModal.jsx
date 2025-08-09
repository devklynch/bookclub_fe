import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function EditPollModal({ show, handleClose, pollData, onPollUpdated }) {
  const [formData, setFormData] = useState({
    poll_question: "",
    expiration_date: "",
    multiple_votes: false,
    options: [],
    to_delete: [],
  });

  useEffect(() => {
    if (pollData) {
      setFormData({
        poll_question: pollData.attributes.poll_question || "",
        expiration_date: pollData.attributes.expiration_date
          ? pollData.attributes.expiration_date.slice(0, 10)
          : "",
        multiple_votes: pollData.attributes.multiple_votes || false,
        options: pollData.attributes.options.map((opt) => ({
          id: opt.id,
          option_text: opt.option_text,
          additional_info: opt.additional_info,
        })),
        to_delete: [],
      });
    }
  }, [pollData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index].option_text = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { option_text: "" }],
    }));
  };

  const removeOption = (index) => {
    const optionToRemove = formData.options[index];
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
      to_delete: optionToRemove.id
        ? [...prev.to_delete, optionToRemove.id]
        : prev.to_delete,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      poll: {
        poll_question: formData.poll_question,
        expiration_date: new Date(formData.expiration_date).toISOString(),
        multiple_votes: formData.multiple_votes,
        options: {
          to_add: formData.options
            .filter((opt) => !opt.id && opt.option_text.trim() !== "")
            .map(({ option_text, additional_info }) => ({
              option_text,
              additional_info,
            })),
          to_update: formData.options
            .filter((opt) => opt.id)
            .map(({ id, option_text, additional_info }) => ({
              id,
              option_text,
              additional_info,
            })),
          to_delete: formData.to_delete,
        },
      },
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/v1/book_clubs/${pollData.attributes.book_club_id}/polls/${pollData.id}`,
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
        const updatedPollJson = await response.json();
        onPollUpdated(updatedPollJson.data);
        handleClose();
      } else {
        console.error("Failed to update poll");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Edit Poll</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="pollQuestion">
            <Form.Label>Poll Question</Form.Label>
            <Form.Control
              type="text"
              name="poll_question"
              value={formData.poll_question}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="expirationDate">
            <Form.Label>Expiration Date</Form.Label>
            <Form.Control
              type="date"
              name="expiration_date"
              value={formData.expiration_date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="multipleVotes" className="mb-3">
            <Form.Check
              type="checkbox"
              label="Allow Multiple Votes"
              name="multiple_votes"
              checked={formData.multiple_votes}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Label>Poll Options</Form.Label>
          {formData.options.map((option, index) => (
            <div key={index} className="d-flex mb-2">
              <Form.Control
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option.option_text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              <Button
                variant="outline-danger"
                onClick={() => removeOption(index)}
                className="ms-2"
              >
                ×
              </Button>
            </div>
          ))}

          <Button variant="link" onClick={addOption} className="p-0">
            + Add Option
          </Button>

          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              style={{ backgroundColor: "#058789", borderColor: "#058789" }}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditPollModal;
