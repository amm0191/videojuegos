"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getGamesByTag } from "../services/api"
import Pagination from "../components/Pagination"

function TagGames() {
  const { id } = useParams()
  const [games, setGames] = useState([])
  const [tagName, setTagName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 20

  useEffect(() => {
    async function fetchGamesByTag() {
      setLoading(true)
      try {
        const data = await getGamesByTag(id, currentPage, pageSize)
        setGames(data.results)
        setTotalPages(Math.ceil(data.count / pageSize))

        // Set tag name from the first game if available
        if (data.results.length > 0) {
          const tag = data.results[0].tags.find((t) => t.id.toString() === id)
          if (tag) {
            setTagName(tag.name)
          }
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGamesByTag()
  }, [id, currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  if (loading && currentPage === 1) return <p className="text-center text-lg text-white">Cargando...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="bg-gradient-to-r from-amber-300 to-green-400 min-h-screen text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-center mb-4 drop-shadow-lg">
          Juegos con el tag: {tagName || `#${id}`}
        </h1>

        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-block bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            ← Volver a la página principal
          </Link>
        </div>

        {/* Lista de juegos */}
        {loading && currentPage > 1 ? (
          <p className="text-center text-lg">Cargando más juegos...</p>
        ) : games.length === 0 ? (
          <p className="text-center text-xl text-gray-300">No se encontraron juegos con este tag.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {games.map((game) => (
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
            ))}
          </div>
        )}

        {/* Paginación */}
        {games.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  )
}

export default TagGames

