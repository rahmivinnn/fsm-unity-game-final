import { useEffect } from "react";
import { useEnergyQuest, GameState } from "./lib/stores/useEnergyQuest";
import { useAudio } from "./lib/stores/useAudio";
import { OpeningScene } from "./components/game/OpeningScene";
import { MainMenu } from "./components/game/MainMenu";
import { EndingScene } from "./components/game/EndingScene";
import { Level1 } from "./components/game/Level1";
import { Level2 } from "./components/game/Level2";
import { Level3 } from "./components/game/Level3";
import { Level4 } from "./components/game/Level4";
import "@fontsource/inter";

function App() {
  const gameState = useEnergyQuest((state) => state.gameState);
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    const hit = new Audio("/sounds/hit.mp3");
    hit.volume = 0.5;
    setHitSound(hit);

    const success = new Audio("/sounds/success.mp3");
    success.volume = 0.6;
    setSuccessSound(success);

    bgMusic.play().catch(err => console.log("Audio autoplay prevented:", err));

    return () => {
      bgMusic.pause();
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  useEffect(() => {
    const handleOrientation = () => {
      if (window.innerHeight > window.innerWidth) {
        const orientationMessage = document.createElement('div');
        orientationMessage.id = 'orientation-warning';
        orientationMessage.style.cssText = `
          position: fixed;
          inset: 0;
          background: black;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          text-align: center;
          z-index: 9999;
          padding: 20px;
        `;
        orientationMessage.innerHTML = '📱<br/>Putar perangkat Anda ke mode landscape<br/>untuk pengalaman terbaik!';
        
        if (!document.getElementById('orientation-warning')) {
          document.body.appendChild(orientationMessage);
        }
      } else {
        const warning = document.getElementById('orientation-warning');
        if (warning) warning.remove();
      }
    };

    handleOrientation();
    window.addEventListener('resize', handleOrientation);
    window.addEventListener('orientationchange', handleOrientation);

    return () => {
      window.removeEventListener('resize', handleOrientation);
      window.removeEventListener('orientationchange', handleOrientation);
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#000' }}>
      {gameState === GameState.OpeningScene && <OpeningScene />}
      {gameState === GameState.MainMenu && <MainMenu />}
      {gameState === GameState.Level1 && <Level1 />}
      {gameState === GameState.Level2 && <Level2 />}
      {gameState === GameState.Level3 && <Level3 />}
      {gameState === GameState.Level4 && <Level4 />}
      {gameState === GameState.EndingScene && <EndingScene />}
    </div>
  );
}

export default App;
