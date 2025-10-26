import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, useTexture } from "@react-three/drei";
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
      <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.8} metalness={0.5} roughness={0.3} />
    </mesh>
  );
}

function TileFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#d4d4d4" />
    </mesh>
  );
}

function CeilingLight({ position, isOn }: { position: [number, number, number], isOn: boolean }) {
  return (
    <group position={position}>
      <Box args={[1.2, 0.1, 1.2]} castShadow>
        <meshStandardMaterial color="#4a4a4a" />
      </Box>
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial 
          color={isOn ? "#ffffff" : "#6a6a6a"} 
          emissive={isOn ? "#ffffff" : "#000000"}
          emissiveIntensity={isOn ? 1 : 0}
        />
      </mesh>
      {isOn && <pointLight position={[0, -0.5, 0]} intensity={3} distance={12} color="white" castShadow />}
    </group>
  );
}

function Refrigerator({ position, onClick, isOpen }: { position: [number, number, number], onClick: () => void, isOpen: boolean }) {
  return (
    <group position={position} onClick={onClick}>
      <Box args={[1.8, 3, 1.5]} castShadow receiveShadow>
        <meshStandardMaterial color={isOpen ? "#ff6b6b" : "#e8e8e8"} metalness={0.5} roughness={0.3} />
      </Box>
      <Box position={[0, 0.8, 0.76]} args={[0.15, 0.4, 0.05]} castShadow>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>
      <Box position={[0, -0.8, 0.76]} args={[0.15, 0.4, 0.05]} castShadow>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>
      {isOpen && (
        <Box position={[0, 0, 0.8]} args={[1.6, 2.8, 0.1]} castShadow>
          <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.3} />
        </Box>
      )}
    </group>
  );
}

function RiceCooker({ position, onClick, mode }: { position: [number, number, number], onClick: () => void, mode: string }) {
  const isEco = mode === "eco";
  
  return (
    <group position={position} onClick={onClick}>
      <mesh>
        <cylinderGeometry args={[0.5, 0.6, 0.8, 32]} />
        <meshStandardMaterial color="#e8e8e8" metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.1, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.3, 0.2, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color={isEco ? "#22c55e" : "#fbbf24"} 
          emissive={isEco ? "#22c55e" : "#fbbf24"}
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

function Fan({ position, onClick, isOn }: { position: [number, number, number], onClick: () => void, isOn: boolean }) {
  const fanRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (isOn && fanRef.current) {
      const interval = setInterval(() => {
        if (fanRef.current) {
          fanRef.current.rotation.z += 0.2;
        }
      }, 16);
      return () => clearInterval(interval);
    }
  }, [isOn]);

  return (
    <group position={position} onClick={onClick}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1.5, 16]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      
      <group ref={fanRef} position={[0, 2.3, 0]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
          <meshStandardMaterial 
            color={isOn ? "#60a5fa" : "#9ca3af"}
            emissive={isOn ? "#3b82f6" : "#000000"}
            emissiveIntensity={isOn ? 0.5 : 0}
          />
        </mesh>
        
        {[0, 120, 240].map((angle, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((angle * Math.PI) / 180) * 0.5,
              0,
              Math.sin((angle * Math.PI) / 180) * 0.5
            ]}
            rotation={[0, (angle * Math.PI) / 180, 0]}
          >
            <boxGeometry args={[0.8, 0.05, 0.2]} />
            <meshStandardMaterial color={isOn ? "#3b82f6" : "#6b7280"} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Iron({ position, onClick, isOn }: { position: [number, number, number], onClick: () => void, isOn: boolean }) {
  return (
    <group position={position} onClick={onClick}>
      <mesh rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.8, 0.3, 1.2]} />
        <meshStandardMaterial 
          color={isOn ? "#dc2626" : "#6b7280"}
          emissive={isOn ? "#dc2626" : "#000000"}
          emissiveIntensity={isOn ? 0.7 : 0}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

function KitchenCounter({ position }: { position: [number, number, number] }) {
  const texture = useTexture("/textures/wood.jpg");
  
  return (
    <group position={position}>
      <Box args={[8, 1.5, 1.5]} castShadow receiveShadow>
        <meshStandardMaterial map={texture} />
      </Box>
      <Box position={[0, 0.85, 0]} args={[8.2, 0.1, 1.7]} castShadow receiveShadow>
        <meshStandardMaterial color="#5a5a5a" />
      </Box>
    </group>
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
      <ambientLight intensity={lampOn ? 0.6 : 0.3} />
      <directionalLight 
        position={[8, 10, 5]} 
        intensity={lampOn ? 1.2 : 0.6} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <TileFloor />

      <Box position={[0, 2, -8]} args={[30, 10, 0.2]} receiveShadow>
        <meshStandardMaterial color="#e8e8d8" />
      </Box>
      <Box position={[-8, 2, 0]} args={[0.2, 10, 30]} receiveShadow>
        <meshStandardMaterial color="#e8e8d8" />
      </Box>
      <Box position={[8, 2, 0]} args={[0.2, 10, 30]} receiveShadow>
        <meshStandardMaterial color="#e8e8d8" />
      </Box>

      <CeilingLight position={[0, 5, 0]} isOn={lampOn} />
      <group onClick={toggleLamp}>
        <Box position={[-6, 2, -7]} args={[0.3, 0.6, 0.2]} castShadow>
          <meshStandardMaterial color="#f3f4f6" />
        </Box>
        <Box position={[-6, lampOn ? 2.15 : 1.85, -6.9]} args={[0.15, 0.3, 0.1]} castShadow>
          <meshStandardMaterial color={lampOn ? "#22c55e" : "#ef4444"} />
        </Box>
      </group>

      <KitchenCounter position={[0, 0.75, -6]} />

      <Refrigerator position={[-5, 1.5, -6]} onClick={toggleFridge} isOpen={fridgeOpen} />
      
      <RiceCooker position={[-1.5, 2.3, -6]} onClick={toggleCooker} mode={cookerMode} />
      
      <Fan position={[2, 0, -5]} onClick={toggleFan} isOn={fanOn} />
      
      <Iron position={[5, 2.2, -6]} onClick={toggleIron} isOn={ironOn} />

      {showKey && <EnergyKey position={[0, 3, 0]} onCollect={() => {
        setTimeout(() => {
          onMessage("Level 2 Selesai! Menuju Laboratorium...", "success");
          setTimeout(() => changeState(GameState.Level3), 2000);
        }, 500);
      }} />}

      <OrbitControls 
        enablePan={false} 
        minDistance={8} 
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 1, 0]}
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
      <Canvas 
        camera={{ position: [0, 6, 12], fov: 60 }}
        shadows
      >
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
          • Klik saklar untuk matikan lampu<br/>
          • Klik kulkas (tutup cepat)<br/>
          • Klik rice cooker untuk mode hemat<br/>
          • Klik fan & setrika untuk OFF<br/>
          • Target: Efisiensi ≤ 40%
        </p>
      </div>
    </div>
  );
}
