import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const API_KEY = "b7cd3340a794e5a2f35e3abb820b497f";
const BASE_URL = "https://api.themoviedb.org/3";

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [recommendedSeries, setRecommendedSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionPoor, setConnectionPoor] = useState(false);

  // Check connection quality
  const checkConnection = () => {
    const startTime = Date.now();
    fetch(`${BASE_URL}/configuration?api_key=${API_KEY}`)
      .then(() => {
        const latency = Date.now() - startTime;
        setConnectionPoor(latency > 3000); // Set poor if latency > 3s
      })
      .catch(() => setConnectionPoor(true));
  };

  // Fetching functions
  const fetchMovies = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=en-US&page=1&include_adult=false`);
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
    setLoading(false);
  };

  const fetchSeries = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${query}&language=en-US&page=1`);
      const data = await response.json();
      setSeries(data.results);
    } catch (error) {
      console.error("Error fetching series:", error);
    }
    setLoading(false);
  };

  const fetchRecommendedMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
      const data = await response.json();
      setRecommendedMovies(data.results);
    } catch (error) {
      console.error("Error fetching recommended movies:", error);
    }
    setLoading(false);
  };

  const fetchRecommendedSeries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`);
      const data = await response.json();
      setRecommendedSeries(data.results);
    } catch (error) {
      console.error("Error fetching recommended series:", error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value !== '') {
      fetchMovies(e.target.value);
      fetchSeries(e.target.value);
    } else {
      setMovies([]);
      setSeries([]);
    }
  };

  useEffect(() => {
    checkConnection();
    fetchRecommendedMovies();
    fetchRecommendedSeries();
  }, []);

  // Format the rating into stars
  const formatRating = (rating) => {
    const stars = '★★★★★'.slice(0, Math.round(rating / 2));
    return stars.padEnd(5, '☆');
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleSeriesClick = (showId) => {
    navigate(`/series/${showId}`);
  };

  return (
    <div className="home">
      {connectionPoor && (
        <div className="connection-warning">
          <p>Poor connection detected. Loading may be slower than usual.</p>
        </div>
      )}
      <div className="search-container">
        <input
           type="text"
           placeholder="Search for a movie or series..."
           value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>

      {/* Display search results */}
      <div className="movies-container">
        {loading ? (
          <div className="loading">
          <img src="/output-onlinegiftools.gif" alt="Loading..." className="loading-gif" />
         
        </div>
        ) : (
          <>
            {movies.length > 0 && (
              <div>
                <h2>Search Results - Movies</h2>
                <div className="movie-list">
                  {movies.map((movie) => (
                    <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie.id)}>
                      <img
                         src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                         alt={movie.title}
                         className="movie-poster"
                       />
                      <div className="movie-info">
                        <h3 className="movie-title">{movie.title}</h3>
                        <p className="movie-rating">{formatRating(movie.vote_average)}</p>
                        <p className="movie-hd">{movie.original_language.toUpperCase()} HD</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {series.length > 0 && (
              <div>
                <h2>Search Results - TV Series</h2>
                <div className="series-list">
                  {series.map((show) => (
                    <div key={show.id} className="movie-card" onClick={() => handleSeriesClick(show.id)}>
                      <img
                         src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
                         alt={show.name}
                         className="movie-poster"
                       />
                      <div className="movie-info">
                        <h3 className="movie-title">{show.name}</h3>
                        <p className="movie-rating">{formatRating(show.vote_average)}</p>
                        <p className="movie-hd">{show.original_language.toUpperCase()} HD</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Display recommended movies */}
      <div className="recommended">
        <h2>Recommended Movies</h2>
        <div className="movie-list">
          {recommendedMovies.map((movie) => (
            <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie.id)}>
              <img
                 src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                 alt={movie.title}
                 className="movie-poster"
               />
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-rating">{formatRating(movie.vote_average)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Display recommended TV series */}
      <div className="recommended">
        <h2>Recommended TV Series</h2>
        <div className="series-list">
          {recommendedSeries.map((show) => (
            <div key={show.id} className="movie-card" onClick={() => handleSeriesClick(show.id)}>
              <img
                 src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
                 alt={show.name}
                 className="movie-poster"
               />
              <div className="movie-info">
                <h3 className="movie-title">{show.name}</h3>
                <p className="movie-rating">{formatRating(show.vote_average)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
