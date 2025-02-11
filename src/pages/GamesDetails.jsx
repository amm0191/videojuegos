import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_KEY = "4ec56cdfe1cd49d6a4c0726ee48d663a";
const BASE_URL = "https://api.rawg.io/api/games";

function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGameDetails() {
      try {
        const response = await fetch(`${BASE_URL}/${id}?key=${API_KEY}`);
        if (!response.ok) throw new Error("No se pudo obtener el juego");
        
        const data = await response.json();
        setGame(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGameDetails();
  }, [id]);

  if (loading) return <p className="text-center text-lg text-white">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-gradient-to-r from-amber-300 to-green-400 min-h-screen">
      <div className="container mx-auto p-6 md:p-12">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Título */}
          <div className="bg-gray-900 text-white p-6 text-center">
            <h1 className="text-4xl font-extrabold">{game.name}</h1>
            <p className="text-lg mt-2">{game.genres.map(g => g.name).join(", ")}</p>
          </div>

          {/* Imagen del juego */}
          <div className="relative">
            <img
              src={game.background_image}
              alt={game.name}
              className="w-full h-96 object-cover shadow-lg transition-transform"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <h3 className="text-2xl font-semibold text-white">{game.name}</h3>
              <p className="text-sm text-white">⭐ {game.rating} / 5</p>
            </div>
          </div>

          {/* Descripción */}
          <div className="p-6 bg-gray-100 text-gray-700">
            <p className="text-lg">{game.description_raw}</p>
          </div>

          {/* Detalles del juego */}
          <div className="p-6 mt-4 bg-gray-50 rounded-lg shadow-inner">
            <div className="flex flex-wrap justify-between text-gray-800">
              <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
                <p><strong>📅 Fecha de lanzamiento:</strong> {game.released}</p>
                <p><strong>🕹️ Plataformas:</strong> {game.platforms.map(p => p.platform.name).join(", ")}</p>
              </div>
              <div className="w-full sm:w-1/2">
                <p><strong>⭐ Puntuación:</strong> {game.rating} / 5</p>
                <p><strong>🎮 Géneros:</strong> {game.genres.map(g => g.name).join(", ")}</p>
              </div>
            </div>
          </div>

          {/* Botón de Volver */}
          <div className="text-center my-6">
            <Link
              to="/"
              className="bg-white text-white py-2 px-6 rounded-lg hover:bg-black transition"
            >
              Volver a la Página Principal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameDetails;
