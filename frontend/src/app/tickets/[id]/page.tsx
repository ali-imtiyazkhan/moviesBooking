"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Ticket as TicketIcon, ArrowLeft } from "lucide-react";

interface Ticket {
  id: string;
  issuedAt?: string;
  reservation?: {
    seatId?: string;
    status?: string;
    schedule?: {
      movie?: { title: string; duration?: number; rating?: string };
      theater?: { name?: string; location?: string };
      startTime?: string;
      endTime?: string;
    };
  };
}

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/api/custumer/tickets/${ticketId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch ticket");

        const data: Ticket = await res.json();
        setTicket(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load ticket. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (loading)
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <p className="text-lg mb-3">🎬 Grabbing your ticket...</p>
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce delay-150"></div>
        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );

  if (error) return <p className="text-red-400 p-6">{error}</p>;
  if (!ticket) return <p className="text-white p-6">Ticket not found.</p>;

  return (
    <div>
      <Header />

      <div className="pt-28 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center px-4">
        <div className="w-full max-w-lg bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700">
          {/* Title Section */}
          <div className="flex items-center gap-2 mb-4">
            <TicketIcon className="text-yellow-400 w-6 h-6" />
            <h2 className="text-2xl font-bold">Ticket Details</h2>
          </div>

          {/* Movie Title */}
          <p className="text-xl font-semibold text-yellow-400 mb-2">
            {ticket.reservation?.schedule?.movie?.title || "Unknown Movie"}
          </p>

          <div className="space-y-2 text-gray-300">
            <p>
              🎥 <span className="font-medium">Theater:</span>{" "}
              {ticket.reservation?.schedule?.theater?.name || "The New Mall"}{" "}
              {ticket.reservation?.schedule?.theater?.location
                ? `- ${ticket.reservation.schedule.theater.location}`
                : ""}
            </p>
            <p>🪑 <span className="font-medium">Seat:</span> {ticket.reservation?.seatId || "Unknown Seat"}</p>
            <p>📌 <span className="font-medium">Status:</span> {ticket.reservation?.status || "Unknown"}</p>
            <p>
              ⏰ <span className="font-medium">Show Time:</span>{" "}
              {ticket.reservation?.schedule?.startTime
                ? new Date(ticket.reservation.schedule.startTime).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "Unknown"}
            </p>
            <p>
              🧾 <span className="font-medium">Issued At:</span>{" "}
              {ticket.issuedAt
                ? new Date(ticket.issuedAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "Unknown"}
            </p>
          </div>
        </div>

        <Link
          href="/tickets"
          className="mt-6 flex items-center gap-2 text-blue-400 hover:text-blue-200 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all tickets
        </Link>

        <Footer />
      </div>
    </div>
  );
}
