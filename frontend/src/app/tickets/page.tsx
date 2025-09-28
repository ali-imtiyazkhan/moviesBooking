"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Ticket {
  id: string;
  reservation?: {
    schedule?: {
      movie?: { title: string };
      theater?: { name: string; location: string };
      startTime?: string;
    };
    seatId?: string;
    status?: string;
  };
  issuedAt?: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token");
      if (!token) return alert("Login first");

      try {
        const res = await fetch("http://localhost:3000/api/custumer/tickets", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch tickets");
        const data: Ticket[] = await res.json();
        setTickets(data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <p className="text-white p-6">Loading tickets...</p>;

  return (

    <div>
      <Header />

      <div className="p-6 pt-32 bg-gray-900 min-h-screen text-white">
        <h2 className="text-2xl font-bold mb-4">Your Tickets</h2>

        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <ul className="space-y-4">
            {tickets.map((ticket) => (
              <li
                key={ticket.id}
                className="bg-gray-800 p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-bold">
                    {ticket.reservation?.schedule?.movie?.title || "Unknown Movie"}
                  </p>
                  <p>
                    {ticket.reservation?.schedule?.startTime
                      ? new Date(ticket.reservation.schedule.startTime).toLocaleString()
                      : "Unknown Time"}
                  </p>
                  <p>Seat: {ticket.reservation?.seatId || "Unknown"}</p>
                  <p>Status: {ticket.reservation?.status || "Unknown"}</p>
                </div>
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="text-blue-400 hover:underline"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Footer />
      </div>


    </div>);
}
