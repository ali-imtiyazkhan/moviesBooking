import Image from "next/image";
import { dummyShowsData } from "../../public/assets/assets.js";

const Movies = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl text-black font-bold mb-6">Now Showing</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {dummyShowsData.map((movie) => (
          <div
            key={movie._id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <div className="relative w-full h-[400px]">
              <Image
                src={movie.poster_path}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-black text-lg">{movie.title}</h3>
              <p className="text-sm text-black">
                {new Date(movie.release_date).getFullYear()}
              </p>
              <p className="text-xs text-gray-500">
                {movie.genres.map((g) => g.name).join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;
