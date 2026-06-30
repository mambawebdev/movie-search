/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react"
import { ToastContainer,toast } from 'react-toastify';

const App = () => {
  
  const [searchInput, setSearchInput] = useState("");
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMmE1ZGU4NThmYjJjZTQ0OGEzOWRlM2IwMmZjOTZlYiIsIm5iZiI6MTcxNDYxNzI5NC41NTEsInN1YiI6IjY2MzJmYmNlYzM5MjY2MDEyMzZkNjMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hTIsB0Yf6-bfFveOZ-VcMVXKUWq0P7pYmkggHVJ4x1c'
        }
      };
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchInput}&include_adult=false&language=en-US&page=1`, options);
      const data = await response.json()
      console.log(data.results);
      setMovies(data.results);
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleWatchlist = (selectedMovie) => {
    // Add the watchlist to the Array state
    const updatedWatchList = [...watchlist, selectedMovie];
    setWatchlist(updatedWatchList);
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchList))
    toast.success("Successfully added.")
  }

  const truncateText = (text, maxLength) => {
    if(text.length <= maxLength){
      return text;
    }

    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.slice(0, lastSpace);
  }

  useEffect(() => {
    const savedList = localStorage.getItem("watchlist");
    if(savedList){
      setWatchlist(JSON.parse(savedList));
    }
  }, [])



  return (
    <>
    <ToastContainer/>
    <header>
      <img src="/logo2.png" alt="" className="logo" />
      <form onSubmit={handleSubmit} className="input__section">
        <input 
        placeholder="Enter movie name"
        className="header__input"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        type="text" />
        <button type="submit" className="header__btn">SEARCH</button>
      </form>
    </header>
    <main>
      <aside className="main__left">
        {
          movies.length === 0 ? (
            <div className="no__movies">No Movies Available</div>
          ) : (
            movies.map((movie) => (
              <>
              <div key={movie.id} className="card">
                  <div className="card__left">
                    <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.png'}  alt="" className="poster" />
                  </div>
                  <div className="card__right">
                    <h2 id="movie__title">{movie.title}</h2>
                    <p id="movie__desc">{movie.overview ? truncateText(movie.overview, 70) : "No description found"}.</p>
                    <p id="movie__release">{movie.release_date}</p>
                    <div id="movie__vote">{Math.round(movie.vote_average)}</div>
                  </div>
              </div>
              <div className="card__button">
                <button onClick={() => {scrollTo(0, 0); setSelectedMovie(movie)}} type="submit" className="see_text">SEE MORE</button>
              </div>
              </>
            ))
          )
        }
        
       
      </aside>
      <aside className="main__right">
       {
        selectedMovie ? (
          <div className="card__right">
              <div className="card__top">
                <img src={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : '/placeholder.png'} alt="" className="right__poster" />
              </div>
            <div className="card__middle">
                <h1 className="card__title">{selectedMovie.title}</h1>
                <p className="card__desc">
                  {selectedMovie.overview ? truncateText(selectedMovie.overview, 500) : "No description found"}
                </p>
            </div>
            <div className="card__bottom">
                <button onClick={() => handleWatchlist(selectedMovie)}>Add to Watchlist</button>
                <button>Watch Trailer</button>                
            </div>
          </div>
        ) : (
          <div className="no__movies"></div>
        )
       }
      </aside>
    </main>
    </>
  )
}

export default App


