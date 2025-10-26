import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import { useEnergyQuest, GameState } from "@/lib/stores/useEnergyQuest";
import { GameUI } from "./GameUI";
import { useAudio } from "@/lib/stores/useAudio";
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

function Level2Scene({ onMessage, onPowerUpdate }: { onMessage: (msg: string, type: "info" | "success" | "error") => void, onPowerUpdate: (power: number) => void }) {
  const [lampOn, setLampOn] = useState(true);
  const [fridgeOpen, setFridgeOpen] = useState(false);
  const [cookerMode, setCookerMode] = useState("high");
  const [fanOn, setFanOn] = useState(false);
  const [ironOn, setIronOn] = useState(false);
  
  const [showKey, setShowKey] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const { setLevel2Efficiency, keysCollected, changeState } = useEnergyQuest();
  const { playSuccess, playHit } = useAudio();

  useEffect(() => {
    onMessage("Gunakan energi dengan bijak!", "info");
  }, [onMessage]);

  useEffect(() => {
    let level = 0;
    if (lampOn) level += 20;
    if (fridgeOpen) level += 30;
    if (cookerMode === "high") level += 25;
    if (fanOn) level += 15;
    if (ironOn) level += 25;
    
    onPowerUpdate(level);
    setLevel2Efficiency(level);

    if (level <= 40 && !completed) {
      setCompleted(true);
      onMessage("Efisien! Energi hemat! Ambil kunci energi!", "success");
      playSuccess();
      setShowKey(true);
    } else if (level > 40) {
      if (completed) {
        setCompleted(false);
        setShowKey(false);
      }
      if (level > 70) {
        onMessage("Terlalu boros! Matikan peralatan yang tidak perlu!", "error");
      }
    }
  }, [lampOn, fridgeOpen, cookerMode, fanOn, ironOn, completed, playSuccess, setLevel2Efficiency, onMessage, onPowerUpdate]);

  const toggleLamp = () => {
    setLampOn(!lampOn);
    onMessage(lampOn ? "Lampu dimatikan - gunakan cahaya alami!" : "Lampu dinyalakan", "info");
  };

  const toggleFridge = () => {
    if (!fridgeOpen) {
      setFridgeOpen(true);
      onMessage("Kulkas terbuka - tutup dengan cepat!", "error");
      playHit();
      setTimeout(() => {
        setFridgeOpen(false);
        onMessage("Kulkas tertutup - baik!", "success");
      }, 3000);
    }
  };

  const toggleCooker = () => {
    const newMode = cookerMode === "high" ? "eco" : "high";
    setCookerMode(newMode);
    onMessage(newMode === "eco" ? "Mode hemat aktif!" : "Mode normal aktif", newMode === "eco" ? "success" : "info");
  };

  const toggleFan = () => {
    setFanOn(!fanOn);
    onMessage(fanOn ? "Kipas dimatikan" : "Kipas dinyalakan", "info");
  };

  const toggleIron = () => {
    setIronOn(!ironOn);
    onMessage(ironOn ? "Setrika dimatikan - hemat!" : "Setrika dinyalakan", ironOn ? "success" : "info");
  };

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={lampOn ? 1 : 0.3} />

      <Box position={[0, -1, 0]} args={[20, 0.2, 20]}>
        <meshStandardMaterial color="#4a4a4a" />
      </Box>

      <Box position={[-4, 0, 0]} args={[0.5, 1, 0.5]} onClick={toggleLamp}>
        <meshStandardMaterial 
          color={lampOn ? "yellow" : "gray"} 
          emissive={lampOn ? "yellow" : "black"}
          emissiveIntensity={lampOn ? 1 : 0}
        />
      </Box>

      <Box position={[-2, 0, 0]} args={[1, 2, 1]} onClick={toggleFridge}>
        <meshStandardMaterial color={fridgeOpen ? "#ff6b6b" : "#e0e0e0"} />
      </Box>

      <Box position={[0, 0, 0]} args={[0.8, 0.5, 0.8]} onClick={toggleCooker}>
        <meshStandardMaterial color={cookerMode === "eco" ? "#4ade80" : "#fbbf24"} />
      </Box>

      <Box position={[2, 0, 0]} args={[0.6, 1.2, 0.6]} onClick={toggleFan}>
        <meshStandardMaterial 
          color={fanOn ? "#60a5fa" : "#9ca3af"}
          emissive={fanOn ? "#3b82f6" : "black"}
          emissiveIntensity={fanOn ? 0.5 : 0}
        />
      </Box>

      <Box position={[4, 0, 0]} args={[0.4, 0.8, 0.4]} onClick={toggleIron}>
        <meshStandardMaterial 
          color={ironOn ? "#ef4444" : "#6b7280"}
          emissive={ironOn ? "#dc2626" : "black"}
          emissiveIntensity={ironOn ? 0.7 : 0}
        />
      </Box>

      {showKey && <EnergyKey position={[0, 2, 0]} onCollect={() => {
        setTimeout(() => {
          onMessage("Level 2 Selesai! Menuju Laboratorium...", "success");
          setTimeout(() => changeState(GameState.Level3), 2000);
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

export function Level2() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "success" | "error">("info");
  const [powerLevel, setPowerLevel] = useState(100);
  const { keysCollected } = useEnergyQuest();

  return (
    <div className="fixed inset-0 bg-black">
      <Canvas camera={{ position: [0, 5, 12], fov: 60 }}>
        <Level2Scene onMessage={(msg, type) => { setMessage(msg); setMessageType(type); }} onPowerUpdate={setPowerLevel} />
      </Canvas>
      
      <GameUI 
        message={message}
        messageType={messageType}
        keysCollected={keysCollected}
        showPowerMeter={true}
        powerLevel={powerLevel}
      />
      
      <div className="fixed bottom-4 right-4 bg-gray-800/90 p-4 rounded-lg text-white text-sm max-w-xs">
        <h3 className="font-bold mb-2">Level 2: Dapur</h3>
        <p className="text-xs text-gray-300">
          • Matikan lampu (cahaya alami)<br/>
          • Tutup kulkas cepat<br/>
          • Mode hemat rice cooker<br/>
          • Matikan fan & setrika<br/>
          • Target: Efisiensi ≤ 40%
        </p>
      </div>
    </div>
  );
}
