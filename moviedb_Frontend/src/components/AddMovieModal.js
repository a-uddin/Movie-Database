import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";

const AddMovieModal = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    genre: "",
    director: "",
    actors: "",
    rating: "",
    poster: "",
    trailer: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/movies", {
        ...formData,
        actors: formData.actors.split(",").map((actor) => actor.trim()),
      });
      alert("Movie added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding movie:", error.message);
      alert("Failed to add the movie. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Movie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formYear">
            <Form.Label>Year</Form.Label>
            <Form.Control
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formGenre">
            <Form.Label>Genre</Form.Label>
            <Form.Control
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formDirector">
            <Form.Label>Director</Form.Label>
            <Form.Control
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formActors">
            <Form.Label>Actors (comma separated)</Form.Label>
            <Form.Control
              type="text"
              name="actors"
              value={formData.actors}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formRating">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formPoster">
            <Form.Label>Poster URL</Form.Label>
            <Form.Control
              type="text"
              name="poster"
              value={formData.poster}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formTrailer">
            <Form.Label>Trailer URL</Form.Label>
            <Form.Control
              type="text"
              name="trailer"
              value={formData.trailer}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Add Movie
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddMovieModal;
