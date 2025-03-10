"use client"

import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import debounce from "lodash.debounce"
import { getGames } from "../services/api"
import Pagination from "../components/Pagination"

function Games() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [games, setGames] = useState([])
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(Number.parseInt(searchParams.get("page") || "1"))
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 20

  // Función para buscar la API
  const fetchGames = async (query = "", page = 1) => {
    setLoading(true)
    try {
      const data = await getGames(page, pageSize, query)
      setGames(data.results)
      setTotalPages(Math.ceil(data.count / pageSize))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Crea una función debounced para hacer la búsqueda
  const debouncedSearch = debounce((query) => {
    setCurrentPage(1)
    setSearchParams({ search: query, page: "1" })
    fetchGames(query, 1)
  }, 500)

  // Maneja el cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  // Maneja el submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault()
    debouncedSearch(search)
  }

  // Maneja el cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSearchParams({ search, page: page.toString() })
    fetchGames(search, page)
    window.scrollTo(0, 0)
  }

  // Carga juegos cuando cambia la página o la búsqueda en la URL
  useEffect(() => {
    const page = Number.parseInt(searchParams.get("page") || "1")
    const searchQuery = searchParams.get("search") || ""
    setCurrentPage(page)
    setSearch(searchQuery)
    fetchGames(searchQuery, page)
  }, [searchParams])

  // Mensaje de error o de carga
  if (loading) return <p className="text-center text-lg text-white">Cargando...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="bg-gradient-to-r from-amber-300 to-green-400 min-h-screen text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-5xl font-extrabold text-center mb-10 drop-shadow-lg">¡Explora los mejores videojuegos!</h1>

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
            <p className="text-center text-xl text-gray-300 col-span-full">No se encontraron juegos.</p>
          ) : (
            games.map((game) => (
              <Link
                key={game.id}
                to={`/games/${game.id}`}
                className="block bg-white overflow-hidden shadow-2xl transform hover:scale-105 transition duration-300 border-solid border-3 border-black rounded-lg"
              >
                <img
                  src={game.background_image || "/placeholder.svg"}
                  alt={game.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{game.name}</h2>
                  <p className="text-lg text-gray-600">⭐ {game.rating} / 5</p>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Paginación */}
        {games.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  )
}

export default Games

