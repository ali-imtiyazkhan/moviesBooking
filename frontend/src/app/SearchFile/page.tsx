"use client"
import React, { useState } from "react"

interface Movie {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export default function MovieSearch() {
  const [query, setQuery] = useState("")
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query) return
    setLoading(true)
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=8a0303e3`
      )
      const data = await res.json()
      if (data.Search) setMovies(data.Search)
      else setMovies([])
    } catch (err) {
      console.error("Error fetching movies:", err)
      setMovies([])
    }
    setLoading(false)
  }

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded px-4 py-2 flex-1"
        />
        <button
          onClick={handleSearch}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((m) => (
          <div key={m.imdbID} className="flex flex-col items-center">
            <img
              src={m.Poster !== "N/A" ? m.Poster : "/placeholder.png"}
              alt={m.Title}
              className="w-48 h-72 object-cover rounded"
            />
            <h2 className="mt-2 font-semibold">{m.Title}</h2>
            <p className="text-sm text-gray-500">{m.Year}</p>
            <button className="cursor-pointer">Book Show</button>
          </div>
        ))}
      </div>
    </div>
  )
}
