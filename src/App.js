import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Library from './pages/Library';
import MovieDetails from './components/MovieDetails';
import './styles/MovieDetails.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Library />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </Router>
  );
}

export default App; 