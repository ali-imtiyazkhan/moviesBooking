"use client"

import { Github, Twitter, Linkedin, Mail } from "lucide-react"
import React from "react"

export default function Footer() {
  function handleLogOut() {
    localStorage.removeItem("token")
    window.location.href = "/router/SignIn"
  }

  return (
    <footer className="bg-muted mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-800">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <span className="font-bold text-xl text-balance">Book Today Show</span>
            </div>
            <p className="text-sm text-muted-foreground text-pretty">
              Sharing insights, stories, and ideas that inspire innovation and creativity in the digital world.
            </p>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-200 transition">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200 transition">
                <Github className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200 transition">
                <Linkedin className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200 transition">
                <Mail className="w-4 h-4" />
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
                    className="text-muted-foreground hover:text-primary transition-colors"
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
              {["Action", "Sci-fi", "science", "Horror", "Romance"].map((cat) => (
                <li key={cat}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
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
            <p className="text-sm text-muted-foreground text-pretty">
              Subscribe to get the latest Movies delivered to your inbox.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary"
              />
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 rounded-md transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <hr className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2024 My Book Show . All rights reserved.</p>

          <button
            onClick={handleLogOut}
            className="bg-gray-800 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition"
          >
            Logout
          </button>

          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
