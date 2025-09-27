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
      const res = await axios.post("http://localhost:3000/users/SignUp", formData);
      alert("User Registered Successfully!");
      window.location.href = "/";
      localStorage.setItem("token",res.data.token)
      console.log(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 shadow-lg rounded-lg p-6 w-full max-w-md space-y-4"
      >
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
  );
}
