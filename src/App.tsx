import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import WatchedMovies from './pages/WatchedMovies';
import WantToWatchMovies from './pages/WantToWatchMovies';
import MovieDetails from './pages/MovieDetails';
import './App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="App">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watched" element={<WatchedMovies />} />
            <Route path="/want-to-watch" element={<WantToWatchMovies />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
