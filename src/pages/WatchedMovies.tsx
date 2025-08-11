import '../assets/css/PageHeader.css'

const WatchedMovies = () => {
  return (
    <div className='page-container'>
      <header className='page-header page'>
        <h1>Watched Movies</h1>
        <p>Your collection of watched films</p>
      </header>

      <div className='no-results'>
        <h3>Feature Under Development</h3>
        <p>The watched movies functionality is currently being developed.</p>
        <p>Check back later for this feature!</p>
      </div>
    </div>
  )
}

export default WatchedMovies
