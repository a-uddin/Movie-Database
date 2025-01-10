require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");
const Movie = require("./MovieSchema"); // Adjust the path if necessary
const axios = require("axios");

const MONGO_URI = process.env.MONGO_URI; // Use the MONGO_URI from .env

if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env file");
  process.exit(1);
}

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
      return "";
    }
  } catch (error) {
    console.error(
      `Error fetching YouTube trailer for ${movieTitle}:`,
      error.message
    );
    return "";
  }
}

async function updateMovies() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Fetch all movies where trailer is an empty string
    const moviesWithoutTrailer = await Movie.find({ trailer: "" });
    console.log(
      `Found ${moviesWithoutTrailer.length} movies without the trailer field`
    );

    for (const movie of moviesWithoutTrailer) {
      console.log(`Updating trailer for: ${movie.title}`);
      const trailerUrl = await fetchYouTubeTrailer(movie.title);

      if (trailerUrl) {
        movie.trailer = trailerUrl;
        await movie.save();
        console.log(`Updated trailer for ${movie.title}`);
      } else {
        console.log(`No trailer found for ${movie.title}`);
      }
    }

    console.log("Finished updating movies.");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err.message);
    mongoose.connection.close();
  }
}

updateMovies();
