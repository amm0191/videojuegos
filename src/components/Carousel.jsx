import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getGames } from "../services/api";

const Carousel = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch featured games for the carousel
  useEffect(() => {
    const fetchFeaturedGames = async () => {
      try {
        setLoading(true);
        // Get popular games with high ratings
        const data = await getGames(1, 5, "");
        setGames(data.results.filter(game => game.background_image));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedGames();
  }, []);

  // Auto-advance the carousel
  useEffect(() => {
    if (games.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [games]);

  // Handle manual navigation
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + games.length) % games.length);
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
  };

  if (loading) return <div className="h-96 flex items-center justify-center bg-gray-800 text-white">Cargando carrusel...</div>;
  if (error) return <div className="h-96 flex items-center justify-center bg-gray-800 text-red-500">Error: {error}</div>;
  if (games.length === 0) return null;

  return (
    <div className="relative h-[500px] overflow-hidden rounded-xl shadow-2xl">
      {/* Carousel slides */}
      <div className="relative h-full">
        {games.map((game, index) => (
          <div
            key={game.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={game.background_image || "/placeholder.svg"}
              alt={game.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="text-4xl font-bold mb-2 drop-shadow-lg">{game.name}</h2>
              <p className="text-xl mb-4 drop-shadow-md">
                ⭐ {game.rating} | {game.genres.map(g => g.name).join(", ")}
              </p>
              <div className="flex gap-4">
                <Link
                  to={`/games/${game.id}`}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
                >
                  Ver detalles
                </Link>
                <Link
                  to="/"
                  className="bg-white hover:bg-gray-100 text-green-600 px-6 py-2 rounded-lg transition"
                >
                  Ver todos los juegos
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicator dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {games.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
