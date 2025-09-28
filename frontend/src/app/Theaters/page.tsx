"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React, { useState, useEffect } from "react";

interface Theater {
  id: string;
  name: string;
  location: string;
}

const Page = () => {
  const [message, setMessage] = useState("");
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTheaters = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please login first then try");
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:3000/api/custumer/getTheater",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch theaters");
        }

        const data = await res.json();
        setTheaters(data.data || []);
        setMessage("");
      } catch (error: any) {
        console.error(error);
        setMessage(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTheaters();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-700">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full p-6">
        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-10 pt-20">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="mt-3 text-white font-medium">Loading theaters...</span>
          </div>
        )}

        {/* Error / Message */}
        {message && !loading && (
          <p className="text-red-400 font-medium text-center my-6">{message}</p>
        )}

        {/* Theater List */}
        {!loading && theaters.length > 0 && (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 pt-15">
            {theaters.map((theater) => (
              <li
                key={theater.id}
                className="bg-gray-800 text-white rounded-2xl p-5 shadow-lg border border-zinc-700 flex flex-col justify-between hover:scale-105 transition-transform duration-200"
              >
                <div className="mb-4">
                  <h3 className="font-bold text-xl">{theater.name}</h3>
                  <p className="text-gray-300 mt-1">{theater.location}</p>
                </div>

                <button
                  className="self-start bg-gradient-to-r from-zinc-400 to-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded shadow-md  cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={() => alert(`Status for ${theater.name}`)}
                >
                  See Status
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Empty State */}
        {!loading && theaters.length === 0 && !message && (
          <p className="text-white text-center mt-10 font-medium">
            No theaters available.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Page;
