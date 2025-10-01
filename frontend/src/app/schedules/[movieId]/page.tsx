"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Theater {
  id: string;
  name: string;
  location: string;
}

interface Schedule {
  id: string;
  startTime: string;
  endTime: string;
  movieId: string;
  theater: Theater;
}

export default function MovieSchedulesPage() {
  const { movieId } = useParams();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSchedules = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Please login first, then try.");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:3000/api/custumer/schedules/${movieId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setSchedules(data);
      } catch (error) {
        console.error("Failed to fetch schedules", error);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) fetchSchedules();
  }, [movieId]);
if (loading)
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <p className="text-lg mb-3">🎬 Grabbing Movie schedule...</p>
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce delay-150"></div>
        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );

  if (schedules.length === 0)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white text-lg">No schedules found for this movie.</p>
      </div>
    );

  return (

    <div>

      <Header/>
      <div className="bg-gray-900 min-h-screen p-6 pt-30">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Available Schedules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-gray-800 rounded-xl shadow-lg p-6 hover:scale-105 transform transition-transform duration-300 relative"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {schedule.theater.name}
                </h3>
                <p className="text-gray-400">{schedule.theater.location}</p>
              </div>

              <div className="mb-6">
                <p className="text-gray-300">
                  <span className="font-semibold">Start:</span>{" "}
                  {new Date(schedule.startTime).toLocaleString()}
                </p>
                <p className="text-gray-300">
                  <span className="font-semibold">End:</span>{" "}
                  {new Date(schedule.endTime).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => router.push(`/book/${schedule.id}`)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
        <Footer/>
      </div>
    </div>);
}
