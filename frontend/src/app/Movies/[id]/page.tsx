"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  rating: string;
  poster?: string;
}

const MovieDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://moviesbooking-8.onrender.com/api/custumer/movies/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch movie");

        const data: Movie = await res.json();

        if (!data.poster) {
          try {
            const resPoster = await fetch(
              `https://www.omdbapi.com/?t=${encodeURIComponent(data.title)}&apikey=8a0303e3`
            );
            const posterData = await resPoster.json();
            data.poster = posterData.Poster && posterData.Poster !== "N/A" ? posterData.Poster : "/placeholder.png";
          } catch {
            data.poster = "/placeholder.png";
          }
        }

        setMovie(data);
      } catch (err) {
        setError(err + "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);


  if (loading) {
    return (
      <div className="min-h-screen pt-5 bg-white text-black">
        <Header />
        <div className="max-w-4xl mx-auto p-6 pt-32">
          <div className="animate-pulse">
            <div className="w-full h-[840px] bg-zinc-200 rounded-xl mb-6" />
            <div className="h-10 bg-gray-600 rounded w-3/4 mb-4" />
            <div className="h-6 bg-gray-600 rounded w-1/2 mb-2" />
            <div className="h-6 bg-gray-600 rounded w-1/4 mb-2" />
            <div className="h-24 bg-gray-600 rounded w-full mb-4" />
            <div className="h-12 bg-gray-600 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!movie) return <p className="p-4 text-white">Movie not found</p>;

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <div className="max-w-4xl mx-auto p-6 pt-32 border-l-2 border-r-2 border-gray-500">
        <img
          src={movie.poster || "/placeholder.png"}
          alt={movie.title}
          className="w-full h-[840px] object-cover rounded-xl mb-6"
        />
        <h1 className="text-4xl font-bold mb-4 text-black">{movie.title}</h1>
        <p className="mb-2 text-black"><strong>Duration:</strong> {movie.duration} mins</p>
        <p className="mb-2 text-black"><strong>Rating:</strong> {movie.rating}</p>
        <p className="mb-4 text-black"><strong>Description:</strong> {movie.description}</p>
        <button
          onClick={() => router.push(`/schedules/${movie.id}`)}
          className="px-6 py-2 bg-red-600 rounded hover:bg-blue-800 transition"
        >
          Book The Ticket
        </button>
      </div>

      <Footer/>
    </div>
  );
};

export default MovieDetailPage;
