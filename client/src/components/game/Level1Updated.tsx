import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Box, useTexture } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { useEnergyQuest, GameState } from "@/lib/stores/useEnergyQuest";
import { GameUI } from "./GameUI";
import { useAudio } from "@/lib/stores/useAudio";
import { GLTFModel, MODEL_PATHS, checkCollision } from "./ModelLoader";

const FIXED_POSITIONS = {
  battery: [-2, 0, 0] as [number, number, number],
  switch: [0, 0, 0] as [number, number, number],
  lamp: [2, 0, 0] as [number, number, number],
  oldTV: [4, 0, 0] as [number, number, number],
  cable: [-1, 0, 0] as [number, number, number],
  character: [0, 0, 5] as [number, number, number],
};

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
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial 
        color="gold" 
        emissive="yellow" 
        emissiveIntensity={1.2} 
        metalness={0.8} 
        roughness={0.2} 
      />
      <pointLight intensity={1.5} distance={3} color="yellow" />
    </mesh>
  );
}

function WoodFloor() {
  const texture = useTexture("/textures/wood.jpg");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function BatteryFallback({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Box args={[0.6, 1, 0.4]} castShadow receiveShadow>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Box position={[0, 0.6, 0.15]} args={[0.5, 0.3, 0.1]} castShadow>
        <meshStandardMaterial color="#dc2626" />
      </Box>
      <Box position={[0, -0.6, 0.15]} args={[0.5, 0.3, 0.1]} castShadow>
        <meshStandardMaterial color="#3b82f6" />
      </Box>
      <mesh position={[0, 0.55, 0.25]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[0, -0.55, 0.25]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
    </group>
  );
}

function SwitchFallback({ position, onClick, connected }: { position: [number, number, number], onClick: () => void, connected: boolean }) {
  return (
    <group position={position} onClick={onClick}>
      <Box args={[0.5, 0.6, 0.2]} castShadow receiveShadow>
        <meshStandardMaterial color="#f3f4f6" />
      </Box>
      <Box position={[0, connected ? 0.1 : -0.1, 0.15]} args={[0.3, 0.2, 0.1]} castShadow>
        <meshStandardMaterial color={connected ? "#22c55e" : "#ef4444"} />
      </Box>
    </group>
  );
}

function LampFallback({ position, isOn }: { position: [number, number, number], isOn: boolean }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color="white" 
          emissive={isOn ? "yellow" : "black"} 
          emissiveIntensity={isOn ? 1 : 0}
        />
      </mesh>
      {isOn && <pointLight position={[0, 0, 0]} intensity={2} distance={8} color="yellow" castShadow />}
    </group>
  );
}

function OldTVFallback({ position, onClick, tvOn }: { position: [number, number, number], onClick: () => void, tvOn: boolean }) {
  return (
    <group position={position} onClick={onClick}>
      <Box args={[2, 1.2, 0.15]} castShadow receiveShadow>
        <meshStandardMaterial 
          color={tvOn ? "#1a3a5a" : "#0a0a0a"} 
          emissive={tvOn ? "#2563eb" : "#000000"}
          emissiveIntensity={tvOn ? 0.5 : 0}
        />
      </Box>
      <Box args={[2.2, 1.4, 0.05]} position={[0, 0, -0.1]} castShadow>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <mesh position={[0.9, -0.5, 0.1]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
    </group>
  );
}

function Level1Scene({ onMessage }: { onMessage: (msg: string, type: "info" | "success" | "error") => void }) {
  const [cableConnected, setCableConnected] = useState(false);
  const [tvStep, setTvStep] = useState(0);
  const [showKey1, setShowKey1] = useState(false);
  const [showKey2, setShowKey2] = useState(false);
  const [useRealModels, setUseRealModels] = useState(true);
  
  const { setLevel1CableSolved, setLevel1TVSolved, keysCollected, changeState } = useEnergyQuest();
  const { playSuccess, playHit } = useAudio();
  const batteryRef = useRef<THREE.Group>(null);
  const switchRef = useRef<THREE.Group>(null);

  useEffect(() => {
    onMessage("Rumah gelap! Perbaiki rangkaian listrik agar lampu menyala", "info");
  }, [onMessage]);

  useEffect(() => {
    if (keysCollected >= 2) {
      setTimeout(() => {
        onMessage("Level 1 Selesai! Semua kunci energi terkumpul. Menuju dapur...", "success");
        setTimeout(() => changeState(GameState.Level2), 2000);
      }, 1000);
    }
  }, [keysCollected, changeState, onMessage]);

  const handleCableClick = () => {
    if (!cableConnected) {
      const collision = batteryRef.current && switchRef.current 
        ? checkCollision(batteryRef.current, switchRef.current, 0.1)
        : true;
      
      if (collision) {
        setCableConnected(true);
        setLevel1CableSolved(true);
        onMessage("Rangkaian benar! Listrik mengalir dalam rangkaian tertutup!", "success");
        playSuccess();
        setShowKey1(true);
        console.log("[Level 1] Cable puzzle solved! Battery → Switch → Lamp circuit complete");
      } else {
        playHit();
        onMessage("Salah sambung! Coba lagi dengan posisi yang benar", "error");
      }
    }
  };

  const handleTVClick = () => {
    const nextStep = tvStep + 1;
    setTvStep(nextStep);
    
    const steps = [
      "Step 1: Colok kabel TV...",
      "Step 2: Nyalakan saklar utama...",
      "Step 3: Tekan tombol power...",
      "Step 4: Atur channel..."
    ];
    
    if (nextStep < 4) {
      onMessage(steps[nextStep - 1], "info");
      playHit();
    } else if (nextStep === 4) {
      setLevel1TVSolved(true);
      onMessage("TV menyala! Rekaman Profesor: 'Carilah kunci energi untuk membuka lab!'", "success");
      playSuccess();
      setShowKey2(true);
      console.log("[Level 1] TV puzzle solved! All 4 steps completed");
    } else {
      setTvStep(0);
    }
  };

  return (
    <>
      <ambientLight intensity={cableConnected ? 0.6 : 0.3} />
      <directionalLight 
        position={[8, 10, 5]} 
        intensity={cableConnected ? 1.2 : 0.5} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />

      <WoodFloor />

      <Box position={[0, 2, -8]} args={[30, 10, 0.2]} receiveShadow>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Box position={[-8, 2, 0]} args={[0.2, 10, 30]} receiveShadow>
        <meshStandardMaterial color="#2a2a2a" />
      </Box>
      <Box position={[8, 2, 0]} args={[0.2, 10, 30]} receiveShadow>
        <meshStandardMaterial color="#2a2a2a" />
      </Box>

      {useRealModels ? (
        <>
          <GLTFModel modelPath={MODEL_PATHS.battery} position={FIXED_POSITIONS.battery} scale={1} name="battery" />
          <GLTFModel 
            modelPath={MODEL_PATHS.switch} 
            position={FIXED_POSITIONS.switch} 
            scale={1} 
            onClick={handleCableClick}
            name="switch" 
          />
          <GLTFModel modelPath={MODEL_PATHS.lamp} position={FIXED_POSITIONS.lamp} scale={1} name="lamp" />
          <GLTFModel 
            modelPath={MODEL_PATHS.oldTV} 
            position={FIXED_POSITIONS.oldTV} 
            scale={1.5}
            onClick={handleTVClick}
            name="oldTV" 
          />
        </>
      ) : (
        <>
          <BatteryFallback position={FIXED_POSITIONS.battery} />
          <SwitchFallback position={FIXED_POSITIONS.switch} onClick={handleCableClick} connected={cableConnected} />
          <LampFallback position={FIXED_POSITIONS.lamp} isOn={cableConnected} />
          <OldTVFallback position={FIXED_POSITIONS.oldTV} onClick={handleTVClick} tvOn={tvStep >= 4} />
        </>
      )}

      {showKey1 && <EnergyKey position={[2, 2, 0]} />}
      {showKey2 && <EnergyKey position={[4, 2.5, 0]} />}

      <OrbitControls 
        enablePan={false} 
        minDistance={8} 
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 1, 0]}
        enableDamping
        dampingFactor={0.05}
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
      <Canvas 
        camera={{ position: [0, 6, 12], fov: 60 }}
        shadows
      >
        <Level1Scene onMessage={(msg, type) => { setMessage(msg); setMessageType(type); }} />
      </Canvas>
      
      <GameUI 
        message={message}
        messageType={messageType}
        keysCollected={keysCollected}
      />
      
      <div className="fixed bottom-4 right-4 bg-gray-800/90 p-4 rounded-lg text-white text-sm max-w-xs">
        <h3 className="font-bold mb-2">Level 1: Ruang Tamu Gelap</h3>
        <p className="text-xs text-gray-300">
          <strong>Fixed Positions (Game Ready):</strong><br/>
          • Battery: (-2, 0, 0)<br/>
          • Switch: (0, 0, 0) - Klik untuk sambung<br/>
          • Lamp: (2, 0, 0)<br/>
          • Old TV: (4, 0, 0) - Klik 4x<br/>
          <br/>
          <strong>Kunci Energi:</strong> {keysCollected}/2
        </p>
      </div>
    </div>
  );
}
