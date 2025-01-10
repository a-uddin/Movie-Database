const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: String },
  genre: { type: String },
  director: { type: String },
  actors: [String],
  rating: { type: Number },
  poster: { type: String }, // For storing the movie poster
  trailer: { type: String },
});

// Specify the collection name explicitly
module.exports = mongoose.model("Movie", movieSchema, "MoviesCollection");
