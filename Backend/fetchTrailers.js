// Script to fetch Trailer from Youtube

require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const Movie = require("./MovieSchema"); // Import the Movie schema

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Function to fetch trailer using YouTube Data API
const fetchTrailer = async (title, year) => {
  try {
    const query = `${title} ${year} official trailer`;
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          key: process.env.YOUTUBE_API_KEY, // Add this key to your .env
          maxResults: 1,
          type: "video",
        },
      }
    );

    if (response.data.items.length > 0) {
      const videoId = response.data.items[0].id.videoId;
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching trailer for ${title}:`, error.message);
    return null;
  }
};

// Function to update movies with trailers
const updateMoviesWithTrailers = async () => {
  try {
    const movies = await Movie.find(); // Fetch all movies from the database
    for (const movie of movies) {
      if (!movie.trailer) {
        // Only update if the trailer field is empty
        const trailerUrl = await fetchTrailer(movie.title, movie.year);
        if (trailerUrl) {
          movie.trailer = trailerUrl;
          await movie.save();
          console.log(`Trailer added for: ${movie.title}`);
        } else {
          console.log(`No trailer found for: ${movie.title}`);
        }
      }
    }
    console.log("All movies updated with trailers.");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error updating movies with trailers:", error.message);
    mongoose.disconnect();
  }
};

// Start the script
updateMoviesWithTrailers();
