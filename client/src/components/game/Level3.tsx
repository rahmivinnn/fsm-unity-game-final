import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import { useEnergyQuest, GameState } from "@/lib/stores/useEnergyQuest";
import { GameUI } from "./GameUI";
import { useAudio } from "@/lib/stores/useAudio";
import { calculateKWh, calculateBill } from "@/lib/utils/fisherYates";
import * as THREE from "three";

function EnergyKey({ position, onCollect }: { position: [number, number, number], onCollect: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { addKey } = useEnergyQuest();
  const [collected, setCollected] = useState(false);

  useEffect(() => {
    const animate = () => {
      if (meshRef.current && !collected) {
        meshRef.current.rotation.y += 0.02;
        meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003) * 0.2;
      }
    };
    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [collected, position]);

  const handleClick = () => {
    if (!collected) {
      setCollected(true);
      addKey();
      onCollect();
      console.log("[Energy Key] Collected!");
    }
  };

  if (collected) return null;

  return (
    <mesh ref={meshRef} position={position} onClick={handleClick}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.5} />
    </mesh>
  );
}

interface Device {
  name: string;
  power: number;
  hours: number;
  active: boolean;
}

function Level3Scene({ onMessage, onBillUpdate }: { onMessage: (msg: string, type: "info" | "success" | "error") => void, onBillUpdate: (bill: number) => void }) {
  const [devices, setDevices] = useState<Device[]>([
    { name: "Lampu", power: 60, hours: 24, active: true },
    { name: "AC", power: 1000, hours: 8, active: true },
    { name: "TV", power: 150, hours: 6, active: true },
    { name: "Kulkas", power: 150, hours: 24, active: true }
  ]);
  
  const [showKey, setShowKey] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const { setLevel3Bill, keysCollected, changeState } = useEnergyQuest();
  const { playSuccess, playHit } = useAudio();

  useEffect(() => {
    onMessage("Atur penggunaan agar tagihan ≤ Rp 300.000", "info");
  }, [onMessage]);

  useEffect(() => {
    let total = 0;
    devices.forEach(device => {
      if (device.active) {
        const kWh = calculateKWh(device.power, device.hours);
        total += calculateBill(kWh);
      }
    });
    
    const roundedTotal = Math.round(total);
    onBillUpdate(roundedTotal);
    setLevel3Bill(roundedTotal);

    if (total <= 300000 && !completed) {
      setCompleted(true);
      onMessage("Efisien! Tagihan ≤ Rp 300.000! Ambil kunci energi!", "success");
      playSuccess();
      setShowKey(true);
    } else if (total > 300000) {
      if (completed) {
        setCompleted(false);
        setShowKey(false);
      }
      onMessage("Boros! Matikan perangkat yang tidak perlu!", "error");
    }
  }, [devices, completed, playSuccess, setLevel3Bill, onMessage, onBillUpdate]);

  const toggleDevice = (index: number) => {
    setDevices(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], active: !updated[index].active };
      return updated;
    });
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <Box position={[0, -1, 0]} args={[20, 0.2, 20]}>
        <meshStandardMaterial color="#2a2a2a" />
      </Box>

      {devices.map((device, index) => (
        <Box 
          key={device.name}
          position={[-4 + index * 2.5, 0, 0]} 
          args={[1, 1.5, 0.8]}
          onClick={() => toggleDevice(index)}
        >
          <meshStandardMaterial 
            color={device.active ? "#4ade80" : "#6b7280"}
            emissive={device.active ? "#22c55e" : "black"}
            emissiveIntensity={device.active ? 0.5 : 0}
          />
        </Box>
      ))}

      {showKey && <EnergyKey position={[0, 2, -3]} onCollect={() => {
        setTimeout(() => {
          onMessage("Level 3 Selesai! Menuju Ruang Bawah Tanah...", "success");
          setTimeout(() => changeState(GameState.Level4), 2000);
        }, 500);
      }} />}

      <OrbitControls 
        enablePan={false} 
        minDistance={5} 
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export function Level3() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "success" | "error">("info");
  const [totalBill, setTotalBill] = useState(0);
  const { keysCollected } = useEnergyQuest();

  return (
    <div className="fixed inset-0 bg-black">
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <Level3Scene onMessage={(msg, type) => { setMessage(msg); setMessageType(type); }} onBillUpdate={setTotalBill} />
      </Canvas>
      
      <GameUI 
        message={message}
        messageType={messageType}
        keysCollected={keysCollected}
        showBillMeter={true}
        billAmount={totalBill}
      />
      
      <div className="fixed bottom-4 right-4 bg-gray-800/90 p-4 rounded-lg text-white text-sm max-w-xs">
        <h3 className="font-bold mb-2">Level 3: Laboratorium</h3>
        <p className="text-xs text-gray-300 mb-2">
          Klik perangkat untuk ON/OFF:<br/>
          • Lampu: 60W × 24h<br/>
          • AC: 1000W × 8h<br/>
          • TV: 150W × 6h<br/>
          • Kulkas: 150W × 24h
        </p>
        <p className="text-yellow-400 text-xs font-bold">
          Target: ≤ Rp 300.000
        </p>
      </div>
    </div>
  );
}
