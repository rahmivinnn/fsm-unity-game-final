import { useEnergyQuest, GameState } from "@/lib/stores/useEnergyQuest";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function MainMenu() {
  const { changeState, resetProgress, loadProgress, keysCollected } = useEnergyQuest();
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleStart = () => {
    resetProgress();
    changeState(GameState.Level1);
  };

  const handleContinue = () => {
    loadProgress();
    changeState(GameState.Level1);
  };

  if (showSettings) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full mx-4">
          <h2 className="text-white text-2xl font-bold mb-4">Pengaturan</h2>
          <p className="text-gray-300 mb-4">Kontrol Suara & Musik</p>
          <p className="text-gray-400 text-sm mb-6">
            Gunakan speaker/headphone untuk pengalaman terbaik.
          </p>
          <Button onClick={() => setShowSettings(false)} className="w-full">
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  if (showAbout) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full mx-4">
          <h2 className="text-white text-2xl font-bold mb-4">Tentang Game</h2>
          <p className="text-gray-300 mb-4">
            <strong>Energy Quest: Misteri Hemat Listrik</strong>
          </p>
          <p className="text-gray-400 text-sm mb-4">
            Game edukasi puzzle adventure untuk siswa SMP tentang efisiensi energi listrik.
            Pecahkan puzzle di 4 level berbeda dan temukan Profesor Teguh!
          </p>
          <p className="text-yellow-400 text-sm mb-6">
            ⚡ Kumpulkan 3 Kunci Energi untuk membuka level final!
          </p>
          <Button onClick={() => setShowAbout(false)} className="w-full">
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex items-center justify-center z-50">
      <div className="text-center px-4">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          ENERGY QUEST
        </h1>
        <p className="text-yellow-400 text-xl md:text-2xl mb-8 drop-shadow-md">
          Misteri Hemat Listrik
        </p>
        
        {keysCollected > 0 && (
          <div className="mb-6 text-green-400 text-lg">
            ⚡ {keysCollected}/3 Kunci Energi Terkumpul
          </div>
        )}
        
        <div className="flex flex-col gap-4 max-w-xs mx-auto">
          <Button 
            onClick={handleStart}
            className="bg-green-600 hover:bg-green-700 text-white text-xl py-6"
          >
            Mulai Permainan Baru
          </Button>
          
          {keysCollected > 0 && (
            <Button 
              onClick={handleContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xl py-6"
            >
              Lanjutkan
            </Button>
          )}
          
          <Button 
            onClick={() => setShowSettings(true)}
            variant="outline"
            className="text-lg py-6"
          >
            Pengaturan
          </Button>
          
          <Button 
            onClick={() => setShowAbout(true)}
            variant="outline"
            className="text-lg py-6"
          >
            Tentang
          </Button>
        </div>
      </div>
    </div>
  );
}
