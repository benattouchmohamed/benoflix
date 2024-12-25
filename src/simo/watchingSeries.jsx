import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import './Watching.css';

const WatchingSERIE = () => {
  const { id } = useParams(); // Extract the TV series ID from the URL
  const [selectedProvider, setSelectedProvider] = useState('vidsrc.dev'); // Default provider
  const [embedUrl, setEmbedUrl] = useState('');
  const [serieName, setSerieName] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [error, setError] = useState(null);
  const [seasonNumber, setSeasonNumber] = useState(1); // Default to season 1
  const [episodeNumber, setEpisodeNumber] = useState(1); // Default to episode 1
  const [seasons, setSeasons] = useState([]); // To store the seasons' names
  const [episodeDetails, setEpisodeDetails] = useState({}); // Store episode details
  const [allEpisodes, setAllEpisodes] = useState([]); // Store all episodes

  const providers = useMemo(() => ({
    'vidsrc.me': 'https://vidsrc.me/embed/tv/{series_id}/{season_number}/{episode_number}',
    'vidsrc.in': 'https://vidsrc.in/embed/tv/{series_id}/{season_number}/{episode_number}',
    'vidsrc.pm': 'https://vidsrc.pm/embed/tv/{series_id}/{season_number}/{episode_number}',
    'vidsrc.net': 'https://vidsrc.net/embed/tv/{series_id}/{season_number}/{episode_number}',
    'vidsrc.xyz': 'https://vidsrc.xyz/embed/tv/{series_id}/{season_number}/{episode_number}',
    'vidsrc.io': 'https://vidsrc.io/embed/tv/{series_id}/{season_number}/{episode_number}',
    'vidsrc.vc': 'https://vidsrc.vc/embed/tv/{series_id}/{season_number}/{episode_number}',
    'vidsrc.dev': 'https://vidsrc.dev/embed/tv/{series_id}/{season_number}/{episode_number}',
    '2embed.org': 'https://2embed.org/embed/tv/{series_id}/{season_number}/{episode_number}',
    'vidlink.pro': 'https://vidlink.pro/tv/{series_id}/{season_number}/{episode_number}',
    'embed.su': 'https://embed.su/embed/tv/{series_id}/{season_number}/{episode_number}',
  }), []); // Memoize providers to prevent unnecessary re-renders

  useEffect(() => {
    const fetchSerieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=b7cd3340a794e5a2f35e3abb820b497f`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch series details');
        }
        const data = await response.json();
        setSerieName(data.name || data.original_name || 'Unknown Series');
        setBackgroundImage(`https://image.tmdb.org/t/p/original${data.backdrop_path}`);
        setSeasons(data.seasons || []); // Ensure seasons is an empty array if not available
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSerieDetails();
  }, [id]);

  useEffect(() => {
    const fetchAllEpisodes = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=b7cd3340a794e5a2f35e3abb820b497f`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch all episodes');
        }
        const data = await response.json();
        setAllEpisodes(data.episodes || []); // Store all episodes of the current season
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAllEpisodes();
  }, [id, seasonNumber]);

  useEffect(() => {
    const fetchEpisodeDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?api_key=b7cd3340a794e5a2f35e3abb820b497f`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch episode details');
        }
        const data = await response.json();
        setEpisodeDetails(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (id && seasonNumber && episodeNumber) {
      const baseUrl = providers[selectedProvider];
      if (baseUrl) {
        const url = baseUrl
          .replace('{series_id}', id)
          .replace('{season_number}', seasonNumber)
          .replace('{episode_number}', episodeNumber);
        setEmbedUrl(url);
        fetchEpisodeDetails();
      } else {
        setError('Selected provider is not supported.');
      }
    }
  }, [id, selectedProvider, seasonNumber, episodeNumber, providers]);

  const handleEpisodeSelect = (episodeId) => {
    setEpisodeNumber(episodeId);
    // Update the embed URL for the selected episode
    const baseUrl = providers[selectedProvider];
    if (baseUrl) {
      const url = baseUrl
        .replace('{series_id}', id)
        .replace('{season_number}', seasonNumber)
        .replace('{episode_number}', episodeId);
      setEmbedUrl(url); // Update the embed URL for iframe
    } else {
      setError('Selected provider is not supported.');
    }
  };

  const handleNavigation = (direction) => {
    if (direction === 'next') {
      setEpisodeNumber((prev) => prev + 1);
    } else if (direction === 'previous' && episodeNumber > 1) {
      setEpisodeNumber((prev) => prev - 1);
    }
  };

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
      <h1>Now Watching {serieName}</h1>

      <div>
        <label htmlFor="provider-select">Choose a provider:</label>
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

      <div>
        <label htmlFor="season-select">Choose a Season:</label>
        <select
          id="season-select"
          value={seasonNumber}
          onChange={(e) => setSeasonNumber(Number(e.target.value))}
        >
          {Array.isArray(seasons) && seasons.length > 0 ? (
            seasons.map((season) => (
              <option key={season.id} value={season.season_number}>
                {season.name || `Season ${season.season_number}`}
              </option>
            ))
          ) : (
            <option>No seasons available</option>
          )}
        </select>
      </div>

      <div>
        <label htmlFor="episode-select">Choose an Episode:</label>
        <select
          id="episode-select"
          value={episodeNumber}
          onChange={(e) => setEpisodeNumber(Number(e.target.value))}
        >
          {allEpisodes.length > 0 ? (
            allEpisodes.map((episode) => (
              <option key={episode.id} value={episode.episode_number}>
                {episode.name || `Episode ${episode.episode_number}`}
              </option>
            ))
          ) : (
            <option>No episodes available</option>
          )}
        </select>
      </div>

      <div className="episode-navigation">
        <button onClick={() => handleNavigation('previous')}>Previous Episode</button>
        <button onClick={() => handleNavigation('next')}>Next Episode</button>
      </div>

      {embedUrl ? (
        <div className="video-player">
          <iframe
            id="Series-iframe" // Add ID to iframe
            src={embedUrl}
            title={`Watch ${serieName} - Season ${seasonNumber} Episode ${episodeNumber}`}
            allowFullScreen
          ></iframe>
        </div>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div className="loading">
          <img src="/output-onlinegiftools.gif" alt="Loading..." className="loading-gif" />
        </div>
      )}

      {episodeDetails.name && (
        <div className="episode-details">
          <h3>{episodeDetails.name}</h3>
          <p>{episodeDetails.overview}</p>
          {episodeDetails.still_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${episodeDetails.still_path}`}
              alt={episodeDetails.name}
              className="episode-image"
            />
          )}

          <div className="episode-cards">
            {allEpisodes.map((episode) => (
              <div
                key={episode.id}
                className="episode-card"
                onClick={() => handleEpisodeSelect(episode.episode_number)} // Set episode number when clicked
              >
                <h4>{episode.name}</h4>
                <p>{episode.overview.slice(0, 100)}...</p>
                {episode.still_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                    alt={episode.name}
                    className="episode-image"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchingSERIE;
