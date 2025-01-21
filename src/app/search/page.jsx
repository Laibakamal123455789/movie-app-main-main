"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BASE_URL, API_KEY } from "@/lib/apiConfig";
import Link from "next/link";
import "./search.css";
import axiosInstance from "@/utils/axiosInstance";

export default function Search() {
  const [movies, setMovies] = useState([]);
  const params = useSearchParams();
  const searchText = params.get("q")?.toLowerCase() || "";
  const dummyImage = "/images/dummy.jpg"; 

  useEffect(() => {
    const fetchMovies = async () => {
      if (searchText) {
        const response = await axiosInstance.get(
          `/search/movie?api_key=${API_KEY}&query=${searchText}`,{
             baseURL: BASE_URL
          }
        );
        const data = await response.data;
        setMovies(data.results || []);
      }
    };
    fetchMovies();
  }, [searchText]);

  return (
    <div className="search-page">
      <h2 className="search-title">Search Results for "{searchText}"</h2>
      <div className="search-movie-list">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="search-movie-card">
              <Link href={`/movies/${movie.id}`}>
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : dummyImage
                  }
                  alt={movie.title}
                  className="search-movie-image"
                />
              </Link>
              <div className="search-movie-details">
                <h3 className="search-movie-title">{movie.title}</h3>
                <div className="search-movie-para">
                  <p className="search-movie-vote">⭐ {movie.vote_average}</p>
                  <p className="search-movie-date">{movie.release_date}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="search-no-movies">No results found.</p>
        )}
      </div>
    </div>
  );
}
