"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { assets } from "../../public/assets/assets";
import { MenuIcon, SearchIcon, XIcon, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const router = useRouter();

  const closeAll = () => {
    setMobileOpen(false);
    setLoginOpen(false);
    setAdminDropdownOpen(false);
  };

  return (
    <>
     
      {(mobileOpen || loginOpen) && (
        <div
          className="fixed inset-0 bg-zinc-200 backdrop-blur-sm z-40 opacity-100 transition-opacity duration-300"
          onClick={closeAll}
        />
      )}

      <header className="fixed text-zinc-500 top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 bg-transparent border-b border-gray-400/40 backdrop-blur-sm transition">
        <Link href="/">
          <Image src={assets.logo} alt="Logo" width={144} height={48} />
        </Link>

        <nav
          className={`flex flex-col md:flex-row items-center gap-8 md:gap-6 
            absolute md:static top-0 left-0 w-full md:w-auto h-screen md:h-auto 
            bg-white/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none 
            p-8 md:p-0 md:rounded-none rounded-b-xl border-b md:border-none border-gray-300/30
            transform transition-all duration-500 ease-in-out pt-36
            ${mobileOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 md:translate-x-0 md:opacity-100"}`}
        >
          <XIcon
            className="md:hidden w-6 h-6 absolute top-6 right-6 text-black cursor-pointer"
            onClick={() => setMobileOpen(false)}
          />
          <Link href="/" onClick={closeAll} className="text-zinc-600">Home</Link>
          <Link href="/Movies" onClick={closeAll} className="text-zinc-600">Movies</Link>
          <Link href="/Theaters" onClick={closeAll} className="text-zinc-600">Theaters</Link>
          <Link href="/Help" className="text-zinc-600" onClick={closeAll}>Help</Link>
        </nav>

        <div className="flex items-center gap-4">
          <SearchIcon
            className="w-6 h-6 cursor-pointer"
            onClick={() => router.push("/SearchFile")}
          />

          <div className="relative">
            <button
              onClick={() => setLoginOpen(!loginOpen)}
              className="px-4 py-1 sm:px-7 sm:py-2 border-2 border-zinc-200 bg-zinc-50 hover:bg-gray-800 hover:text-white transition rounded-full font-medium cursor-pointer text-black"
            >
              Special
            </button>

            {loginOpen && (
              <div className="absolute right-0 mt-0.5 gap-2 bg-zinc-200 text-black shadow-lg rounded-lg overflow-hidden w-48 z-50 animate-fadeIn">
                <button
                  onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                  className="flex justify-between items-center w-full px-4 py-2 text-left hover:bg-gray-200 border-b border-gray-300 rounded-t-lg"
                >
                  Admin Options
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>

                {adminDropdownOpen && (
                  <div className="flex flex-col bg-gray-100">
                    <Link href="/AddMovies" className="px-4 py-2 hover:bg-gray-200" onClick={closeAll}>Add Movies</Link>
                    <Link href="/AddSchedules" className="px-4 py-2 hover:bg-gray-200" onClick={closeAll}>Add Schedule</Link>
                    <Link href="/ManageTickets" className="px-4 py-2 hover:bg-gray-200" onClick={closeAll}>Manage Tickets</Link>
                    <Link href="/Info" className="px-4 py-2 hover:bg-gray-200" onClick={closeAll}>Total Info</Link>
                  </div>
                )}

                <button
                  onClick={() => router.push("/CustomerLogin")}
                  className="block w-full border-t px-4 py-2 text-left hover:bg-gray-200 rounded-b-lg"
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
      </header>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Header;
