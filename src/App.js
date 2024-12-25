import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './simo/home'; // Home component
import Movie from './simo/Movie'; // Movie details component
import Series from './simo/Series'; // TV Series details component
import WatchingMovie from './simo/watchingMovie'; // Watching movie component
import WatchingSeries from './simo/watchingSeries'; // Watching series component
import Header from './components/header'; // Header component
import Error from './simo/erour'; // Error component for 404

function App() {
  return (
    <BrowserRouter>
      <Header /> {/* Global Header */}
      <Routes>
        {/* Route for the home page */}
        <Route path="/" element={<Home />} />
        
        {/* Route for movie details */}
        <Route path="/movie/:id" element={<Movie />} />
        
        {/* Route for TV series details */}
        <Route path="/series/:id" element={<Series />} />
        
        {/* Route for watching a movie */}
        <Route path="/watching/:id" element={<WatchingMovie />} />
        
        {/* Route for watching a series */}
        <Route path="/watching-series/:id" element={<WatchingSeries />} />
        
        {/* Route for unmatched URLs */}
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
