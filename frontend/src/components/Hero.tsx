"use client";

import React from "react";
import Image from "next/image";
import { assets } from "../../public/assets/assets";

const Hero = () => {
  return (
    <div
      className="flex flex-col items-start justify-center gap-6 px-6 md:px-16 lg:px-36 h-screen
                 relative"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={assets.background.src}
          alt="Background"
          fill
          className="object-cover"
          unoptimized={true} // optional if not in next.config.js domains
        />
      </div>

      {/* Marvel Logo */}
      <div className="relative w-auto h-12 mt-20">
        <Image
          src={assets.marvelLogo.src}
          alt="Marvel Logo"
          fill
          className="object-contain"
          unoptimized={true}
        />
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-[70px] md:leading-[4.5rem] font-semibold max-w-2xl text-white">
        Guardians <br /> of the Galaxy
      </h1>

      {/* Description */}
      <p className="text-lg md:text-xl text-gray-200 max-w-xl">
        Experience the epic adventure of the galaxy’s most unlikely heroes. Join Star-Lord and the team in their action-packed journey.
      </p>

      {/* Button */}
      <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg mt-6">
        Book Now
      </button>
    </div>
  );
};

export default Hero;
