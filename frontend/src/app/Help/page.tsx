"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const helpSteps = [
  {
    step: 1,
    title: "Search for a Movie",
    description:
      "Use the search bar or browse the movies list to find your favorite movie. You can filter by title, genre, or rating.",
  },
  {
    step: 2,
    title: "View Movie Details",
    description:
      "Click on a movie card to see its details, including description, duration, rating, and poster.",
  },
  {
    step: 3,
    title: "Check Seat Availability",
    description:
      "On the movie details page, view the available seats for the showtime you want. The seats are color-coded to show availability.",
  },
  {
    step: 4,
    title: "Book Your Ticket",
    description:
      "Select the seats you want and click 'Book The Ticket'. If you are not logged in, you will be prompted to login first.",
  },
  {
    step: 5,
    title: "View Your Booking Status",
    description:
      "After booking, you can see your current booking status in your profile or dashboard. You will know which seats are confirmed.",
  },
];

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="max-w-4xl mx-auto p-6 pt-32">
        <h1 className="text-4xl font-bold mb-8 text-center">How to Book a Movie</h1>
        <div className="space-y-6">
          {helpSteps.map((step) => (
            <div
              key={step.step}
              className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-semibold mb-2">
                Step {step.step}: {step.title}
              </h2>
              <p className="text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default HelpPage;
