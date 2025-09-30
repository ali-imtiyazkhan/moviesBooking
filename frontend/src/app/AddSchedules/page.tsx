"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React, { useState, FormEvent } from "react";

const SetSchedule: React.FC = () => {
  const [movieId, setMovieId] = useState<string>("");
  const [theaterId, setTheaterId] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login as an Admin first");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId,
          theaterId,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(errorData.error || "Failed to create schedule");
        return;
      }

      setMessage("Schedule created successfully!");
      setMovieId("");
      setTheaterId("");
      setStartTime("");
      setEndTime("");
    } catch (err: any) {
      setMessage("Network error: " + err.message);
    }
  };

  return (
    <div className="bg-gray-700 min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-grow flex justify-center  items-center p-4 pt-32">
        <div className="max-w-md w-full p-6 bg-gray-600 border border-gray-700 rounded-3xl">
          <h2 className="text-xl font-bold mb-4 text-white">Set Schedule</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Movie Id"
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              className="border p-2 rounded border-gray-200 text-white bg-gray-700"
              required
            />
            <input
              type="text"
              placeholder="Theater Id"
              value={theaterId}
              onChange={(e) => setTheaterId(e.target.value)}
              className="border p-2 rounded text-white bg-gray-700"
              required
            />
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border p-2 rounded text-white bg-gray-700"
              required
            />
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border p-2 rounded text-white bg-gray-700"
              required
            />

            <button
              type="submit"
              className="bg-gray-500 text-white p-2 rounded mt-2 hover:bg-gray-900"
            >
              Set Schedule
            </button>
          </form>
          {message && <p className="mt-3 text-gray-200">{message}</p>}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SetSchedule;
