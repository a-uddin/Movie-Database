import React from "react";
import { FaPlayCircle } from "react-icons/fa";

const MovieCard = ({ movie, onClick }) => {
  return (
    <div
      className="card h-100 shadow-sm border-0"
      onClick={() => onClick(movie)} // Trigger the modal
      style={{
        cursor: "pointer", // Indicate it's clickable
        transition: "0.3s",
        transform: "translateY(0)",
      }} 
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-10px)";
        e.currentTarget.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {movie.poster ? (
        <img
          src={movie.poster}
          className="card-img-top"
          alt={movie.title}
          style={{ height: "250px", objectFit: "cover" }}
        />
      ) : (
        <div
          className="card-img-top d-flex align-items-center justify-content-center bg-secondary text-white"
          style={{ height: "250px" }}
        >
          No Image
        </div>
      )}
      <div className="card-body">
        <h6 className="card-title">{movie.title}</h6>
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
            {movie.rating || "N/A"}
          </span>
        </p>
        <p className="card-text">Year: {movie.year}</p> {/* No play icon */}
      </div>
    </div>
  );
};

export default MovieCard;
