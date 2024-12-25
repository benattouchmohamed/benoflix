import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Watching.css'; // Import the CSS file

// Define providers outside the component
const providers = {
  'vidsrc.me': 'https://vidsrc.me/embed/movie/',
  'vidsrc.in': 'https://vidsrc.in/embed/movie/',
  'vidsrc.pm': 'https://vidsrc.pm/embed/movie/',
  'vidsrc.net': 'https://vidsrc.net/embed/movie/',
  'vidsrc.xyz': 'https://vidsrc.xyz/embed/movie/',
  'vidsrc.io': 'https://vidsrc.io/embed/movie/',
  'vidsrc.vc': 'https://vidsrc.vc/embed/movie/',
  'vidsrc.dev': 'https://vidsrc.dev/embed/movie/',
  '2embed.org': 'https://2embed.org/embed/movie/',
  'vidlink.pro': 'https://vidlink.pro/movie/',
  'embed.su': 'https://embed.su/embed/movie/',
};

const WatchingMovie = () => {
  const { id } = useParams(); // Extract the movie ID from the URL
  const [selectedProvider, setSelectedProvider] = useState('vidsrc.me'); // Default provider
  const [embedUrl, setEmbedUrl] = useState('');
  const [movieName, setMovieName] = useState('Loading...');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [error, setError] = useState(null);

  // Fetch movie details
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=b7cd3340a794e5a2f35e3abb820b497f`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch movie details.');
        }
        const data = await response.json();
        setMovieName(data.title || data.original_title || 'Unknown Movie');
        setBackgroundImage(`https://image.tmdb.org/t/p/original${data.backdrop_path}`);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching movie details.');
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Update embed URL
  useEffect(() => {
    if (id && selectedProvider) {
      const baseUrl = providers[selectedProvider];
      if (baseUrl) {
        setEmbedUrl(`${baseUrl}${id}`);
        setError(null); // Clear any previous errors
      } else {
        setError('Selected provider is not supported.');
      }
    }
  }, [id, selectedProvider]);

  return (
    <div
      className="watching-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <h1>Now Watching: {movieName}</h1>

      <div>
        <label htmlFor="provider-select" style={{ marginRight: '10px' }}>
          Choose a provider:
        </label>
        <select
          id="provider-select"
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
        >
          {Object.keys(providers).map((provider) => (
            <option key={provider} value={provider}>
              {provider}
            </option>
          ))}
        </select>
      </div>

      <div className="video-player" style={{ marginTop: '20px' }}>
        {embedUrl ? (
          <iframe
            id="movie-iframe"
            src={embedUrl}
            title={`Movie player from ${selectedProvider}`}
            allowFullScreen
          ></iframe>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <div className="loading">
            <img src="/output-onlinegiftools.gif" alt="Loading..." className="loading-gif" />
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchingMovie;
