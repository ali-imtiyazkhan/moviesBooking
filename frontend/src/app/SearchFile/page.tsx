"use client";
import Image from "next/image";
import React, { useState } from "react";

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export default function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=8a0303e3`
      );
      const data = await res.json();
      if (data.Search) setMovies(data.Search);
      else setMovies([]);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setMovies([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* Search Bar */}
      <div className="flex gap-2 mb-6 max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-700 bg-gray-800 text-white rounded px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && movies.length === 0 && (
        <p className="text-center text-gray-400 mt-20 text-lg">
          🔍 Search any movie you like
        </p>
      )}

      {/* Movie Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        {movies.map((m) => (
          <div
            key={m.imdbID}
            className="bg-white/10 border border-gray-700 rounded-xl shadow-lg p-3 flex flex-col items-center backdrop-blur-md hover:scale-105 hover:shadow-xl transition-transform duration-300"
          >
            <div className="w-40 h-60 relative mb-3">
              <Image
                src={m.Poster !== "N/A" ? m.Poster : "/placeholder.png"}
                alt={m.Title}
                fill
                className="object-cover rounded-lg"
                unoptimized={true} // optional, avoids remote image issues if not in next.config.js domains
              />
            </div>
            <h2 className="text-center font-bold">{m.Title}</h2>
            <p className="text-sm text-gray-400">{m.Year}</p>
            <button className="mt-2 bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white transition">
              Book Show
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
