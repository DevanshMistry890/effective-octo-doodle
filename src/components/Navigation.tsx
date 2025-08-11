import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../assets/css/Navigation.css'

const Navigation: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string): boolean => {
    return location.pathname === path
  }

  return (
    <nav className='navigation'>
      <div className='nav-container'>
        <Link
          to='/'
          className='nav-logo'
        >
          MovieInfo
        </Link>

        <div className='nav-links'>
          <Link
            to='/'
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to='/watched'
            className={`nav-link ${isActive('/watched') ? 'active' : ''}`}
          >
            Watched Movies
          </Link>
          <Link
            to='/want-to-watch'
            className={`nav-link ${isActive('/want-to-watch') ? 'active' : ''}`}
          >
            Want to Watch
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
