"use client";

import { useState, useEffect } from "react";
import "./style.css";
import axiosInstance from "@/utils/axiosInstance";

const API_KEY = "62ba84da719c3812b6d078e3f7c2e4f1";

export default function MovieDetail({ params }) {
  const [movieId, setMovieId] = useState(null);
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setMovieId(resolvedParams.movieId);
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (movieId) {
      fetchMovieDetail();
      fetchMovieTrailer();
      fetchMovieCast();
      fetchRelatedMovies();
    }
  }, [movieId]);

  const fetchMovieDetail = async () => {
    setIsLoading(true);
    const response = await axiosInstance.get(
      `/movie/${movieId}?api_key=${API_KEY}`,
      { baseURL: "https://api.themoviedb.org/3" }
    );
    const data = await response.data;
    setMovie(data);
    setIsLoading(false);
  };

  const fetchMovieTrailer = async () => {
    const response = await axiosInstance.get(
      `/movie/${movieId}/videos?api_key=${API_KEY}`,
      { baseURL: "https://api.themoviedb.org/3" }
    );
    const data = await response.data;
    const trailer = data.results.find((video) => video.type === "Trailer");
    setTrailer(trailer);
  };

  const fetchMovieCast = async () => {
    const response = await axiosInstance.get(
      `/movie/${movieId}/credits?api_key=${API_KEY}`,
      { baseURL: "https://api.themoviedb.org/3" }
    );
    const data = await response.data;
    setCast(data.cast);
  };

  const fetchRelatedMovies = async () => {
    const response = await axiosInstance.get(
      `/movie/${movieId}/similar?api_key=${API_KEY}`,
      { baseURL: "https://api.themoviedb.org/3" }
    );
    const data = await response.data;
    setRelatedMovies(data.results);
  };

  const nextSlide = () => {
    if (currentSlide < relatedMovies.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const playNow = () => {
    if (trailer) {
      setIsTrailerModalOpen(true);
    }
  };

  const closeTrailerModal = () => {
    setIsTrailerModalOpen(false);
  };

  useEffect(() => {
    const sliderInterval = setInterval(() => {
      const castContainer = document.querySelector(".md-cast-members");
      if (castContainer) {
        castContainer.scrollLeft += 1;
        if (
          castContainer.scrollLeft + castContainer.offsetWidth >=
          castContainer.scrollWidth
        ) {
          castContainer.scrollLeft = 0;
        }
      }
    }, 50);

    return () => clearInterval(sliderInterval);
  }, [cast]);

  return (
    <div className="md-movie-detail-container">
      {movie && movie.backdrop_path ? (
        <img
          className="md-background-image"
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
        />
      ) : (
        <div className="md-no-image">No Background Image Available</div>
      )}

      <div className="md-movie-content">
        <div className="md-left-section">
          {isLoading ? (
            <div>Loading movie details...</div>
          ) : movie ? (
            <>
              <h2 className="md-movie-title">{movie.title}</h2>
              <div className="md-movie-info">
                <span>⭐ {movie.vote_average}</span>
                <span>{movie.runtime} min</span>
                <span>{movie.release_date}</span>
              </div>
              <p className="md-movie-overview">{movie.overview}</p>
              <div className="md-buttons">
                <button onClick={playNow}>Play Now</button>
              </div>
            </>
          ) : (
            <div>Error loading movie details</div>
          )}
        </div>

        <div className="md-right-section">
          <div className="md-related-movies-section">
            <h3>Related Movies</h3>
            <div className="md-related-movies-slider">
              <div
                className="md-related-movies-wrapper"
                style={{
                  transform: `translateX(-${currentSlide * 200}px)`,
                }}
              >
                {relatedMovies.length > 0 ? (
                  relatedMovies.map((relatedMovie) => (
                    <div
                      key={relatedMovie.id}
                      className="md-related-movie-card"
                      onClick={() => setMovieId(relatedMovie.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={
                          relatedMovie.poster_path
                            ? `https://image.tmdb.org/t/p/w200${relatedMovie.poster_path}`
                            : "/images/dummy.jpg"
                        }
                        alt={relatedMovie.title}
                        onError={(e) =>
                          (e.target.src = "/images/dummy.jpg")
                        }
                      />
                      <p>{relatedMovie.title}</p>
                    </div>
                  ))
                ) : (
                  <div>No related movies available</div>
                )}
              </div>
              <div className="md-slider-buttons">
                <button onClick={prevSlide}>❮</button>
                <button onClick={nextSlide}>❯</button>
              </div>
            </div>
          </div>

          <div className="md-cast-section">
            <h3>Cast</h3>
            <div className="md-cast-members">
              {cast.map((member) => (
                <div key={member.id} className="md-cast-member">
                  <img
                    src={
                      member.profile_path
                        ? `https://image.tmdb.org/t/p/w200${member.profile_path}`
                        : "/images/dummy.jpg"
                    }
                    alt={member.name}
                    onError={(e) =>
                      (e.target.src = "/images/dummy.jpg")
                    }
                  />
                  <span>{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isTrailerModalOpen && trailer && (
        <div className="md-trailer-modal">
          <div className="md-trailer-modal-content">
            <button className="md-close-button" onClick={closeTrailerModal}>
              &times;
            </button>
            <iframe
              width="100%"
              height="400px"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Trailer"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
