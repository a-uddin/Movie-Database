import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import SearchBar from "../components/SearchBar"; // Ensure the path is correct
import AddMovieModal from "../components/AddMovieModal"; // Import Add Movie Modal
import UpdateMovieModal from "../components/UpdateMovieModal"; // Import Update Movie Modal
import "./NavBar.css";

const genres = [
  "Action",
  "Drama",
  "Comedy",
  "Adventure",
  "Animation",
  "Crime",
  "Documentary",
  "Fantasy",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Short",
  "Thriller",
];

const NavbarComponent = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference for the dropdown menu
  const location = useLocation(); // Get the current route
  const [showAddModal, setShowAddModal] = useState(false); // State for Add Movie Modal
  const [showUpdateModal, setShowUpdateModal] = useState(false); // State for Update Movie Modal

  // Toggle dropdown visibility
  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  const handleOutsideClick = (event) => {
    if (
      dropdownRef.current && // Check if the dropdown exists
      !dropdownRef.current.contains(event.target) // Check if the click was outside
    ) {
      setDropdownOpen(false); // Close dropdown
      dropdownRef.current.classList.remove("show"); // Remove the "show" class
    }
  };

  // Add/remove event listeners for outside clicks
  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [dropdownOpen]);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="sticky-top">
      <Container>
        <Navbar.Brand
          onClick={() => {
            window.location.href = "/";
          }}
          style={{ cursor: "pointer" }}
        >
          MovieDB
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <div ref={dropdownRef}>
              <NavDropdown
                title="Genres"
                id="genres-dropdown"
                className={`genres-dropdown ${dropdownOpen ? "open" : ""}`}
                onClick={handleDropdownToggle}
              >
                <div
                  className={`genres-dropdown-menu ${
                    dropdownOpen ? "open" : ""
                  }`}
                >
                  {genres.map((genre, index) => (
                    <a
                      key={index}
                      href={`/genres/${genre}`}
                      className="dropdown-item col-4"
                      style={{
                        color: "#fff",
                        fontSize: "14px",
                        textDecoration: "none",
                      }}
                      onClick={() => {
                        setDropdownOpen(false); // Close the dropdown
                      }}
                    >
                      {genre}
                    </a>
                  ))}
                </div>
              </NavDropdown>
            </div>
          </Nav>
          <SearchBar />
          {/* Add Movie Button */}
          <button
            className="btn btn-outline-light mx-2"
            onClick={() => setShowAddModal(true)}
          >
            Add Movie
          </button>
          {/* Update Movie Button */}
          <button
            className="btn btn-outline-light"
            onClick={() => setShowUpdateModal(true)}
          >
            Update Movie
          </button>
        </Navbar.Collapse>
      </Container>

      {/* Add Movie Modal */}
      <AddMovieModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Update Movie Modal */}
      <UpdateMovieModal
        show={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
      />
    </Navbar>
  );
};

export default NavbarComponent;
