"use client";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import "./TrendsNow.css";
import { BASE_URL, API_KEY } from "@/lib/apiConfig";
import Link from "next/link";

export default function TrendsNow() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Action");
  const [movies, setMovies] = useState([]);

  const fetchGenres = async () => {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await response.json();
    setCategories(
      data.genres.filter((genre) =>
        ["Action", "Comedy", "Drama", "Horror", "Biography", "Adventure", "Crime"].includes(
          genre.name
        )
      )
    );
  };

  const fetchMoviesByGenre = async (genreId) => {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
    const data = await response.json();
    setMovies(data.results);
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const genre = categories.find((cat) => cat.name === selectedCategory);
      if (genre) fetchMoviesByGenre(genre.id);
    }
  }, [selectedCategory, categories]);

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

  return (
    <div className="trends-container">
      <h2 className="trends-title">Trends Now</h2>
      <hr className="trends-divider" />
      <div className="trends-filters">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.name)}
            className={`trends-filter-button ${
              selectedCategory === category.name ? "trends-filter-active" : ""
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      {movies.length > 0 ? (
        <Slider {...sliderSettings} className="trends-slider">
          {movies.map((movie) => (
            <div key={movie.id} className="trends-movie-card">
              <Link key={movie.id} href={`/movies/${movie.id}`}>
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
        <p className="trends-no-movies">Select a category to see movies!</p>
      )}
    </div>
  );
}
