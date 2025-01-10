const express = require("express");
const axios = require("axios");
const Movie = require("./MovieSchema"); // Import your Movie schema
require("dotenv").config(); // Load environment variables

const router = express.Router();

// Route to fetch all movies from the database
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find(); // Fetch all movies from MongoDB
    res.json(movies); // Send the movies as JSON response
  } catch (err) {
    console.error("Error fetching movies:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching movies", error: err.message });
  }
});

// Function to fetch YouTube trailer
async function fetchYouTubeTrailer(movieTitle) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: `${movieTitle} official trailer`,
          type: "video",
          key: process.env.YOUTUBE_API_KEY,
          maxResults: 1,
        },
      }
    );

    if (response.data.items && response.data.items.length > 0) {
      const trailerId = response.data.items[0].id.videoId;
      return `https://www.youtube.com/watch?v=${trailerId}`;
    } else {
      console.log(`No trailer found for: ${movieTitle}`);
      return null;
    }
  } catch (error) {
    console.error(
      `Error fetching YouTube trailer for ${movieTitle}:`,
      error.message
    );
    return null;
  }
}

// Function to fetch detailed movie information
async function fetchMovieDetails(imdbID) {
  try {
    const response = await axios.get(`http://www.omdbapi.com/`, {
      params: {
        i: imdbID,
        apikey: process.env.OMDB_API_KEY,
      },
    });

    const data = response.data;

    if (data.Response === "False") {
      console.log(`Details not found for IMDb ID: ${imdbID}`);
      return null;
    }

    // Fetch trailer URL from YouTube
    const trailer = await fetchYouTubeTrailer(data.Title);

    return {
      title: data.Title,
      year: data.Year,
      genre: data.Genre,
      director: data.Director,
      actors: data.Actors ? data.Actors.split(", ") : [],
      rating: isNaN(parseFloat(data.imdbRating))
        ? 0
        : parseFloat(data.imdbRating),
      poster: data.Poster !== "N/A" ? data.Poster : null, // Include poster URL if available
      trailer: trailer, // Add trailer URL to movie details
    };
  } catch (error) {
    console.error(
      `Error fetching details for IMDb ID ${imdbID}:`,
      error.message
    );
    return null;
  }
}

// Route to fetch and save movies by search term and year
router.post("/save", async (req, res) => {
  const { searchTerm, year } = req.body;

  if (!searchTerm) {
    return res.status(400).json({ message: "Search term is required." });
  }

  const searchResults = await fetchMoviesBySearch(searchTerm, year);

  for (const result of searchResults) {
    const movieDetails = await fetchMovieDetails(result.imdbID);

    if (movieDetails && movieDetails.poster) {
      const existingMovie = await Movie.findOne({ title: movieDetails.title });
      if (!existingMovie) {
        const movie = new Movie(movieDetails);
        try {
          await movie.save();
          console.log(`Movie saved: ${movie.title}`);
        } catch (err) {
          console.error(`Error saving movie ${movie.title}:`, err.message);
        }
      } else {
        console.log(`Movie already exists: ${movieDetails.title}`);
      }
    }
  }

  res.json({ message: "Movies fetched and saved successfully!" });
});

//Fetch Movies by Genres

router.get("/genre/:genre", async (req, res) => {
  const { genre } = req.params;
  try {
    const movies = await Movie.find({
      genre: { $regex: genre, $options: "i" }, // Case-insensitive search
    });
    res.json(movies);
  } catch (err) {
    console.error("Error fetching movies by genre:", err.message);
    res.status(500).json({ message: "Error fetching movies by genre" });
  }
});

// Route to search movies by title
router.get("/search", async (req, res) => {
  const { q } = req.query; // Get the search query from the request

  if (!q) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const movies = await Movie.find({
      title: { $regex: q, $options: "i" }, // Case-insensitive search by title
    });
    res.json(movies);
  } catch (err) {
    console.error("Error searching movies:", err.message);
    res
      .status(500)
      .json({ message: "Error searching movies", error: err.message });
  }
});

// Route to delete a movie by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Movie.findByIdAndDelete(id);
    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    console.error("Error deleting movie:", err.message);
    res
      .status(500)
      .json({ message: "Error deleting movie", error: err.message });
  }
});

// For Adding Movie

router.post("/", async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json({ message: "Movie added successfully!" });
  } catch (err) {
    console.error("Error adding movie:", err.message);
    res.status(500).json({ message: "Error adding movie", error: err.message });
  }
});

// Route to update a movie by title
router.put("/update", async (req, res) => {
  try {
    const { title, year, genre, director, actors, rating, poster, trailer } =
      req.body;

    if (!title) {
      return res
        .status(400)
        .json({ message: "Title is required to update a movie." });
    }

    // Find the movie by title and update the fields
    const updatedMovie = await Movie.findOneAndUpdate(
      { title: title }, // Find movie by title
      {
        ...(year && { year }),
        ...(genre && { genre }),
        ...(director && { director }),
        ...(actors && {
          actors: actors.split(",").map((actor) => actor.trim()),
        }),
        ...(rating && { rating }),
        ...(poster && { poster }),
        ...(trailer && { trailer }),
      },
      { new: true } // Return the updated document
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    res.json({ message: "Movie updated successfully", movie: updatedMovie });
  } catch (err) {
    console.error("Error updating movie:", err.message);
    res
      .status(500)
      .json({ message: "Error updating movie", error: err.message });
  }
});

// Export the router for use in server.js
module.exports = router;
