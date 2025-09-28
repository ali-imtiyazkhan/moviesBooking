"use client";

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
        <div>
            <Header />
            <div className="p-4 max-w-full min-h-screen pt-27 gap-1.5 mx-auto bg-gray-700">
                
                {loading && (
                    <div className="flex justify-center items-center py-10">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                        <span className="ml-3 text-white font-medium">Loading theaters...</span>
                    </div>
                )}

                {message && <p className="text-red-400 font-medium">{message}</p>}

                <ul className="mt-4 space-y-2">
                    {theaters.map((theater) => (
                        <li
                            key={theater.id}
                            className="border rounded-2xl p-4 shadow-sm bg-gray-800 text-white flex items-center justify-between"
                        >
                            <div>
                                <h3 className="font-bold text-lg">{theater.name}</h3>
                                <p className="text-gray-300">{theater.location}</p>
                            </div>

                            <button
                                className="bg-gray-600 hover:bg-gray-900 text-white px-3 py-1 rounded"
                                onClick={() => alert(`Status for ${theater.name}`)}
                            >
                                See Status
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Page;
