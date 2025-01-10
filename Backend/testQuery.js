// script used for debug 

require("dotenv").config();
const mongoose = require("mongoose");
const Movie = require("./MovieSchema"); // Ensure the path matches your file structure

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Test Query
const fetchTopRatedMovies = async () => {
  try {
    const topRatedMovies = await Movie.find({ rating: { $gt: 5 } }).sort({
      rating: -1,
    });
    console.log("Top Rated Movies:", topRatedMovies);
  } catch (err) {
    console.error("Error fetching top-rated movies:", err.message);
  } finally {
    mongoose.connection.close(); // Close the connection after the query
  }
};

fetchTopRatedMovies();
