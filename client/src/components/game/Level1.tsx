import { Canvas, useThree } from "@react-three/fiber";
import { Box, useTexture } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { useEnergyQuest, GameState } from "@/lib/stores/useEnergyQuest";
import { GameUI } from "./GameUI";
import { useAudio } from "@/lib/stores/useAudio";
import { GLTFModel } from "./GLTFModel";
import { BoundingBoxHelper } from "@/lib/utils/boundingBox";
import { StudentCharacter } from "./StudentCharacter";
import { FocusOrbitControls } from "./FocusOrbitControls";

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
      <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.8} metalness={0.5} roughness={0.3} />
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

function WoodenCabinet({ position }: { position: [number, number, number] }) {
  const texture = useTexture("/textures/wood.jpg");
  
  return (
    <group position={position}>
      <Box args={[2, 4, 0.8]} castShadow receiveShadow>
        <meshStandardMaterial map={texture} />
      </Box>
      <Box position={[0, 1.5, 0.45]} args={[1.8, 0.8, 0.1]} castShadow>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>
      <Box position={[0, 0, 0.45]} args={[1.8, 0.8, 0.1]} castShadow>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>
      <Box position={[0, -1.5, 0.45]} args={[1.8, 0.8, 0.1]} castShadow>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>
    </group>
  );
}

function Window({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Box args={[3, 2.5, 0.1]}>
        <meshStandardMaterial color="#e8e8e8" />
      </Box>
      <Box position={[0, 0, 0.06]} args={[2.8, 2.3, 0.02]}>
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} />
      </Box>
      <Box position={[0, 0, 0.06]} args={[0.08, 2.3, 0.02]}>
        <meshStandardMaterial color="#e8e8e8" />
      </Box>
      <Box position={[0, 0, 0.06]} args={[2.8, 0.08, 0.02]}>
        <meshStandardMaterial color="#e8e8e8" />
      </Box>
    </group>
  );
}

function Sofa({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Box args={[3, 0.8, 1.2]} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2a2a2a" />
      </Box>
      <Box args={[3, 1.2, 0.3]} position={[0, 0.5, -0.45]} castShadow receiveShadow>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Box args={[0.3, 0.8, 1.2]} position={[-1.35, 0.4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Box args={[0.3, 0.8, 1.2]} position={[1.35, 0.4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Box args={[2.4, 0.4, 0.9]} position={[0, 0.2, 0.1]} castShadow>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>
    </group>
  );
}

function TVStand({ position, onClick, tvOn }: { position: [number, number, number], onClick: () => void, tvOn: boolean }) {
  // Using a realistic vintage Japanese CRT TV model
  return (
    <group position={position} onClick={onClick}>
      <GLTFModel 
        path="/models/vintage-japanese-tv.glb" 
        scale={[0.7, 0.7, 0.7]}
        castShadow
        receiveShadow
      />
      {tvOn && (
        <group position={[0, 1.2, 0.1]}>
          <pointLight intensity={1} distance={5} color="#2563eb" castShadow />
        </group>
      )}
    </group>
  );
}

function Battery({ position }: { position: [number, number, number] }) {
  // Using a realistic battery rack model instead of primitive shapes
  return (
    <GLTFModel 
      path="/models/battery-rack-metal.glb" 
      position={position} 
      scale={[0.5, 0.5, 0.5]}
      castShadow
      receiveShadow
    />
  );
}

function Switch({ position, onClick, connected }: { position: [number, number, number], onClick: () => void, connected: boolean }) {
  // Using a realistic vintage light switch model
  return (
    <GLTFModel 
      path="/models/light-switch-vintage.glb" 
      position={position} 
      scale={[0.3, 0.3, 0.3]}
      onClick={onClick}
      castShadow
      receiveShadow
    />
  );
}

function Lamp({ position, isOn }: { position: [number, number, number], isOn: boolean }) {
  // Using a realistic lamp bulb model
  return (
    <group position={position}>
      <GLTFModel 
        path="/models/lamp-bulb-glass.glb" 
        scale={[0.4, 0.4, 0.4]}
        castShadow
        receiveShadow
      />
      {isOn && <pointLight position={[0, 0, 0]} intensity={2} distance={8} color="yellow" castShadow />}
    </group>
  );
}

function CeilingLamp({ position }: { position: [number, number, number] }) {
  // Using a realistic ceiling lamp model
  return (
    <GLTFModel 
      path="/models/ceiling-lamp-modern.glb" 
      position={position} 
      scale={[0.6, 0.6, 0.6]}
      castShadow
      receiveShadow
    />
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
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[8, 10, 5]} 
        intensity={1} 
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

      <WoodenCabinet position={[-6, 1, -7]} />
      
      <Window position={[0, 2.5, -7.9]} />
      
      <Sofa position={[5, 0.4, -6]} />
      
      <TVStand 
        position={[5, 0.4, 0]} 
        onClick={handleTVClick} 
        tvOn={tvStep >= 4} 
      />

      <CeilingLamp position={[0, 5, -3]} />

      <Battery position={[-2, 0.5, 2]} />
      
      <Switch 
        position={[0, 0.5, 2]} 
        onClick={handleCableClick} 
        connected={cableConnected} 
      />
      
      <Lamp position={[2, 0.5, 2]} isOn={cableConnected} />

      {showKey1 && <EnergyKey position={[2, 2, 2]} />}
      {showKey2 && <EnergyKey position={[5, 2.5, 0]} />}

      <StudentCharacter 
        position={[-5, 0, 0]} 
      />

      <FocusOrbitControls 
        enablePan={false} 
        minDistance={8} 
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 1, 0]}
      />
    </>
  );
}

export function Level1() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "success" | "error">("info");
  const { keysCollected, level1CableSolved, level1TVSolved } = useEnergyQuest();
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  const levelTasks = [
    "Klik saklar untuk hubungkan rangkaian",
    "Klik TV 4x untuk menyalakannya",
    "Kumpulkan 2 kunci energi"
  ];

  useEffect(() => {
    if (level1CableSolved && level1TVSolved && keysCollected >= 2) {
      setCurrentTaskIndex(3); // All tasks completed
    } else if (level1CableSolved && level1TVSolved) {
      setCurrentTaskIndex(2); // First two tasks completed
    } else if (level1CableSolved) {
      setCurrentTaskIndex(1); // First task completed
    }
  }, [level1CableSolved, level1TVSolved, keysCollected]);

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
        tasks={levelTasks}
        currentTaskIndex={currentTaskIndex}
      />
    </div>
  );
}
