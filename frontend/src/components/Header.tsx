"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { assets } from "../../public/assets/assets";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);

  const handleSearch = () => {
    console.log("Search for:", searchQuery);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 bg-transparent border-b border-gray-300/40 backdrop-blur-sm transition">
      <Link href="/">
        <Image src={assets.logo} alt="Logo" width={144} height={48} />
      </Link>

      <nav
        className={`flex flex-col md:flex-row items-center gap-8 md:gap-6 
          absolute md:static top-0 left-0 w-full md:w-auto h-screen md:h-auto 
          bg-black/20 md:bg-transparent backdrop-blur md:backdrop-blur-none 
          p-8 md:p-0 md:rounded-none rounded-b-xl border-b md:border-none border-gray-300/30
          transition-all duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <XIcon
          className="md:hidden w-6 h-6 absolute top-6 right-6 cursor-pointer"
          onClick={() => setMobileOpen(false)}
        />
        <Link href="/" onClick={() => setMobileOpen(false)}>
          Home
        </Link>
        <Link href="/Movies" onClick={() => setMobileOpen(false)}>
          Movies
        </Link>
        <Link href="/Theaters" onClick={() => setMobileOpen(false)}>
          Theaters
        </Link>
        <Link href="/new" onClick={() => setMobileOpen(false)}>
          New
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <SearchIcon
          className="w-6 h-6 cursor-pointer"
          onClick={() => setSearchOpen(true)}
        />

        <div className="relative">
          <button
            onClick={() => setLoginOpen(!loginOpen)}
            className="px-4 py-1 sm:px-7 sm:py-2 bg-gray-500 hover:bg-gray-800 transition rounded-full font-medium cursor-pointer"
          >
            LogIn
          </button>

          {loginOpen && (
            <div className="absolute right-0 mt-0.5 gap-2 bg-gray-500 text-black shadow-lg rounded-lg overflow-hidden w-40">
              <button
                onClick={() => (window.location.href = "/AdminLogin")}
                className="block w-full px-4 py-2 text-left hover:bg-gray-200 border-2 rounded-3xl"
              >
                Login as Admin
              </button>

              <button
                onClick={() => (window.location.href = "/CustomerLogin")}
                className="block w-full border-2 rounded-2xl px-4 py-2 text-left hover:bg-gray-200"
              >
                Login as Customer
              </button>
            </div>
          )}
        </div>

        <MenuIcon
          className="md:hidden w-8 h-8 cursor-pointer"
          onClick={() => setMobileOpen(true)}
        />
      </div>

      {searchOpen && (
        <div className="fixed pt-[51px] inset-0 z-50 bg-black/41 min-h-screen backdrop-blur-sm flex items-center justify-center px-4">
          <div className="rounded-xl w-full max-w-lg p-6 relative">
            <XIcon
              className="w-6 h-6 my-4 -mx-6 absolute top-4 right-4 cursor-pointer"
              onClick={() => setSearchOpen(false)}
            />

            <input
              type="text"
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            <button
              onClick={handleSearch}
              className="mt-4 w-full bg-gray-600 text-white py-2 rounded-full hover:bg-gray-800 transition"
            >
              Search
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
