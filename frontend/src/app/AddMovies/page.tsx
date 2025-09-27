"use client";

import React, { useState } from "react";

const AddMovie = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    rating: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    const res = await fetch("http://localhost:3000/api/movies", {
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
      window.location.href = "/Movies"
    } else {
      const data = await res.json();
      setMessage(` Error: ${data.error}`);
    }
  } catch (err) {
    setMessage(" Failed to connect to server");
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow-lg rounded-lg w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl text-gray-500 font-bold text-center">Add New Movie</h2>

        <input
          type="text"
          name="title"
          placeholder="Movie Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-600"
          required
        />

        <textarea
          name="description"
          placeholder="Movie Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-600"
          required
        />

        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          value={form.duration}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-600"
          required
        />

        <input
          type="number"
          step="0.1"
          name="rating"
          placeholder="Rating (0-10)"
          value={form.rating}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-600"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-800 transition"
        >
          Add Movie
        </button>

        {message && <p className="text-center mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default AddMovie;
