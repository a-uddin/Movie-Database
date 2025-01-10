import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

const UpdateMovieModal = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    title: "", // Title instead of ID
    year: "",
    genre: "",
    director: "",
    actors: "",
    rating: "",
    poster: "",
    trailer: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      alert("Title is required to update a movie.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/movies/update",
        formData
      );
      alert(response.data.message);
      onClose(); // Close the modal after success
    } catch (err) {
      console.error("Error updating movie:", err.message);
      alert("Failed to update the movie. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Movie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter Movie Title to update"
              required
              style={{ fontSize: "12px", fontStyle: "italic", padding: "8px" }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Year</label>
            <input
              type="text"
              className="form-control"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              placeholder="Leave empty to keep unchanged"
              style={{ fontSize: "12px", fontStyle: "italic", padding: "8px" }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Genre</label>
            <input
              type="text"
              className="form-control"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              placeholder="Leave empty to keep unchanged"
              style={{ fontSize: "12px", fontStyle: "italic", padding: "8px" }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Director</label>
            <input
              type="text"
              className="form-control"
              name="director"
              value={formData.director}
              onChange={handleInputChange}
              placeholder="Leave empty to keep unchanged"
              style={{ fontSize: "12px", fontStyle: "italic", padding: "8px" }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Actors (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              name="actors"
              value={formData.actors}
              onChange={handleInputChange}
              placeholder="Leave empty to keep unchanged"
              style={{ fontSize: "12px", fontStyle: "italic", padding: "8px" }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Rating</label>
            <input
              type="number"
              className="form-control"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              placeholder="Leave empty to keep unchanged"
              step="0.1"
              style={{ fontSize: "12px", fontStyle: "italic", padding: "8px" }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Poster</label>
            <input
              type="text"
              className="form-control"
              name="poster"
              value={formData.poster}
              onChange={handleInputChange}
              placeholder="Leave empty to keep unchanged"
              style={{ fontSize: "12px", fontStyle: "italic", padding: "8px" }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Trailer</label>
            <input
              type="text"
              className="form-control"
              name="trailer"
              value={formData.trailer}
              onChange={handleInputChange}
              placeholder="Leave empty to keep unchanged"
              style={{ fontSize: "12px", fontStyle: "italic", padding: "8px" }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Update Movie
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateMovieModal;
