const API_KEY = "4ec56cdfe1cd49d6a4c0726ee48d663a";
const BASE_URL = "https://api.rawg.io/api";




export const getPopularGames = async () => {
  try {
    const response = await fetch(`${BASE_URL}/games?key=${API_KEY}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error al obtener juegos:", error);
    return [];
  }
};
