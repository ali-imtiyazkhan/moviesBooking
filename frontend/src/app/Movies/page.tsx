"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  rating: string;
  poster?: string;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://moviesbooking-8.onrender.com/api/custumer/movies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: Movie[] = await res.json();

        const moviesWithPoster = await Promise.all(
          data.map(async (m) => {
            try {
              const resPoster = await fetch(
                `https://www.omdbapi.com/?t=${encodeURIComponent(m.title)}&apikey=8a0303e3`
              );
              const posterData = await resPoster.json();
              return {
                ...m,
                poster: posterData.Poster !== "N/A" ? posterData.Poster : "/placeholder.png",
              };
            } catch {
              return { ...m, poster: "/placeholder.png" };
            }
          })
        );

        setMovies(moviesWithPoster);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
      setLoading(false);
    };

    fetchMovies();
  }, []);

  const renderLoadingSkeleton = () => {
    const skeletons = Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="flex flex-col items-center bg-gray-600 rounded-xl animate-pulse overflow-hidden"
      >
        <div className="w-full h-80 bg-gray-600" />
        <div className="p-4 w-full flex flex-col items-center">
          <div className="h-6 bg-gray-500 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-500 rounded w-full mb-1" />
          <div className="h-4 bg-gray-500 rounded w-1/2" />
          <div className="mt-4 h-10 bg-gray-500 rounded-full w-1/2" />
        </div>
      </div>
    ));
    return skeletons;
  };

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="bg-zinc-300 text-black border-2 border-zinc-400"><Header /></div>

      <div className="p-6 pt-32 max-w-7xl mx-auto border-r-2 border-l-2 border-gray-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading
            ? renderLoadingSkeleton()
            : movies.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-col items-center bg-zinc-200 rounded-xl shadow-lg hover:scale-105 transform transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/Movies/${m.id}`)}
                >
                  <Image
                    src={m.poster || "/placeholder.png"}
                    alt={m.title}
                    width={400}
                    height={320}
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-4 w-full flex flex-col items-center">
                    <h2 className="text-xl font-bold text-black text-center">{m.title}</h2>
                    <p className="text-gray-500 text-sm mt-2 text-center">{m.description}</p>
                    <p className="text-gray-600 text-sm mt-1">Rating: {m.rating}</p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/Movies/${m.id}`);
                      }}
                      className="mt-4 bg-gray-900 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-full transition-colors shadow-2xl pointer-cursor"
                    >
                      View Details
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/schedules/${m.id}`);
                      }}
                      className="mt-2 bg-gray-600 hover:bg-zinc-800 text-white font-semibold px-6 py-2 rounded-full transition-colors border-2 border-zinc-500 pointer-cursor"
                    >
                      View Schedules
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
