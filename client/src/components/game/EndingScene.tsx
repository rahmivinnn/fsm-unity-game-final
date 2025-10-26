import { useEffect, useState } from "react";
import { useEnergyQuest, GameState } from "@/lib/stores/useEnergyQuest";
import { Button } from "@/components/ui/button";

export function EndingScene() {
  const [step, setStep] = useState(0);
  const changeState = useEnergyQuest((state) => state.changeState);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 3000),
      setTimeout(() => setStep(2), 6000),
      setTimeout(() => setStep(3), 9000)
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const messages = [
    "Pintu bawah tanah terbuka dengan cahaya terang...",
    "Profesor Teguh: 'Selamat! Kamu telah lulus ujian hemat energi!'",
    "Profesor Teguh: 'Gunakan pengetahuan ini untuk menjadi generasi yang bijak menggunakan energi listrik.'",
    "Misteri terpecahkan! Kamu adalah pahlawan hemat energi!"
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-yellow-900 via-green-900 to-black flex items-center justify-center z-50">
      <div className="max-w-3xl mx-auto px-8 text-center">
        <div className="animate-fade-in mb-8">
          {step < messages.length && (
            <p className="text-white text-2xl md:text-3xl font-bold leading-relaxed drop-shadow-lg mb-4">
              {messages[step]}
            </p>
          )}
        </div>
        
        {step >= 3 && (
          <div className="mt-8">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-green-400 text-xl mb-8">
              Selamat! Kamu telah menyelesaikan Energy Quest!
            </p>
            <Button 
              onClick={() => changeState(GameState.MainMenu)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-8 py-6"
            >
              Kembali ke Menu
            </Button>
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
