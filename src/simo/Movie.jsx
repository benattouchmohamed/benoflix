import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ms.css';

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [trailerVisible, setTrailerVisible] = useState(false);
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        // Fetch movie details
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=b7cd3340a794e5a2f35e3abb820b497f`
        );
        if (!movieResponse.ok) throw new Error('Failed to fetch movie details');
        const movieData = await movieResponse.json();
        setMovie(movieData);

        // Fetch trailer
        const trailerResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=b7cd3340a794e5a2f35e3abb820b497f`
        );
        const trailerData = await trailerResponse.json();
        const trailerKey = trailerData.results.find((video) => video.type === 'Trailer')?.key;
        setTrailer(trailerKey);

        // Fetch recommended movies
        const recommendedResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=b7cd3340a794e5a2f35e3abb820b497f`
        );
        const recommendedData = await recommendedResponse.json();
        setRecommendedMovies(recommendedData.results);
      } catch (err) {
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleWatchTrailer = () => {
    if (trailer) {
      setTrailerVisible(true);
    } else {
      alert('Trailer not available.');
    }
  };

  const handleWatchMovie = () => {
    navigate(`/watching/${id}`);
  };

  const handleRecommendedMovieClick = (recommendedMovieId) => {
    navigate(`/movie/${recommendedMovieId}`);
  };

  const closeTrailerModal = () => {
    setTrailerVisible(false);
  };

  if (loading) {
    return (
      <p className="loading">
        <img src="/output-onlinegiftools.gif" alt="Loading..." className="loading-gif" />
      </p>
    );
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="movie-container">
      <div
        className="movie-backdrop"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie?.backdrop_path})`,
        }}
      ></div>
      <div className="movie-content">
        <img
          className="movie-poster"
          src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
          alt={movie?.title}
        />
        <div className="movie-details">
          <h1 className="movie-title">{movie?.title}</h1>
          <p className="movie-info">
            {movie?.release_date} • {movie?.original_language.toUpperCase()}
          </p>
          <div className="movie-genres">
            {movie?.genres.map((genre) => (
              <span key={genre.id} className="genre">
                {genre.name}
              </span>
            ))}
          </div>
          <p className="movie-overview">{movie?.overview}</p>
          <div className="movie-buttons">
            <button onClick={handleWatchTrailer} className="btn-watch-trailer">
              Watch Trailer
            </button>
            <button onClick={handleWatchMovie} className="btn-watch-movie">
              Watch Movie
            </button>
          </div>
        </div>
      </div>

      {trailerVisible && trailer && (
        <div className="trailer-modal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeTrailerModal}>
              &times;
            </span>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${trailer}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Movie Trailer"
            />
          </div>
        </div>
      )}

      <div className="recommended-movies">
        <h2>You Might Also Like</h2>
        <div className="recommended-movie-list">
          {recommendedMovies.map((movie) => (
            <div
              key={movie.id}
              className="recommended-movie-item"
              onClick={() => handleRecommendedMovieClick(movie.id)}
            >
              <img
                className="recommended-movie-poster"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Movie;
