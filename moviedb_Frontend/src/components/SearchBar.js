import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { FaPlayCircle } from "react-icons/fa";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const searchContainerRef = useRef(null);

  const handleInputChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 2) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/movies/search?q=${term}`
        );
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    } else {
      setMovies([]);
    }
  };

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
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !showModal &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setSearchTerm("");
        setMovies([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  return (
    <div ref={searchContainerRef} style={{ position: "relative" }}>
      <Form.Control
        type="text"
        placeholder="Search MovieDB"
        value={searchTerm}
        onChange={handleInputChange}
        style={{ width: "300px", margin: "10px auto" }}
      />
      {movies.length > 0 && (
        <div
          style={{
            position: "absolute",
            zIndex: 1000,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "300px",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {movies.map((movie) => (
            <div
              key={movie._id}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderBottom: "1px solid #ccc",
              }}
              onClick={() => handleMovieClick(movie)}
            >
              <img
                src={movie.poster || "placeholder.jpg"}
                alt={movie.title}
                style={{
                  width: "50px",
                  height: "75px",
                  borderRadius: "5px",
                  marginRight: "10px",
                }}
              />
              <div>
                <h6 style={{ margin: 0, fontSize: "14px" }}>{movie.title}</h6>
                <p style={{ margin: 0, fontSize: "12px", color: "gray" }}>
                  {movie.year || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Movie Details */}
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
                      fontWeight: "bold", // Bold text
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
                  src={selectedMovie.embedTrailerUrl}
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
            style={{
              justifyContent: "center",
              borderTop: "1px solid #ddd",
            }}
          >
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

export default SearchBar;
