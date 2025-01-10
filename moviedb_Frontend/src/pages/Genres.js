import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import Modal from "react-bootstrap/Modal";

const Genres = () => {
  const { genre } = useParams();
  const [genres, setGenres] = useState([
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Drama",
    "Documentary",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Short",
    "Thriller",
  ]);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [yearFilter, setYearFilter] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState(genre || "All Genres");
  const [showAll, setShowAll] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false); // New state for year modal

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      try {
        const endpoint = genre
          ? `http://localhost:5000/api/movies/genre/${genre}`
          : `http://localhost:5000/api/movies`;
        const response = await axios.get(endpoint);
        setMovies(response.data);
        setFilteredMovies(response.data);
        setSelectedGenre(genre || "All Genres");
      } catch (error) {
        console.error("Error fetching movies by genre:", error.message);
      }
    };

    fetchMoviesByGenre();
  }, [genre]);

  // Filter movies by year and sort by top-rated
  useEffect(() => {
    let filtered =
      yearFilter === "all"
        ? movies
        : movies.filter((movie) => movie.year === yearFilter);
    filtered = filtered.sort((a, b) => b.rating - a.rating); // Sort top-rated first
    setFilteredMovies(filtered);
  }, [yearFilter, movies]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  const handleDeleteMovie = async () => {
    if (!selectedMovie) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the movie "${selectedMovie.title}"?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/movies/${selectedMovie._id}`
      );
      const updatedMovies = movies.filter(
        (movie) => movie._id !== selectedMovie._id
      );
      setMovies(updatedMovies);
      setFilteredMovies(updatedMovies);
      setShowModal(false);
      setSelectedMovie(null);
    } catch (error) {
      console.error("Error deleting movie:", error.message);
      alert("Failed to delete the movie. Please try again.");
    }
  };

  const years = [...new Set(movies.map((movie) => movie.year))].sort();

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          {selectedGenre !== "All Genres"
            ? `Movies in ${selectedGenre}`
            : "All Movies"}
        </h2>
        <div>
          <button
            className="btn btn-secondary"
            onClick={() => setShowYearModal(true)} // Open year modal
          >
            Filter by Year
          </button>
        </div>
      </div>

      {filteredMovies.length > 0 && (
        <>
          <div className="row">
            {filteredMovies
              .slice(0, showAll ? filteredMovies.length : 12)
              .map((movie) => (
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
          {!showAll && filteredMovies.length > 12 && (
            <div className="text-center">
              <button
                className="btn btn-secondary"
                onClick={() => setShowAll(true)}
              >
                View All
              </button>
            </div>
          )}
        </>
      )}

      {filteredMovies.length === 0 && (
        <div className="text-center">
          <p>No movies found.</p>
        </div>
      )}

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
          <Modal.Header closeButton>
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
              <div
                style={{
                  flex: "0 0 30%",
                  textAlign: "center",
                }}
              >
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
                  <strong>Year:</strong> {selectedMovie.year}
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
                      padding: "2px 6px", // Padding for the text
                      borderRadius: "5px", // Rounded corners
                      fontWeight: "bold", // Bold text
                      fontSize: "14px", // Font size
                    }}
                  >
                    {selectedMovie.rating || "N/A"}
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
                  title={`${selectedMovie.title} Trailer`}
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
          <Modal.Footer>
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

      {/* Year Filter Modal */}
      <Modal
        show={showYearModal}
        onHide={() => setShowYearModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Year</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap">
            <button
              className={`btn btn-outline-secondary m-2 ${
                yearFilter === "all" ? "active" : ""
              }`}
              onClick={() => {
                setYearFilter("all");
                setShowYearModal(false);
              }}
            >
              All
            </button>
            {years.map((year) => (
              <button
                key={year}
                className={`btn btn-outline-secondary m-2 ${
                  yearFilter === year ? "active" : ""
                }`}
                onClick={() => {
                  setYearFilter(year);
                  setShowYearModal(false);
                }}
              >
                {year}
              </button>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Genres;
