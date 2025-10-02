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
          `https://moviesbooking-8.onrender.com/api/custumer/schedules/${movieId}`,
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
      <div className="flex flex-col items-center justify-center h-screen bg-white text-black">
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
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-black text-lg">No schedules found for this movie.</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <div className="text-black border-b-4 border-gray-800 shadow-md">
        <Header />
      </div>

      <div className="flex-1 p-6 pt-22">
        <h2 className="text-3xl font-bold text-black mb-8 text-center">
          Available Schedules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-zinc-100 rounded-xl shadow-lg p-6 hover:scale-105 transform transition-transform duration-300 relative"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-black mb-1">
                  {schedule.theater.name}
                </h3>
                <p className="text-black">{schedule.theater.location}</p>
              </div>

              <div className="mb-6">
                <p className="text-black">
                  <span className="font-semibold">Start:</span>{" "}
                  {new Date(schedule.startTime).toLocaleString()}
                </p>
                <p className="text-black">
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
      </div>

    
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
