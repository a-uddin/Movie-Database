import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaPlayCircle } from "react-icons/fa";
import MovieCard from "../components/MovieCard";
//import API_URL from '../config';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all"); // New state for year filter
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false); // For movie details
  const [yearModal, setYearModal] = useState(false); // For year selection modal
  const [trailerUrl, setTrailerUrl] = useState(null); // State for trailer URL

  // Fetch movies from the API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/movies");
        setMovies(response.data);
        setFilteredMovies(response.data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Filter movies when filter or yearFilter changes

  useEffect(() => {
    let filtered = movies;

    if (yearFilter !== "all") {
      filtered = filtered.filter((movie) => movie.year === yearFilter);
    }

    // Sort movies by rating in descending order (top-rated first)
    filtered = filtered.sort((a, b) => b.rating - a.rating);

    setFilteredMovies(filtered);
  }, [yearFilter, movies]);

  const handleMovieClick = (movie) => {
    const embedTrailerUrl = movie.trailer
      ? movie.trailer.replace("watch?v=", "embed/")
      : null;
    setSelectedMovie({ ...movie, embedTrailerUrl });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
    setTrailerUrl(null); // Reset trailer URL
  };

  const handleYearFilter = (year) => {
    setYearFilter(year);
    setYearModal(false); // Close year modal
  };

  // Delete Movie Functionality
  const handleDeleteMovie = async () => {
    if (!selectedMovie) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the movie "${selectedMovie.title}"?`
    );
    if (!confirmDelete) return;

    try {
      // Send DELETE request to backend
      await axios.delete(
        `http://localhost:5000/api/movies/${selectedMovie._id}`
      );

      // Update state to remove the deleted movie
      const updatedMovies = movies.filter(
        (movie) => movie._id !== selectedMovie._id
      );
      setMovies(updatedMovies);
      setFilteredMovies(updatedMovies);

      // Close modal after deletion
      setShowModal(false);
      setSelectedMovie(null);
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Failed to delete the movie. Please try again.");
    }
  };

  const years = [...new Set(movies.map((movie) => movie.year))].sort();

  return (
    <div className="container mt-3">
      {/* YouTube Video Section */}
      <div className="mb-4">
        <iframe
          width="100%"
          height="500px"
          src="https://www.youtube.com/embed/wdok0rZdmx4?autoplay=1&mute=1"
          title="YouTube movie trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            borderRadius: "8px",
            border: "none",
            marginBottom: "20px",
          }}
        ></iframe>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          {filter === "top-rated" ? "Top Rated Movies" : "All Movies"}
        </h2>
        <div className="d-flex">
          <div className="dropdown me-2">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="filterDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Filter
            </button>
            <ul className="dropdown-menu" aria-labelledby="filterDropdown">
              <li>
                <button
                  className={`dropdown-item ${
                    filter === "all" ? "active" : ""
                  }`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
              </li>
              <li>
                <button
                  className={`dropdown-item ${
                    filter === "top-rated" ? "active" : ""
                  }`}
                  onClick={() => setFilter("top-rated")}
                >
                  Top Rated
                </button>
              </li>
            </ul>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => setYearModal(true)} // Open year modal
          >
            Year
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredMovies.length > 0 ? (
        <div className="row">
          {filteredMovies.map((movie) => (
            <div
              key={movie._id}
              className="col-md-2 mb-4"
              onClick={() => handleMovieClick(movie)}
              style={{ cursor: "pointer" }}
            >
              <MovieCard
                movie={movie}
                onClick={() => handleMovieClick(movie)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p>No movies found.</p>
        </div>
      )}

      {/* Year Filter Modal */}
      <Modal show={yearModal} onHide={() => setYearModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Year</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)", // 5 columns
              gap: "10px",
            }}
          >
            <button
              className="btn btn-outline-secondary"
              onClick={() => handleYearFilter("all")}
            >
              All
            </button>
            {years.map((year) => (
              <button
                key={year}
                className="btn btn-outline-secondary"
                onClick={() => handleYearFilter(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          centered
          style={{
            maxWidth: "900px",
            width: "95%",
            margin: "0 auto",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Modal.Header closeButton style={{ borderBottom: "1px solid #ddd" }}>
            <Modal.Title style={{ fontSize: "1.5rem" }}>
              {selectedMovie.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ flex: "0 0 30%", textAlign: "center" }}>
                <img
                  src={
                    selectedMovie.poster || "https://via.placeholder.com/150"
                  }
                  alt={selectedMovie.title}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div style={{ flex: "1" }}>
                <p>
                  <strong>Year:</strong> {selectedMovie.year}{" "}
                  {selectedMovie.trailer && (
                    <FaPlayCircle
                      style={{
                        color: "orange",
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                      title="Play Trailer"
                    />
                  )}
                </p>
                <p>
                  <strong>Genre:</strong> {selectedMovie.genre}
                </p>
                <p>
                  <strong>Director:</strong> {selectedMovie.director || "N/A"}
                </p>
                <p>
                  <strong>Actors:</strong> {selectedMovie.actors.join(", ")}
                </p>
                <p>
                  <strong>Rating:</strong>{" "}
                  <span
                    style={{
                      backgroundColor: "#F5C518", // IMDb yellow color
                      color: "black", // Text color
                      padding: "5px 10px", // Padding for the text
                      borderRadius: "5px", // Rounded corners
                      fontWeight: "bold", // Bold text for emphasis
                      fontSize: "14px", // Font size
                    }}
                  >
                    {selectedMovie.rating}
                  </span>
                </p>
              </div>
            </div>
            {selectedMovie.trailer && (
              <div style={{ marginTop: "15px" }}>
                <iframe
                  width="100%"
                  height="315"
                  src={selectedMovie.trailer.replace("watch?v=", "embed/")}
                  title="Movie Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    border: "none",
                    borderRadius: "8px",
                  }}
                ></iframe>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer
            style={{ justifyContent: "center", borderTop: "1px solid #ddd" }}
          >
            <button
              className="btn btn-danger"
              onClick={handleDeleteMovie}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
              }}
            >
              Delete
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleCloseModal}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
              }}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Home;
