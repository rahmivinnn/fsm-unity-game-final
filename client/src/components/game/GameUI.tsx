import { useState, useEffect } from "react";

interface GameUIProps {
  message?: string;
  messageType?: "info" | "success" | "error";
  keysCollected?: number;
  showPowerMeter?: boolean;
  powerLevel?: number;
  showBillMeter?: boolean;
  billAmount?: number;
}

export function GameUI({
  message,
  messageType = "info",
  keysCollected = 0,
  showPowerMeter = false,
  powerLevel = 100,
  showBillMeter = false,
  billAmount = 0
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
    info: "bg-blue-600/90 text-white",
    success: "bg-green-600/90 text-white",
    error: "bg-red-600/90 text-white"
  };

  const powerColor = powerLevel > 70 ? "bg-red-500" : powerLevel > 40 ? "bg-yellow-500" : "bg-green-500";
  const billColor = billAmount <= 300000 ? "bg-green-500" : "bg-red-500";

  return (
    <>
      {displayMessage && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg ${messageColors[messageType]} z-50 text-center max-w-md shadow-lg`}>
          <p className="text-lg font-bold">{displayMessage}</p>
        </div>
      )}

      {keysCollected > 0 && (
        <div className="fixed top-4 right-4 bg-yellow-500/90 px-4 py-2 rounded-lg z-50 shadow-lg">
          <p className="text-white font-bold">⚡ {keysCollected}/3 Kunci</p>
        </div>
      )}

      {showPowerMeter && (
        <div className="fixed bottom-4 left-4 bg-gray-800/90 px-6 py-4 rounded-lg z-50 shadow-lg">
          <p className="text-white text-sm mb-2 font-bold">Efisiensi Energi</p>
          <div className="w-48 h-4 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${powerColor} transition-all duration-300`}
              style={{ width: `${Math.min(100, powerLevel)}%` }}
            />
          </div>
          <p className="text-white text-xs mt-1">
            {powerLevel > 70 ? "Boros!" : powerLevel > 40 ? "Sedang" : "Efisien!"}
          </p>
        </div>
      )}

      {showBillMeter && (
        <div className="fixed bottom-4 left-4 bg-gray-800/90 px-6 py-4 rounded-lg z-50 shadow-lg">
          <p className="text-white text-sm mb-2 font-bold">Tagihan Listrik</p>
          <div className="w-48 h-4 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${billColor} transition-all duration-300`}
              style={{ width: `${Math.min(100, (billAmount / 500000) * 100)}%` }}
            />
          </div>
          <p className="text-white text-lg font-bold mt-2">Rp {billAmount.toLocaleString('id-ID')}</p>
          <p className="text-gray-300 text-xs">Target: ≤ Rp 300.000</p>
        </div>
      )}
    </>
  );
}
