"use client";

import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  function handleLogOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      router.push("/AdminLogin"); 
    }
  }

  return (
    <footer className="bg-white text-black mt-20 border-t-2 border-zinc-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-800">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="font-bold text-xl">Book Today Show</span>
            </div>
            <p className="text-sm text-gray-400">
              Sharing insights, stories, and ideas that inspire innovation and creativity in the digital world.
            </p>
            <div className="flex space-x-3">
              <button className="p-2 rounded-full hover:bg-gray-700 transition">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-700 transition">
                <Github className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-700 transition">
                <Linkedin className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-700 transition">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {["Home", "About", "Categories", "Archive", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">Categories</h3>
            <ul className="space-y-2 text-sm">
              {["Action", "Sci-fi", "Science", "Horror", "Romance"].map((cat) => (
                <li key={cat}>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">Stay Updated</h3>
            <p className="text-sm text-gray-400">
              Subscribe to get the latest Movies delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500 text-white"
              />
              <button className="w-full sm:w-auto bg-gray-600 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4 md:gap-0">
          <p>&copy; 2024 My Book Show. All rights reserved.</p>

          <button
            onClick={handleLogOut}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition"
          >
            Logout
          </button>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
