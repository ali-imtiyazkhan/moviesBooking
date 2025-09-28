"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Seat {
  id: string;
  row: string;
  number: number;
  isVip: boolean;
  reserved?: boolean;
}

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

  if (loading) return <p className="text-white p-6">Loading seats...</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">Select Seats</h2>

      <div className="grid grid-cols-6 gap-3 mb-6">
        {seats.map((seat) => (
          <button
            key={seat.id}
            onClick={() => toggleSeat(seat.id)}
            disabled={seat.reserved}
            className={`p-2 rounded transition ${
              selectedSeats.includes(seat.id)
                ? "bg-green-600"
                : seat.reserved
                ? "bg-gray-500 cursor-not-allowed"
                : seat.isVip
                ? "bg-yellow-500 hover:bg-yellow-400"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {seat.row}
            {seat.number} {seat.isVip ? "⭐" : ""}
          </button>
        ))}
      </div>

      <button
        onClick={reserveSeats}
        disabled={reserving}
        className="bg-red-600 px-6 py-2 rounded font-bold hover:bg-red-700 transition disabled:opacity-50"
      >
        {reserving ? "Reserving..." : "Reserve Selected Seats"}
      </button>
    </div>
  );
}
