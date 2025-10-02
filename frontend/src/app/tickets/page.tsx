"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TicketIcon } from "lucide-react";

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
        const res = await fetch("https://moviesbooking-8.onrender.com/api/custumer/tickets", {
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

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-black">
        <div className="w-10 h-10 border-4 border-black border-t-white rounded-full animate-spin"></div>
        <p className="mt-4 text-black">Fetching your tickets...</p>
      </div>
    );

  return (
    <div className="bg-white text-black">
      <Header />

      <div className="p-6 pt-32  min-h-screen text-black">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <TicketIcon className="w-7 h-7 text-yellow-400" /> Your Tickets
        </h2>

        {tickets.length === 0 ? (
          <p className="text-black">No tickets found.</p>
        ) : (
          <ul className="space-y-">
            {tickets.map((ticket) => (
              <li
                key={ticket.id}
                className="bg-zinc-200 p-5 rounded-xl shadow-md border border-zinc-300 hover:scale-[1.01] transition-all flex justify-between items-center"
              >
                <div>
                  <p className="text-xl font-semibold text-yellow-400">
                    {ticket.reservation?.schedule?.movie?.title || "Unknown Movie"}
                  </p>
                  <p className="text-black">
                    {ticket.reservation?.schedule?.startTime
                      ? new Date(ticket.reservation.schedule.startTime).toLocaleString()
                      : "Unknown Time"}
                  </p>
                  <p className="text-black">🪑 Seat: {ticket.reservation?.seatId || "Unknown"}</p>
                  <p className="text-black">📌 Status: {ticket.reservation?.status || "Unknown"}</p>
                </div>
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="text-blue-400 font-medium hover:text-blue-200 transition"
                >
                  View →
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Footer />
      </div>
    </div>
  );
}
