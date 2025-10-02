"use client"

import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "ADMIN";
}

export default function Signup() {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value as SignupFormData[keyof SignupFormData] });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://moviesbooking-8.onrender.com/users/SignUp", formData);
      alert("User Registered Successfully!");
      window.location.href = "/";
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      alert(err +  "Signup failed");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">

      {/* LEFT - Signup Form */}
      <div className="flex justify-center items-center w-full md:w-1/2 bg-gray-100 p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-200 shadow-lg rounded-lg p-6 w-full max-w-md space-y-4"
        >
          {/* Intro Text */}
          <p className="text-center text-gray-600 text-sm">
            Join our movie community — sign up to book tickets instantly!
          </p>

          <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:ring focus:ring-blue-400 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:ring focus:ring-blue-400 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:ring focus:ring-blue-400 outline-none"
          />

          <select
            name="role"
            onChange={handleChange}
            value={formData.role}
            className="w-full border border-gray-300 rounded-lg text-gray-900 px-3 py-2 focus:ring focus:ring-blue-400 outline-none"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
      </div>

      {/* RIGHT - Fight Club Quote */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-black text-white p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center leading-snug uppercase tracking-wide">
          “It's only after we've lost everything<br/>that we're free to do anything.”
          <br />
          <span className="text-lg mt-4 block opacity-70">— Fight Club</span>
        </h1>
      </div>
    </div>
  );
}
