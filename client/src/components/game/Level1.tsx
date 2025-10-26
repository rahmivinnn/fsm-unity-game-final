import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Box, Sphere, Cylinder } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { useEnergyQuest, GameState } from "@/lib/stores/useEnergyQuest";
import { GameUI } from "./GameUI";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/lib/stores/useAudio";

function EnergyKey({ position, onCollect }: { position: [number, number, number], onCollect?: () => void }) {
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
      if (onCollect) onCollect();
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

function Level1Scene({ onMessage }: { onMessage: (msg: string, type: "info" | "success" | "error") => void }) {
  const [cableConnected, setCableConnected] = useState(false);
  const [tvStep, setTvStep] = useState(0);
  const [showKey1, setShowKey1] = useState(false);
  const [showKey2, setShowKey2] = useState(false);
  
  const { setLevel1CableSolved, setLevel1TVSolved, keysCollected, changeState } = useEnergyQuest();
  const { playSuccess } = useAudio();

  useEffect(() => {
    onMessage("Perbaiki rangkaian listrik yang berantakan", "info");
  }, [onMessage]);
  
  const cableRef = useRef<THREE.Mesh>(null);
  const isDragging = useRef(false);
  const { camera, gl } = useThree();

  useEffect(() => {
    if (keysCollected >= 2) {
      setTimeout(() => {
        onMessage("Level 1 Selesai! Menuju Dapur...", "success");
        setTimeout(() => changeState(GameState.Level2), 2000);
      }, 1000);
    }
  }, [keysCollected, changeState, onMessage]);

  const handleCableClick = () => {
    if (!cableConnected) {
      setCableConnected(true);
      setLevel1CableSolved(true);
      onMessage("Listrik mengalir dalam rangkaian tertutup!", "success");
      playSuccess();
      setShowKey1(true);
      console.log("[Level 1] Cable puzzle solved!");
    }
  };

  const handleTVClick = () => {
    const nextStep = tvStep + 1;
    setTvStep(nextStep);
    
    const steps = [
      "Colok kabel TV...",
      "Nyalakan saklar utama...",
      "Tekan tombol power...",
      "Atur channel..."
    ];
    
    if (nextStep < 4) {
      onMessage(steps[nextStep - 1], "info");
    } else if (nextStep === 4) {
      setLevel1TVSolved(true);
      onMessage("TV menyala! Rekaman Profesor: 'Carilah kunci energi!'", "success");
      playSuccess();
      setShowKey2(true);
      console.log("[Level 1] TV puzzle solved!");
    }
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[0, 3, 0]} intensity={cableConnected ? 1 : 0} color="yellow" />

      <Box position={[0, -1, 0]} args={[20, 0.2, 20]}>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>

      <Box position={[-3, 0, 0]} args={[0.8, 1.2, 0.4]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <mesh position={[-3, 0.8, 0.3]}>
        <boxGeometry args={[0.3, 0.3, 0.1]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh position={[-3, -0.8, 0.3]}>
        <boxGeometry args={[0.3, 0.3, 0.1]} />
        <meshStandardMaterial color="black" />
      </mesh>

      <Box position={[0, 0, 0]} args={[0.5, 0.5, 0.5]} onClick={handleCableClick}>
        <meshStandardMaterial color={cableConnected ? "#4ade80" : "#ef4444"} />
      </Box>

      <Sphere 
        position={[3, 0, 0]} 
        args={[0.5, 32, 32]}
      >
        <meshStandardMaterial 
          color="white" 
          emissive={cableConnected ? "yellow" : "black"} 
          emissiveIntensity={cableConnected ? 1 : 0} 
        />
      </Sphere>

      <Box position={[0, 0, -3]} args={[1.5, 1, 0.5]} onClick={handleTVClick}>
        <meshStandardMaterial color={tvStep >= 4 ? "#1e40af" : "#1a1a1a"} />
      </Box>

      {showKey1 && <EnergyKey position={[3, 1.5, 0]} />}
      {showKey2 && <EnergyKey position={[0, 1.5, -3]} />}

      <OrbitControls 
        enablePan={false} 
        minDistance={5} 
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export function Level1() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "success" | "error">("info");
  const { keysCollected } = useEnergyQuest();

  return (
    <div className="fixed inset-0 bg-black">
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <Level1Scene onMessage={(msg, type) => { setMessage(msg); setMessageType(type); }} />
      </Canvas>
      
      <GameUI 
        message={message}
        messageType={messageType}
        keysCollected={keysCollected}
      />
      
      <div className="fixed bottom-4 right-4 bg-gray-800/90 p-4 rounded-lg text-white text-sm max-w-xs">
        <h3 className="font-bold mb-2">Level 1: Ruang Tamu</h3>
        <p className="text-xs text-gray-300">
          • Klik saklar untuk hubungkan kabel<br/>
          • Klik TV 4x untuk menyalakannya<br/>
          • Kumpulkan 2 kunci energi
        </p>
      </div>
    </div>
  );
}
