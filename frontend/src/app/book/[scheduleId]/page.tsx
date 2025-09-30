"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface Seat {
  id: string;
  row: string;
  number: number;
  isVip: boolean;
  reserved?: boolean;
}

const Loader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center h-40 bg-gray-700">
    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-3 text-white text-sm">Booking your perfect seat...</p>
  </div>
);

export default function BookSeatsPage() {
  const { scheduleId } = useParams();
  const router = useRouter();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  useEffect(() => {
    const fetchSeats = async () => {
      const token = localStorage.getItem("token");
      if (!token) return alert("Login first");

      try {
        const res = await fetch(`http://localhost:3000/api/custumer/seats/${scheduleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch seats");

        const data: Seat[] = await res.json();
        setSeats(data);
      } catch (err) {
        console.error("Failed to fetch seats:", err);
        alert("Failed to load seats");
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) fetchSeats();
  }, [scheduleId]);

  const reserveSeats = async () => {
    if (reserving) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("Login first");
    if (!selectedSeats.length) return alert("Select seats first");

    setReserving(true);

    try {
      const res = await fetch("http://localhost:3000/api/custumer/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ scheduleId, seatIds: selectedSeats }),
      });

      const data = await res.json();
      if (!res.ok) return alert("Reservation failed: " + (data.error || "Unknown error"));

      alert("Seats reserved successfully!");
      router.push(`/payment/${data.reservations[0].id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to reserve seats");
    } finally {
      setReserving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <Header />

      <div className="p-6 bg-gray-900 min-h-screen text-white pt-32">
        <h2 className="text-2xl font-bold mb-4">Select Seats</h2>

        <div className="grid grid-cols-6 gap-3 mb-6">
          {seats.map((seat) => (
            <button
              key={seat.id}
              type="button" // ✅ Prevents reload
              onClick={() => toggleSeat(seat.id)}
              disabled={seat.reserved}
              className={`p-2 rounded transition ${
                selectedSeats.includes(seat.id)
                  ? "bg-green-600"
                  : seat.reserved
                  ? "bg-gray-500 cursor-not-allowed"
                  : seat.isVip
                  ? "bg-pink-500 hover:bg-yellow-400"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {seat.row}
              {seat.number} {seat.isVip ? "⭐" : ""}
            </button>
          ))}
        </div>

        <button
          type="button" // ✅ Prevents reload
          onClick={reserveSeats}
          disabled={reserving}
          className="bg-red-600 px-6 py-2 rounded font-bold hover:bg-red-700 transition disabled:opacity-50"
        >
          {reserving ? "Reserving..." : "Reserve Selected Seats"}
        </button>

        <Footer />
      </div>
    </div>
  );
}
