// Script to change data type for trailer field

require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");
const Movie = require("./MovieSchema"); // Adjust the path if necessary

const MONGO_URI = process.env.MONGO_URI; // Use the MONGO_URI from .env

if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env file");
  process.exit(1);
}

async function updateTrailerField() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Find all documents where `trailer` is explicitly null
    const result = await Movie.updateMany(
      { trailer: null }, // Condition to find documents with trailer as null
      { $set: { trailer: "" } } // Update `trailer` to an empty string
    );

    console.log(
      `Updated ${result.nModified} movies with trailer field set to an empty string.`
    );
    mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err.message);
    mongoose.connection.close();
  }
}

updateTrailerField();
