// This script is used to Add Movies to MongoDB Atlas from OMDB

const mongoose = require("mongoose");
const axios = require("axios");
const Movie = require("./MovieSchema"); // Adjust the path to your MovieSchema

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const OMDB_API_KEY = process.env.OMDB_API_KEY; // Your OMDB API Key
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Your YouTube API Key

async function fetchYouTubeTrailer(movieTitle) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: `${movieTitle} official trailer`,
          type: "video",
          key: YOUTUBE_API_KEY,
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

async function fetchMoviesFromOMDB(genre, year) {
  try {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: OMDB_API_KEY,
        s: genre,
        y: year,
        type: "movie",
      },
    });

    return response.data.Search || [];
  } catch (error) {
    console.error(
      `Error fetching movies for genre: ${genre} and year: ${year}`,
      error.message
    );
    return [];
  }
}

async function addMoviesToDatabase() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const genres = [
      "Action",
      "Drama",
      "Comedy",
      "Thriller",
      "Horror",
      "Sci-Fi",
    ];
    const years = [2022, 2023, 2024];
    let addedMoviesCount = 0;

    for (const genre of genres) {
      for (const year of years) {
        console.log(`Fetching movies for genre: ${genre}, year: ${year}`);
        const movies = await fetchMoviesFromOMDB(genre, year);

        for (const movie of movies) {
          // Fetch detailed movie info from OMDB
          const detailedResponse = await axios.get("http://www.omdbapi.com/", {
            params: {
              apikey: OMDB_API_KEY,
              i: movie.imdbID,
            },
          });

          const detailedMovie = detailedResponse.data;

          // Skip if poster is N/A
          if (detailedMovie.Poster === "N/A") {
            console.log(
              `Skipping movie: ${detailedMovie.Title}, no poster available`
            );
            continue;
          }

          // Fetch trailer from YouTube
          const trailerUrl = await fetchYouTubeTrailer(detailedMovie.Title);

          // Add to database
          const movieData = {
            title: detailedMovie.Title,
            year: detailedMovie.Year,
            genre: detailedMovie.Genre,
            director: detailedMovie.Director || "N/A",
            actors: detailedMovie.Actors
              ? detailedMovie.Actors.split(", ")
              : [],
            rating: isNaN(parseFloat(detailedMovie.imdbRating))
              ? 0
              : parseFloat(detailedMovie.imdbRating),
            poster: detailedMovie.Poster,
            trailer: trailerUrl || "N/A", // Default to "N/A" if no trailer found
          };

          const existingMovie = await Movie.findOne({ title: movieData.title });
          if (!existingMovie) {
            await Movie.create(movieData);
            addedMoviesCount++;
            console.log(`Added movie: ${movieData.title}`);
          } else {
            console.log(`Movie already exists: ${movieData.title}`);
          }

          // Stop once 100 movies are added
          if (addedMoviesCount >= 100) break;
        }

        if (addedMoviesCount >= 100) break;
      }

      if (addedMoviesCount >= 100) break;
    }

    console.log(`Finished adding ${addedMoviesCount} movies to the database`);
  } catch (error) {
    console.error("Error adding movies to the database:", error.message);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

addMoviesToDatabase();
