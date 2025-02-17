"use client";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";

export default function BiographyMovies({ genre, apiKey }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    const response = await axiosInstance.get(
      `/discover/movie?api_key=${apiKey}&with_genres=${genre.id}`,
      {
              baseURL: BASE_URL
      }
    );
    const data = await response.data;
    setMovies(data.results);
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) return <h2>Loading Comedy Movies...</h2>;

  return (
    <div className="movies-container">
    
      <div className="movies-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <img
              src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
              style={{marginLeft:"50px"}}
              
            />
            <p className="movie-title">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
