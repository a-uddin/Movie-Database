require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");
const Movie = require("./MovieSchema"); // Adjust the path if necessary

const MONGO_URI = process.env.MONGO_URI; // Use the MONGO_URI from .env

if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env file");
  process.exit(1);
}

async function addTrailerField() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Find all movies that do not have the `trailer` field
    const moviesWithoutTrailer = await Movie.find({
      trailer: { $exists: false },
    });
    console.log(
      `Found ${moviesWithoutTrailer.length} movies without the trailer field`
    );

    // Add the `trailer` field to these movies
    for (const movie of moviesWithoutTrailer) {
      movie.trailer = null; // Add an empty trailer field
      await movie.save();
      console.log(`Added trailer field to: ${movie.title}`);
    }

    console.log("Finished updating movies.");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err.message);
    mongoose.connection.close();
  }
}

// Run the script
addTrailerField();
