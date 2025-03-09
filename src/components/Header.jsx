import { Link, useLocation } from "react-router-dom"

const Header = () => {
  const location = useLocation()
  const isLandingPage = location.pathname === "/landing"

  // Don't show header on landing page
  if (isLandingPage) {
    return null
  }

  return (
    <header className="bg-gradient-to-r from-green-400 to-amber-300 py-6 shadow-lg border-b-4 border-green-400">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/landing" className="text-3xl font-extrabold text-white drop-shadow-lg">
          Videojuegos Moya
        </Link>
        <nav className="flex space-x-8">
          <Link to="/" className="text-white text-lg hover:text-gray-300">
            Juegos
          </Link>
          <Link to="/publishers" className="text-white text-lg hover:text-gray-300">
            Publishers
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header

