"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useParams, useRouter } from "next/navigation";

export default function PaymentPage() {
  const { reservationId } = useParams();
  const router = useRouter();

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login first");

    try {

      alert("Payment Successful!");

      router.push(`/tickets`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while creating ticket");
    }
  };

  return (
    <div>

      <Header/>
      <div className="p-6 pt-32 bg-gray-900 min-h-screen text-white">
        <h2 className="text-2xl font-bold mb-4">Payment Page</h2>
        <p>Reservation ID: {reservationId}</p>

        <button
          onClick={handlePayment}
          className="bg-green-600 px-6 py-2 rounded font-bold hover:bg-green-700 mt-4"
        >
          Proceed to Pay
        </button>
        
        <Footer/>
      </div>
      
    </div>);
}
