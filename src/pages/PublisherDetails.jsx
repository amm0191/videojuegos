"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getPublisherDetails, getGamesByPublisher } from "../services/api"
import Pagination from "../components/Pagination"

function PublisherDetails() {
  const { id } = useParams()
  const [publisher, setPublisher] = useState(null)
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 12

  useEffect(() => {
    async function fetchPublisherData() {
      setLoading(true)
      try {
        // Fetch publisher details
        const publisherData = await getPublisherDetails(id)
        setPublisher(publisherData)

        // Fetch games by this publisher
        const gamesData = await getGamesByPublisher(id, currentPage, pageSize)
        setGames(gamesData.results)
        setTotalPages(Math.ceil(gamesData.count / pageSize))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPublisherData()
  }, [id, currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  if (loading && currentPage === 1) return <p className="text-center text-lg text-white">Cargando...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="bg-gradient-to-r from-amber-300 to-green-400 min-h-screen">
      <div className="container mx-auto p-6 md:p-12">
        {publisher && (
          <>
            {/* Header con información del publisher */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-10">
              <div className="relative">
                {publisher.image_background && (
                  <img
                    src={publisher.image_background || "/placeholder.svg"}
                    alt={publisher.name}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <h1 className="text-4xl font-extrabold text-white text-center drop-shadow-lg">{publisher.name}</h1>
                </div>
              </div>

              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Información</h2>
                    <p className="mb-2">
                      <strong>Juegos publicados:</strong> {publisher.games_count}
                    </p>
                    {publisher.description && (
                      <div className="mt-4">
                        <h3 className="text-xl font-semibold mb-2">Acerca de</h3>
                        <p className="text-gray-700">{publisher.description}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Juegos populares</h2>
                    <ul className="list-disc pl-5">
                      {publisher.games &&
                        publisher.games.slice(0, 5).map((game) => (
                          <li key={game.id} className="mb-1">
                            <Link to={`/games/${game.id}`} className="text-green-600 hover:underline">
                              {game.name}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de Volver */}
            <div className="mb-8 text-center">
              <Link
                to="/publishers"
                className="inline-block bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition mr-4"
              >
                ← Volver a Publishers
              </Link>
              <Link
                to="/"
                className="inline-block bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Ir a la Página Principal
              </Link>
            </div>

            {/* Lista de juegos del publisher */}
            <h2 className="text-3xl font-bold text-white mb-6">Todos los juegos de {publisher.name}</h2>

            {loading && currentPage > 1 ? (
              <p className="text-center text-lg text-white">Cargando más juegos...</p>
            ) : games.length === 0 ? (
              <p className="text-center text-xl text-white">No se encontraron juegos para este publisher.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {games.map((game) => (
                  <Link
                    key={game.id}
                    to={`/games/${game.id}`}
                    className="block bg-white overflow-hidden shadow-2xl transform hover:scale-105 transition duration-300 rounded-lg"
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
          </>
        )}
      </div>
    </div>
  )
}

export default PublisherDetails

