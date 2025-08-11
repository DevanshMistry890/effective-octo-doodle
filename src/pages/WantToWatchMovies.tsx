import React from 'react'
import '../assets/css/PageHeader.css'

const WantToWatchMovies = () => {
  return (
    <div className='page-container'>
      <header className='page-header page'>
        <h1>Want to Watch</h1>
        <p>Movies you want to watch later</p>
      </header>

      <div className='no-results'>
        <h3>Feature Under Development</h3>
        <p>The want to watch functionality is currently being developed.</p>
        <p>Check back later for this feature!</p>
      </div>
    </div>
  )
}

export default WantToWatchMovies
