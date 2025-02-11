import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";

const API_KEY = "4ec56cdfe1cd49d6a4c0726ee48d663a";
const BASE_URL = "https://api.rawg.io/api/games";

function Games() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para buscar la API
  const fetchGames = async (query = "") => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}?key=${API_KEY}&search=${query}&page_size=50`); // Para aumentar page_size
      if (!response.ok) throw new Error("No se pudieron obtener los juegos");

      const data = await response.json();
      setGames(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Crea una función debounced para hacer la búsqueda
  const debouncedSearch = debounce((query) => {
    fetchGames(query);  // Realiza la búsqueda con el término que el usuario ingresó
  }, 500); // Espera 500ms después de que el usuario deje de escribir

  // Maneja el cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearch(e.target.value);  // Actualiza el término de búsqueda
  };

  // Maneja el submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();  // Previene el comportamiento por defecto del formulario
    debouncedSearch(search); // Llama a la función debounced cuando el usuario envía el formulario
  };

  // Carga juegos por primera vez (sin búsqueda)
  useEffect(() => {
    fetchGames();
  }, []);

  // Mensaje de error o de carga
  if (loading) return <p className="text-center text-lg text-white">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-gradient-to-r from-amber-300 to-green-400 min-h-screen text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-5xl font-extrabold text-center mb-10 drop-shadow-lg">
          ¡Explora los mejores videojuegos!
        </h1>

        {/* Campo de búsqueda */}
        <form onSubmit={handleSubmit} className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Busca tu juego favorito..."
            value={search}
            onChange={handleSearchChange}
            className="w-full sm:w-80 p-4 text-lg rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-800 placeholder-gray-500 shadow-xl"
          />
        </form>

        {/* Lista de juegos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {games.length === 0 ? (
            <p className="text-center text-xl text-gray-300">No se encontraron juegos.</p>
          ) : (
            games.map(game => (
              <Link
                key={game.id}
                to={`/games/${game.id}`}
                className="block bg-white overflow-hidden shadow-2xl transform hover:scale-105 transition duration-300 border-solid border-3 border-black rounded-lg"
              >
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-48 object-cover "
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{game.name}</h2>
                  <p className="text-lg text-gray-600">⭐ {game.rating} / 5</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Games;
