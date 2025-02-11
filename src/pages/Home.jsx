import Header from "../components/Header";
import Footer from "../components/Footer";
// import Carousel from "../components/Carrusel";
import Games from "../pages/Games";

const Home = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen">
      {/* Header */}
      <Header />

      {/* Carrusel de Juegos */}
      {/* <Carrusel /> */}

      {/* Lista de Juegos */}
      <Games />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
