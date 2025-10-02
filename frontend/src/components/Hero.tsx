import React from 'react';
import { assets } from '../../public/assets/assets';

const Hero = () => {
  return (
    <div
      className="flex flex-col items-start justify-center gap-6 px-6 md:px-16 lg:px-36 h-screen
                 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${assets.background.src})` }} 
    >
      <img
        src={assets.marvelLogo.src}
        alt="Marvel Logo"
        className="max-h-11 lg:h-11 mt-20"
      />

      <h1 className="text-5xl md:text-[70px] md:leading-[4.5rem] font-semibold max-w-2xl text-white">
        Guardians <br /> of the Galaxy
      </h1>

      <p className="text-lg md:text-xl text-gray-200 max-w-xl">
        Experience the epic adventure of the galaxy’s most unlikely heroes. Join Star-Lord and the team in their action-packed journey.
      </p>

      <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg mt-6">
        Book Now 
      </button>
    </div>
  );
};

export default Hero;
