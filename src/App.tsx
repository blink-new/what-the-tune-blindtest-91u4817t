import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Results from './pages/Results';
import { GameProvider } from './contexts/GameContext';

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lobby/:roomId" element={<Lobby />} />
            <Route path="/game/:roomId" element={<Game />} />
            <Route path="/results/:roomId" element={<Results />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;