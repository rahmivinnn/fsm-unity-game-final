import { useEffect, useState } from "react";
import { useEnergyQuest, GameState } from "@/lib/stores/useEnergyQuest";

export function OpeningScene() {
  const [step, setStep] = useState(0);
  const changeState = useEnergyQuest((state) => state.changeState);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 3000),
      setTimeout(() => setStep(2), 6000),
      setTimeout(() => setStep(3), 9000),
      setTimeout(() => setStep(4), 12000),
      setTimeout(() => changeState(GameState.MainMenu), 15000)
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [changeState]);

  const messages = [
    "Malam yang gelap menyelimuti kota...",
    "Berita: Profesor Teguh, ahli listrik terkenal, telah menghilang secara misterius.",
    "Petunjuk terakhir mengarah ke rumah pintarnya yang gelap dan sunyi.",
    "Kamu, seorang siswa SMP yang penasaran, memutuskan untuk menyelidiki...",
    "ENERGY QUEST: Misteri Hemat Listrik"
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-blue-900 to-black flex items-center justify-center z-50">
      <div className="max-w-3xl mx-auto px-8 text-center">
        <div className="animate-fade-in">
          {step < messages.length && (
            <p className="text-white text-2xl md:text-4xl font-bold leading-relaxed drop-shadow-lg">
              {messages[step]}
            </p>
          )}
        </div>
        
        {step === 4 && (
          <div className="mt-8 animate-pulse">
            <div className="text-yellow-400 text-xl">⚡</div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}
