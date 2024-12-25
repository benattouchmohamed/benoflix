import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './mss.css';

const Series = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // For navigation to the watching page
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [trailerVisible, setTrailerVisible] = useState(false);
  const [recommendedSeries, setRecommendedSeries] = useState([]);

  // Fetch series details, trailer, and recommended series when the component mounts
  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true); // Ensuring loading state is set to true before fetching
      try {
        const seriesResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=b7cd3340a794e5a2f35e3abb820b497f`
        );
        if (!seriesResponse.ok) {
          throw new Error('Failed to fetch series details');
        }
        const seriesData = await seriesResponse.json();
        setSeries(seriesData);

        // Fetch the series' trailer
        const trailerResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/videos?api_key=b7cd3340a794e5a2f35e3abb820b497f`
        );
        const trailerData = await trailerResponse.json();
        const trailerKey = trailerData.results.find((video) => video.type === 'Trailer')?.key;
        setTrailer(trailerKey);

        // Fetch recommended series
        const recommendedResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=b7cd3340a794e5a2f35e3abb820b497f`
        );
        const recommendedData = await recommendedResponse.json();
        setRecommendedSeries(recommendedData.results);
      } catch (err) {
        setError('Error fetching data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [id]);

  // Handle the watch trailer button click
  const handleWatchTrailer = () => {
    if (trailer) {
      setTrailerVisible(true);
    } else {
      alert('Trailer not available.');
    }
  };

  // Handle the watch series button click
  const handleWatchSeries = () => {
    navigate(`/watching-series/${id}`); // Navigate to the watching page with the movie ID
  };
  // Handle recommended series click
  const handleRecommendedSeriesClick = (recommendedSeriesId) => {
    navigate(`/watching-series/${recommendedSeriesId}`); // Navigate to the recommended series' detail page
  };

  // Close the trailer modal
  const closeTrailerModal = () => {
    setTrailerVisible(false);
  };

  // Show loading message or error if applicable
  if (loading) {
    return (
      <p className="loading">
        <img src="/output-onlinegiftools.gif" alt="Loading..." className="loading-gif" />
        
      </p>
    );
  }
  
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="series-container">
      {/* Series backdrop image */}
      <div
        className="series-backdrop"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${series.backdrop_path})`,
        }}
      ></div>
      <div className="series-content">
        {/* Series poster image */}
        <img
          className="series-poster"
          src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
          alt={series.name}
        />
        <div className="series-details">
          <h1 className="series-title">{series.name}</h1>
          <p className="series-info">
            {series.first_air_date} • {series.original_language.toUpperCase()}
          </p>
          <div className="series-genres">
            {series.genres.map((genre) => (
              <span key={genre.id} className="genre">
                {genre.name}
              </span>
            ))}
          </div>
          <p className="series-overview">{series.overview}</p>

          {/* Buttons */}
          <div className="series-buttons">
            <button onClick={handleWatchTrailer} className="btn-watch-trailer">
              Watch Trailer
            </button>
            <button onClick={handleWatchSeries} className="btn-watch-series">
              Watch Series
            </button>
          </div>

          {/* Trailer Modal */}
          {trailerVisible && trailer && (
            <div className="trailer-modal">
              <div className="modal-content">
                <span className="close-btn" onClick={closeTrailerModal}>&times;</span>
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${trailer}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Series Trailer"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Series */}
      <div className="recommended-series">
        <h2>You Might Also Like</h2>
        <div className="recommended-series-list">
          {recommendedSeries.map((recommendedSeries) => (
            <div
              key={recommendedSeries.id}
              className="recommended-series-item"
              onClick={() => handleRecommendedSeriesClick(recommendedSeries.id)}
            >
              <img
                className="recommended-series-poster"
                src={`https://image.tmdb.org/t/p/w500${recommendedSeries.poster_path}`}
                alt={recommendedSeries.name}
              />
              <h3>{recommendedSeries.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Series;
