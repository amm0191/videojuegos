"use client"

import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import debounce from "lodash.debounce"
import { getPublishers } from "../services/api"
import Pagination from "../components/Pagination"

function Publishers() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [publishers, setPublishers] = useState([])
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(Number.parseInt(searchParams.get("page") || "1"))
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 20

  // Función para buscar publishers
  const fetchPublishers = async (query = "", page = 1) => {
    setLoading(true)
    try {
      const data = await getPublishers(page, pageSize, query)
      setPublishers(data.results)
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
    fetchPublishers(query, 1)
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
    fetchPublishers(search, page)
    window.scrollTo(0, 0)
  }

  // Carga publishers cuando cambia la página o la búsqueda en la URL
  useEffect(() => {
    const page = Number.parseInt(searchParams.get("page") || "1")
    const searchQuery = searchParams.get("search") || ""
    setCurrentPage(page)
    setSearch(searchQuery)
    fetchPublishers(searchQuery, page)
  }, [searchParams])

  // Mensaje de error o de carga
  if (loading) return <p className="text-center text-lg text-white">Cargando...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="bg-gradient-to-r from-amber-300 to-green-400 min-h-screen text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-5xl font-extrabold text-center mb-10 drop-shadow-lg">
          Explora las mejores compañías de videojuegos
        </h1>

        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-block bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            ← Volver a la página principal
          </Link>
        </div>

        {/* Campo de búsqueda */}
        <form onSubmit={handleSubmit} className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Busca una compañía..."
            value={search}
            onChange={handleSearchChange}
            className="w-full sm:w-80 p-4 text-lg rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-800 placeholder-gray-500 shadow-xl"
          />
        </form>

        {/* Lista de publishers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {publishers.length === 0 ? (
            <p className="text-center text-xl text-gray-300 col-span-full">No se encontraron compañías.</p>
          ) : (
            publishers.map((publisher) => (
              <Link
                key={publisher.id}
                to={`/publishers/${publisher.id}`}
                className="block bg-white overflow-hidden shadow-2xl transform hover:scale-105 transition duration-300 border-solid border-3 border-black rounded-lg"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {publisher.image_background ? (
                    <img
                      src={publisher.image_background || "/placeholder.svg"}
                      alt={publisher.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl text-gray-400">🏢</div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{publisher.name}</h2>
                  <p className="text-sm text-gray-600">{publisher.games_count} juegos publicados</p>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Paginación */}
        {publishers.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  )
}

export default Publishers

