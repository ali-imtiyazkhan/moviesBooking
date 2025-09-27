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
            <div className="p-4 max-w-full min-h-screen pt-27 gap-1.5  mx-auto bg-gray-700">
                {loading && <p>Loading theaters...</p>}
                {message && <p className="text-gray-800">{message}</p>}

                <ul className="mt-4 space-y-2">
                    <ul className="mt-4 space-y-2">
                        {theaters.map((theater) => (
                            <div key={theater.id}>
                                <li
                                    className="border rounded-2xl p-2  shadow-sm bg-gray-800 text-white flex items-center justify-between"
                                >
                                    <div>
                                        <h3 className="font-bold">{theater.name}</h3>
                                        <p>{theater.location}</p>
                                    </div>

                                    <button
                                        className="bg-gray-600 hover:bg-gray-900 text-white px-3 py-1 rounded"
                                        onClick={() => alert(`Status for ${theater.name}`)}
                                    >
                                        See Status
                                    </button>
                                </li>
                            </div>
                        ))}
                    </ul>

                </ul>
            </div>
        </div>);
};

export default Page;
