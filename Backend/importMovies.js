// Script for Import Movie to MongoDB

require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");
const axios = require("axios");
const Movie = require("./MovieSchema"); // Update the path to your MovieSchema file

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// Fetch movie details from OMDB API
const fetchMovieDetails = async (title) => {
  try {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        t: title, // Movie title
        apikey: process.env.OMDB_API_KEY, // OMDB API key
      },
    });

    if (response.data && response.data.Response === "True") {
      const poster = response.data.Poster;

      // Skip the movie if the poster is "N/A" or an empty string
      if (!poster || poster === "N/A") {
        console.warn(`Skipping movie "${title}" due to invalid poster.`);
        return null;
      }

      return {
        title: response.data.Title,
        year: response.data.Year,
        genre: response.data.Genre,
        director: response.data.Director,
        actors: response.data.Actors.split(",").map((actor) => actor.trim()),
        rating: parseFloat(response.data.imdbRating) || null,
        poster: poster,
      };
    } else {
      console.error(`OMDB API Error: ${response.data.Error}`);
      return null;
    }
  } catch (err) {
    console.error("Error fetching movie details:", err.message);
    return null;
  }
};

// Save movie to MongoDB
const saveMovieToDB = async (movieData) => {
  try {
    const movie = new Movie(movieData);
    await movie.save();
    console.log(`Movie saved to DB: ${movieData.title}`);
  } catch (err) {
    console.error("Error saving movie to DB:", err.message);
  }
};

// Main function to fetch and save multiple movies
const importMovies = async () => {
  const moviesToImport = [
    "The Lord of the Rings: The Fellowship of the Ring",
    "Forrest Gump",
    "The Lord of the Rings: The Two Towers",
    "Star Wars: Episode V - The Empire Strikes Back",
    "Goodfellas",
    "Se7en",
    `It's a Wonderful Life`,
    "Saving Private Ryan",
    "The Green Mile",
    "Terminator 2: Judgment Day",
    "Star Wars: Episode IV - A New Hope",
    "Back to the Future",
  ]; // Add more movie titles here

  for (const title of moviesToImport) {
    const movieDetails = await fetchMovieDetails(title);
    if (movieDetails) {
      await saveMovieToDB(movieDetails);
    }
  }
};

// Run the script
(async () => {
  await connectDB();
  await importMovies();
  mongoose.connection.close();
  console.log("All movies imported and DB connection closed.");
})();
