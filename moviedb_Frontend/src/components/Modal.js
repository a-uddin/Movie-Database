import React from "react";

const Modal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <button className="absolute top-2 right-2" onClick={onClose}>
          ✖
        </button>
        <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
        <p>
          <strong>Year:</strong> {movie.year}
        </p>
        <p>
          <strong>Genre:</strong> {movie.genre}
        </p>
        <p>
          <strong>Director:</strong> {movie.director}
        </p>
        <p>
          <strong>Actors:</strong> {movie.actors.join(", ")}
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
            {movie.rating || "N/A"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Modal;
