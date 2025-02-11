import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-green-400 to-amber-300 py-6 shadow-lg border-b-4 border-green-400">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
          Videojuegos Moya
        </h1>
        <nav className="flex space-x-8">
          {/* <Link to="/" className="text-white text-lg hover:text-gray-300">
            Inicio
          </Link> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
