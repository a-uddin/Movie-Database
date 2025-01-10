// This script used to Delete Movie where trailer field with empty string

const mongoose = require("mongoose");
const Movie = require("./MovieSchema"); // Adjust the path to your MovieSchema

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI; // MongoDB connection string

async function deleteMoviesWithEmptyTrailer() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Delete movies with an empty string in the trailer field
    const result = await Movie.deleteMany({ trailer: "" });
    console.log(
      `Deleted ${result.deletedCount} movies with an empty trailer field`
    );
  } catch (error) {
    console.error("Error deleting movies:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

deleteMoviesWithEmptyTrailer();
