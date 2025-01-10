// This script is for Delete Movie from MongoDB if the Movie does not have poster 

require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");
const Movie = require("./MovieSchema"); // Adjust path as necessary

const MONGO_URI = process.env.MONGO_URI; // Use the MONGO_URI from .env

if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env file");
  process.exit(1);
}

async function deleteMoviesWithoutValidPosters() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Find and delete movies where the poster is missing or invalid (e.g., "N/A" or empty)
    const result = await Movie.deleteMany({
      $or: [
        { poster: { $exists: false } },
        { poster: { $eq: "" } },
        { poster: { $eq: "N/A" } },
      ],
    });

    console.log(
      `${result.deletedCount} movies without valid posters have been deleted.`
    );
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    // Disconnect from MongoDB
    mongoose.connection.close();
    console.log("Disconnected from MongoDB");
  }
}

deleteMoviesWithoutValidPosters();
