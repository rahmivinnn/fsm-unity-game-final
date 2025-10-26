import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, useTexture, Text } from "@react-three/drei";
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
      <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.8} metalness={0.5} roughness={0.3} />
    </mesh>
  );
}

interface Device {
  name: string;
  power: number;
  hours: number;
  active: boolean;
}

function LabFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#3a3a3a" />
    </mesh>
  );
}

function ControlPanel({ 
  position, 
  device, 
  onClick 
}: { 
  position: [number, number, number], 
  device: Device, 
  onClick: () => void 
}) {
  return (
    <group position={position} onClick={onClick}>
      <Box args={[2, 2.5, 0.5]} castShadow receiveShadow>
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.3} />
      </Box>
      
      <Box position={[0, 0.8, 0.26]} args={[1.6, 1.2, 0.02]} castShadow>
        <meshStandardMaterial 
          color={device.active ? "#1e3a5a" : "#0a0a0a"}
          emissive={device.active ? "#22c55e" : "#dc2626"}
          emissiveIntensity={device.active ? 0.5 : 0.3}
        />
      </Box>
      
      <mesh position={[0, -0.6, 0.3]}>
        <boxGeometry args={[0.6, 0.4, 0.1]} />
        <meshStandardMaterial 
          color={device.active ? "#22c55e" : "#dc2626"}
          emissive={device.active ? "#22c55e" : "#dc2626"}
          emissiveIntensity={1}
        />
      </mesh>

      <Text
        position={[0, -1, 0.3]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {device.name}
      </Text>
      
      <Text
        position={[0, 0.8, 0.28]}
        fontSize={0.12}
        color={device.active ? "#4ade80" : "#f87171"}
        anchorX="center"
        anchorY="middle"
      >
        {device.power}W × {device.hours}h
      </Text>
      
      <Text
        position={[0, 0.5, 0.28]}
        fontSize={0.1}
        color={device.active ? "#86efac" : "#fca5a5"}
        anchorX="center"
        anchorY="middle"
      >
        {device.active ? "ON" : "OFF"}
      </Text>
    </group>
  );
}

function LabTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Box args={[12, 0.2, 3]} castShadow receiveShadow>
        <meshStandardMaterial color="#5a5a5a" metalness={0.5} roughness={0.4} />
      </Box>
      <Box position={[-5.5, -0.8, 0]} args={[0.3, 1.5, 0.3]} castShadow receiveShadow>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>
      <Box position={[5.5, -0.8, 0]} args={[0.3, 1.5, 0.3]} castShadow receiveShadow>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>
      <Box position={[-5.5, -0.8, -1.3]} args={[0.3, 1.5, 0.3]} castShadow receiveShadow>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>
      <Box position={[5.5, -0.8, -1.3]} args={[0.3, 1.5, 0.3]} castShadow receiveShadow>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>
    </group>
  );
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
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[8, 10, 5]} 
        intensity={0.8} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 4, 0]} intensity={1} color="#4ade80" distance={15} />

      <LabFloor />

      <Box position={[0, 2, -8]} args={[30, 10, 0.2]} receiveShadow>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Box position={[-8, 2, 0]} args={[0.2, 10, 30]} receiveShadow>
        <meshStandardMaterial color="#2a2a2a" />
      </Box>
      <Box position={[8, 2, 0]} args={[0.2, 10, 30]} receiveShadow>
        <meshStandardMaterial color="#2a2a2a" />
      </Box>

      <LabTable position={[0, 1.6, -5]} />

      {devices.map((device, index) => (
        <ControlPanel 
          key={device.name}
          position={[-5 + index * 3.5, 2.8, -5]} 
          device={device}
          onClick={() => toggleDevice(index)}
        />
      ))}

      {showKey && <EnergyKey position={[0, 3.5, 0]} onCollect={() => {
        setTimeout(() => {
          onMessage("Level 3 Selesai! Menuju Ruang Bawah Tanah...", "success");
          setTimeout(() => changeState(GameState.Level4), 2000);
        }, 500);
      }} />}

      <OrbitControls 
        enablePan={false} 
        minDistance={8} 
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 2, -3]}
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
      <Canvas 
        camera={{ position: [0, 6, 8], fov: 60 }}
        shadows
      >
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
          Klik panel untuk ON/OFF:<br/>
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
