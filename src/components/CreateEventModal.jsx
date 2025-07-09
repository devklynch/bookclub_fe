import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function CreateEventModal({ show, handleClose, bookClubId, onEventCreated }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Hello</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>This is the modal content.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateEventModal;
