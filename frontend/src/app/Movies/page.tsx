"use client"

import Header from "@/components/Header"
import React, { useEffect, useState } from "react"

interface Movie {
    id: string
    title: string
    description: string
    duration: number
    rating: string
    poster?: string
}

export default function MoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true)
            try {
                const token = localStorage.getItem("token")
                const res = await fetch("http://localhost:3000/api/custumer/movies", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const data: Movie[] = await res.json()

                const moviesWithPoster = await Promise.all(
                    data.map(async (m) => {
                        try {
                            const resPoster = await fetch(
                                `https://www.omdbapi.com/?t=${encodeURIComponent(m.title)}&apikey=8a0303e3`
                            )
                            const posterData = await resPoster.json()
                            return { ...m, poster: posterData.Poster !== "N/A" ? posterData.Poster : "/placeholder.png" }
                        } catch {
                            return { ...m, poster: "/placeholder.png" }
                        }
                    })
                )

                setMovies(moviesWithPoster)
            } catch (err) {
                console.error("Error fetching movies:", err)
            }
            setLoading(false)
        }

        fetchMovies()
    }, [])

    const renderLoadingSkeleton = () => {
        const skeletons = Array.from({ length: 8 }).map((_, i) => (
            <div
                key={i}
                className="flex flex-col items-center bg-gray-700 rounded-xl animate-pulse overflow-hidden"
            >
                <div className="w-full h-80 bg-gray-600" />
                <div className="p-4 w-full flex flex-col items-center">
                    <div className="h-6 bg-gray-500 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-500 rounded w-full mb-1" />
                    <div className="h-4 bg-gray-500 rounded w-1/2" />
                    <div className="mt-4 h-10 bg-gray-500 rounded-full w-1/2" />
                </div>
            </div>
        ))
        return skeletons
    }

    return (
        <div>
            <Header />
            <div className="p-6  bg-gray-900 min-h-screen pt-32">

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {loading
                        ? renderLoadingSkeleton()
                        : movies.map((m) => (
                              <div
                                  key={m.id}
                                  className="flex flex-col items-center bg-gray-800 rounded-xl shadow-lg hover:scale-105 transform transition-all duration-300 overflow-hidden"
                              >
                                  <img
                                      src={m.poster || "/placeholder.png"}
                                      alt={m.title}
                                      className="w-full h-80 object-cover"
                                  />
                                  <div className="p-4 w-full flex flex-col items-center">
                                      <h2 className="text-xl font-bold text-white text-center">{m.title}</h2>
                                      <p className="text-gray-300 text-sm mt-2 text-center">{m.description}</p>
                                      <p className="text-gray-400 text-sm mt-1">Rating: {m.rating}</p>
                                      <button
                                          onClick={() => alert(`Booking movie: ${m.title}`)}
                                          className="mt-4 bg-gray-600 hover:bg-gray-900 text-white font-semibold px-6 py-2 rounded-full transition-colors"
                                      >
                                          Book Now
                                      </button>
                                  </div>
                              </div>
                          ))}
                </div>
            </div>
        </div>
    )
}
