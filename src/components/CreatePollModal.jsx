import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function CreatePollModal({ show, handleClose, bookClubId, onPollCreated }) {
  const [formData, setFormData] = useState({
    poll_question: "",
    expiration_date: "",
    multiple_votes: false,
    options: [{ option_text: "" }],
  });

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
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      poll_question: formData.poll_question,
      expiration_date: new Date(formData.expiration_date).toISOString(),
      multiple_votes: formData.multiple_votes,
      options_attributes: formData.options.filter(
        (opt) => opt.option_text.trim() !== ""
      ),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/v1/book_clubs/${bookClubId}/polls`,
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
        const newPollJson = await response.json();
        const newPoll = {
          id: newPollJson.data.id,
          ...newPollJson.data.attributes,
        };
        onPollCreated(newPoll);
        handleClose();
        // Reset form
        setFormData({
          poll_question: "",
          expiration_date: "",
          multiple_votes: false,
          options: [{ option_text: "" }],
        });
      } else {
        console.error("Failed to create poll");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Poll</Modal.Title>
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

          <Form.Group controlId="multipleVotes">
            <Form.Check
              type="checkbox"
              label="Allow Multiple Votes"
              name="multiple_votes"
              checked={formData.multiple_votes}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Label className="mt-3">Poll Options</Form.Label>
          {formData.options.map((option, index) => (
            <div key={index} className="d-flex mb-2">
              <Form.Control
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option.option_text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              {formData.options.length > 1 && (
                <Button
                  variant="outline-danger"
                  onClick={() => removeOption(index)}
                  className="ms-2"
                >
                  ×
                </Button>
              )}
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
  
            >
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreatePollModal;
