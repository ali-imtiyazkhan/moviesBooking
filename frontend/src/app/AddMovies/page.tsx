"use client";

import Header from "@/components/Header";
import React, { useState } from "react";

const AddMovie = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    rating: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You must be logged in as ADMIN");
      return;
    }

    const payload = {
      ...form,
      duration: Number(form.duration),
      rating: String(form.rating),
    };

    try {
      const res = await fetch("https://moviesbooking-8.onrender.com/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage(" Movie added successfully!");
        setForm({ title: "", description: "", duration: "", rating: "" });
        window.location.href = "/Movies";
      } else {
        const data = await res.json();
        setMessage(` Error: ${data.error}`);
      }
    } catch (err) {
      console.log(err);
      setMessage("⚠️ Failed to connect to server");
    }
  };

  return (

    <div>

      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white/10 backdrop-blur-lg shadow-2xl border border-gray-700 rounded-2xl w-full max-w-lg space-y-4 text-white"
        >
          <h2 className="text-3xl font-bold text-center text-blue-400">
            🎬 Add New Movie
          </h2>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Movie Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter movie title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-600 bg-gray-800 rounded-lg text-white focus:ring focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Enter short description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-600 bg-gray-800 rounded-lg text-white focus:ring focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-1">
                Duration (min)
              </label>
              <input
                type="number"
                name="duration"
                placeholder="120"
                value={form.duration}
                onChange={handleChange}
                className="w-full p-2 border border-gray-600 bg-gray-800 rounded-lg text-white focus:ring focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-1">
                Rating (0-10)
              </label>
              <input
                type="number"
                step="0.1"
                name="rating"
                placeholder="8.5"
                value={form.rating}
                onChange={handleChange}
                className="w-full p-2 border border-gray-600 bg-gray-800 rounded-lg text-white focus:ring focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition rounded-lg py-2 font-semibold shadow-lg"
          >
            ➕ Add Movie
          </button>

          {message && (
            <p
              className={`text-center mt-2 ${message.includes("✅")
                ? "text-green-400"
                : message.includes("⚠️")
                  ? "text-yellow-400"
                  : "text-red-400"
                }`}
            >
              {message}
            </p>
          )}
        </form>

      </div>
    </div>);
};

export default AddMovie;
