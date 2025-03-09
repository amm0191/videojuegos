import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Home from "./pages/Home"
import GameDetails from "./pages/GamesDetails"
import TagGames from "./pages/TagGames"
import GenreGames from "./pages/GenreGames"
import Publishers from "./pages/Publishers"
import PublisherDetails from "./pages/PublisherDetails"
import Header from "./components/Header"
import Footer from "./components/Footer"

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/games/:id" element={<GameDetails />} />
        <Route path="/tags/:id" element={<TagGames />} />
        <Route path="/genres/:id" element={<GenreGames />} />
        <Route path="/publishers" element={<Publishers />} />
        <Route path="/publishers/:id" element={<PublisherDetails />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App

