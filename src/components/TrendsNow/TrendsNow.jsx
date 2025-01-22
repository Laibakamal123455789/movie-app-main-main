"use client";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import "./TrendsNow.css";
import { BASE_URL, API_KEY } from "@/lib/apiConfig";
import Link from "next/link";
import axiosInstance from "@/utils/axiosInstance";
import { Provider, useDispatch, useSelector } from "react-redux";
import { setFavourites } from "@/store/slice/moviesFavourite";
import { merastore } from "@/store/store";

export default function Page(){
  return <Provider store={merastore}>
    <TrendsNow/>
  </Provider>
}
function TrendsNow() {
  const [todayMovies, setTodayMovies] = useState([]);
  const [weekMovies, setWeekMovies] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("day");
  const [mappedMovies, setMapppedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  // FETACH WISHLIST
  const { favouriteMovies } = useSelector((state) => state.movieSlice);
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);
  const dispatch = useDispatch();
  // const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchWishlist = async () => {
        try {
          const response = await axiosInstance.get("/auth/wishlist");
          dispatch(setFavourites(response.data.favouriteMovies || []));
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      };

      fetchWishlist();
    }
  }, [isAuthenticated, dispatch]);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const fetchTodayMovies = async () => {
    setLoading(true);
    const response = await axiosInstance.get(
      `/trending/movie/day?api_key=${API_KEY}`,
      {
        baseURL: BASE_URL,
      }
    );
    const data = await response.data;
    setTodayMovies(data.results);
    setLoading(false);
  };

  const fetchWeekMovies = async () => {
    setLoading(true);
    const response = await axiosInstance.get(
      `/trending/movie/week?api_key=${API_KEY}`,
      {
        baseURL: BASE_URL,
      }
    );
    const data = await response.data;
    setWeekMovies(data.results);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedPeriod === "day") {
      if (todayMovies.length === 0) fetchTodayMovies();
    } else {
      if (weekMovies.length === 0) fetchWeekMovies();
    }
  }, [selectedPeriod]);

  const displayedMovies = selectedPeriod === "day" ? todayMovies : weekMovies;
  //UPDATE NEW ARRAY WHEN MOVIES AND FAVORITES ARE FETCHED
  useEffect(() => {
    if(!isAuthenticated) { 
    console.log('LOGGED OUT')
    setMapppedMovies([...displayedMovies]); 
    return
   }
    const moviesWithFavoriteStatus =displayedMovies.map((movie) => ({
      ...movie,
      is_favorite: favouriteMovies.some(
        (favMovie) => favMovie.originalId == movie.id
      ),
    }));

    setMapppedMovies(moviesWithFavoriteStatus);
  }, [favouriteMovies, displayedMovies]);


  return (
    <div className="trends-container">
      <h2 className="trends-title">Trending Movies</h2>
      <hr className="trends-divider" />

      <div className="trends-filters">
        <button
          onClick={() => setSelectedPeriod("day")}
          className={`trends-filter-button ${
            selectedPeriod === "day" ? "trends-filter-active" : ""
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setSelectedPeriod("week")}
          className={`trends-filter-button ${
            selectedPeriod === "week" ? "trends-filter-active" : ""
          }`}
        >
          This Week
        </button>
      </div>

      {loading ? (
        <p className="trends-loading">Loading movies...</p>
      ) : mappedMovies.length > 0 ? (
        <Slider {...sliderSettings} className="trends-slider">
          {mappedMovies.map((movie) => (
            <div key={movie.id} className="trends-movie-card">
              <i
                className={`fa fa-heart heart-icon ${
                  movie.is_favorite ? "filled" : ""
                }`}
              />
              <Link href={`/movies/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="trends-movie-image"
                />
              </Link>
              <div className="trends-movie-details">
                <h3 className="trends-movie-title">{movie.title}</h3>
                <div className="trends-movie-meta">
                  <p className="vote">⭐ {movie.vote_average}</p>
                  <p className="vote">{movie.release_date}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="trends-no-movies">
          {selectedPeriod === "day"
            ? "No movies for today."
            : "No movies for this week."}
        </p>
      )}
    </div>
  );
}
