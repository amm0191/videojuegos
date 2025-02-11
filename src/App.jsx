import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import GameDetails from "./pages/GamesDetails";




const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/:id" element={<GameDetails />} />
        {/* Para meter fav lo pondria aqui */}
      </Routes>
    </Router>
  );
};

export default App;
