import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

interface GameUIProps {
  message?: string;
  messageType?: "info" | "success" | "error";
  keysCollected?: number;
  showPowerMeter?: boolean;
  powerLevel?: number;
  showBillMeter?: boolean;
  billAmount?: number;
  tasks?: string[];
  currentTaskIndex?: number;
}

export function GameUI({
  message,
  messageType = "info",
  keysCollected = 0,
  showPowerMeter = false,
  powerLevel = 100,
  showBillMeter = false,
  billAmount = 0,
  tasks = [],
  currentTaskIndex = -1
}: GameUIProps) {
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      const timer = setTimeout(() => setDisplayMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const messageColors = {
    info: "bg-black/80 text-white border border-gray-700",
    success: "bg-green-900/90 text-white border border-green-700",
    error: "bg-red-900/90 text-white border border-red-700"
  };

  const powerColor = powerLevel > 70 ? "bg-red-500" : powerLevel > 40 ? "bg-yellow-500" : "bg-green-500";
  const billColor = billAmount <= 300000 ? "bg-green-500" : "bg-red-500";

  return (
    <>
      {/* Narrative Overlay with Arial 24px white on semi-transparent black */}
      {displayMessage && (
        <div className="fixed top-0 left-0 right-0 bg-black/70 z-50 p-6">
          <p className="text-white font-sans text-2xl text-center max-w-3xl mx-auto">
            {displayMessage}
          </p>
        </div>
      )}

      {/* Keys Counter */}
      {keysCollected > 0 && (
        <div className="fixed top-6 right-6 bg-blue-900/90 px-5 py-3 rounded-xl z-50 shadow-xl border border-blue-700">
          <p className="text-white font-bold text-lg">⚡ {keysCollected}/3 Kunci</p>
        </div>
      )}

      {/* HUD Level Panel with dark rounded corners */}
      <div className="fixed bottom-6 right-6 bg-gray-900/95 px-5 py-4 rounded-xl z-50 shadow-xl border border-gray-700 max-w-xs">
        <h3 className="text-white font-bold text-lg mb-3">Tugas Level</h3>
        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li key={index} className="flex items-start">
              {index < currentTaskIndex ? (
                <Check className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
              ) : index === currentTaskIndex ? (
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2 mt-1 flex-shrink-0"></div>
              ) : (
                <div className="w-4 h-4 border-2 border-gray-500 rounded-full mr-2 mt-1 flex-shrink-0"></div>
              )}
              <span className={`text-sm ${index <= currentTaskIndex ? "text-white" : "text-gray-400"}`}>
                {task}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Educational Feedback with icons */}
      {messageType === "success" && displayMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-green-900/90 px-6 py-3 rounded-lg z-50 flex items-center border border-green-700">
          <Check className="text-green-400 mr-2" size={20} />
          <p className="text-white font-medium">{displayMessage}</p>
        </div>
      )}

      {messageType === "error" && displayMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-red-900/90 px-6 py-3 rounded-lg z-50 flex items-center border border-red-700">
          <X className="text-red-400 mr-2" size={20} />
          <p className="text-white font-medium">{displayMessage}</p>
        </div>
      )}

      {/* Power Meter */}
      {showPowerMeter && (
        <div className="fixed bottom-6 left-6 bg-gray-900/95 px-6 py-5 rounded-xl z-50 shadow-xl border border-gray-700 w-64">
          <p className="text-white text-sm mb-3 font-bold">Efisiensi Energi</p>
          <div className="w-full h-5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${powerColor} transition-all duration-500`}
              style={{ width: `${Math.min(100, powerLevel)}%` }}
            />
          </div>
          <p className="text-white text-sm mt-2">
            {powerLevel > 70 ? "Boros!" : powerLevel > 40 ? "Sedang" : "Efisien!"}
          </p>
        </div>
      )}

      {/* Bill Meter */}
      {showBillMeter && (
        <div className="fixed bottom-6 left-6 bg-gray-900/95 px-6 py-5 rounded-xl z-50 shadow-xl border border-gray-700 w-64">
          <p className="text-white text-sm mb-3 font-bold">Tagihan Listrik</p>
          <div className="w-full h-5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${billColor} transition-all duration-500`}
              style={{ width: `${Math.min(100, (billAmount / 500000) * 100)}%` }}
            />
          </div>
          <p className="text-white text-lg font-bold mt-2">Rp {billAmount.toLocaleString('id-ID')}</p>
          <p className="text-gray-300 text-xs mt-1">Target: ≤ Rp 300.000</p>
        </div>
      )}
    </>
  );
}