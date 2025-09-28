"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

  if (loading) return <p className="text-white p-6">Loading ticket...</p>;
  if (error) return <p className="text-red-400 p-6">{error}</p>;
  if (!ticket) return <p className="text-white p-6">Ticket not found.</p>;

  return (

    <div>

      <Header />
      <div className="p-6 pt-32 bg-gray-900 min-h-screen text-white">
        <h2 className="text-2xl font-bold mb-4">Ticket Details</h2>

        <div className="bg-gray-800 p-6 rounded space-y-3">
          <p className="text-lg font-bold">
            Movie: {ticket.reservation?.schedule?.movie?.title || "Unknown Movie"}
          </p>
          <p>
            Theater: {ticket.reservation?.schedule?.theater?.name || "The New Mall"}{" "}
            {ticket.reservation?.schedule?.theater?.location
              ? `- ${ticket.reservation.schedule.theater.location}`
              : ""}
          </p>
          <p>
            Seat: {ticket.reservation?.seatId || "Unknown Seat"}
          </p>
          <p>
            Status: {ticket.reservation?.status || "Unknown"}
          </p>
          <p>
            Show Time: {ticket.reservation?.schedule?.startTime
              ? new Date(ticket.reservation.schedule.startTime).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })
              : "Unknown"}
          </p>
          <p>
            Issued At: {ticket.issuedAt
              ? new Date(ticket.issuedAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })
              : "Unknown"}
          </p>
        </div>

        <Link href="/tickets" className="text-blue-400 hover:underline mt-4 block">
          ← Back to all tickets
        </Link>
        <Footer />
      </div>

    </div>);
}
