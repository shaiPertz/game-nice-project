import { useState } from 'react';
import type { GameConfig } from './game/gameMode';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';

type Screen = 'home' | 'game';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [config, setConfig] = useState<GameConfig | null>(null);

  const startGame = (gameConfig: GameConfig) => {
    setConfig(gameConfig);
    setScreen('game');
  };

  const goHome = () => setScreen('home');

  if (screen === 'game' && config) {
    return <GameScreen config={config} onExit={goHome} />;
  }

  return <HomeScreen onStart={startGame} initialConfig={config} />;
}

export default App;
