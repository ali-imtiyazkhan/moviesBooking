"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function PaymentPage() {
  const { reservationId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const amount = 499;

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login first");

    try {
      setLoading(true);

      const res = await fetch("https://moviesbooking-8.onrender.com/api/custumer/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reservationId })
      })
      const data = await res.json();
      if (!res.ok) return alert("ticket Booking failed: " + (data.error || "Unknown error"));

      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`Payment of ₹${amount} Successful!`);
      router.push(`/tickets`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while creating ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white text-black">
      <Header />

      <div className=" min-h-screen flex flex-col items-center justify-center text-black p-6 pt-32">

        <div className="w-full max-w-md bg-zinc-200 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl text-center">

          <h2 className="text-3xl font-bold mb-4">Complete Your Payment</h2>

          <p className="text-black mb-1">Reservation ID:</p>
          <p className="font-mono text-lg mb-4 bg-black/30 py-2 px-4 rounded-lg inline-block">{reservationId}</p>

          <p className="text-black mb-1">Amount to Pay</p>
          <p className="text-4xl font-extrabold mb-6 text-green-400">₹{amount}</p>

          <button
            onClick={handlePayment}
            disabled={loading}
            className={`bg-zinc-300 border-2 border-gray-200 px-8 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-green-700 transition-all ${loading ? "opacity-70 cursor-not-allowed animate-pulse" : ""
              }`}
          >
            {loading ? "Processing..." : "Proceed to Pay"}
          </button>
        </div>
        <div className="pt-10">  <Footer /></div>


      </div>
    </div>
  );
}
