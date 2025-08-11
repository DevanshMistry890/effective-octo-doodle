import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import WatchedMovies from './pages/WatchedMovies'
import WantToWatchMovies from './pages/WantToWatchMovies'
import './App.css'

const App: React.FC = () => {
  return (
    <Router>
      <div className='app'>
        <Navigation />

        <main className='main-content'>
          <Routes>
            <Route
              path='/'
              element={<Home />}
            />
            <Route
              path='/movie/:id'
              element={<MovieDetails />}
            />
            <Route
              path='/watched'
              element={<WatchedMovies />}
            />
            <Route
              path='/want-to-watch'
              element={<WantToWatchMovies />}
            />
            <Route
              path='*'
              element={<NotFound />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

const NotFound: React.FC = () => (
  <div className='not-found'>
    <h2>404 - Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <a
      href='/'
      className='btn btn-primary'
    >
      Go Home
    </a>
  </div>
)

export default App
