"use client"

import React, { useState } from 'react';

interface Theaters {
    name: string;
    location: string;
}

const Page = () => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [message, setMessage] = useState("");

    const handleTheater = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("Please login first then try.");
            return;
        }

        if (!name || !location) {
            setMessage("Please fill all fields.");
            return;
        }

        try {
            const theater: Theaters = { name, location };
            const res = await fetch("http://localhost:3000/api/theaters", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(theater)
            });

            if (!res.ok) {
                throw new Error("Failed to create theater");
            }

            setMessage("Theater added successfully!");
            setName("");
            setLocation("");
            window.location.href = "/Theaters"
        } catch (err: any) {
            setMessage(err.message || "Something went wrong, please try again.");
        }
    };

    return (
        <div className="p-4 max-w-full flex justify-center items-center mx-auto min-h-screen bg-gray-600">
            <form onSubmit={handleTheater} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Theater name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border p-2 rounded"
                />
                <button type="submit" className="bg-gray-800 text-white p-2 rounded hover:bg-gray-900">
                    Submit
                </button>
                {message && <p className="text-green-500">{message}</p>}
            </form>
        </div>
    );
};

export default Page;
