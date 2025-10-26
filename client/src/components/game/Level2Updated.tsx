import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, useTexture } from "@react-three/drei";
import { useState, useEffect } from "react";
import * as THREE from "three";
import { useEnergyQuest, GameState } from "@/lib/stores/useEnergyQuest";
import { GameUI } from "./GameUI";
import { useAudio } from "@/lib/stores/useAudio";
import { GLTFModel, MODEL_PATHS } from "./ModelLoader";

const FIXED_POSITIONS = {
  fridge: [-3, 0, 0] as [number, number, number],
  riceCooker: [-1, 0, 0] as [number, number, number],
  fan: [1, 0, 0] as [number, number, number],
  iron: [3, 0, 0] as [number, number, number],
};

const DEVICE_POWER = {
  fridge: 150,
  riceCooker: 400,
  fan: 50,
  iron: 1000,
};

interface DeviceState {
  name: string;
  isOn: boolean;
  powerWatts: number;
}

function TileFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#e8e8e8" />
    </mesh>
  );
}

function DeviceFallback({ 
  position, 
  color, 
  size, 
  label, 
  isOn, 
  onClick 
}: { 
  position: [number, number, number], 
  color: string, 
  size: [number, number, number],
  label: string,
  isOn: boolean,
  onClick: () => void
}) {
  return (
    <group position={position} onClick={onClick}>
      <Box args={size} castShadow receiveShadow>
        <meshStandardMaterial 
          color={color} 
          emissive={isOn ? color : "#000000"}
          emissiveIntensity={isOn ? 0.3 : 0}
        />
      </Box>
      {isOn && (
        <mesh position={[0, size[1] / 2 + 0.1, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="green" emissive="green" emissiveIntensity={1} />
        </mesh>
      )}
    </group>
  );
}

function PowerMeter({ powerPercent, efficiency }: { powerPercent: number, efficiency: number }) {
  const color = efficiency >= 50 ? "#22c55e" : efficiency >= 30 ? "#f59e0b" : "#ef4444";
  
  return (
    <div className="fixed top-4 left-4 bg-gray-800/90 p-4 rounded-lg text-white min-w-64">
      <h3 className="font-bold mb-2 text-lg">Power Meter</h3>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Konsumsi Daya</span>
            <span>{powerPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div 
              className="h-4 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(powerPercent, 100)}%`,
                backgroundColor: color
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Efisiensi</span>
            <span>{efficiency.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div 
              className="h-4 rounded-full transition-all duration-300"
              style={{ 
                width: `${efficiency}%`,
                backgroundColor: color
              }}
            />
          </div>
        </div>
        <p className="text-xs text-gray-300 mt-2">
          Target: Efisiensi ≥ 50% untuk dapat kunci energi
        </p>
      </div>
    </div>
  );
}

function Level2Scene({ 
  onMessage, 
  devices, 
  onDeviceToggle 
}: { 
  onMessage: (msg: string, type: "info" | "success" | "error") => void,
  devices: DeviceState[],
  onDeviceToggle: (name: string) => void
}) {
  const fridgeDevice = devices.find(d => d.name === "fridge");
  const riceCookerDevice = devices.find(d => d.name === "riceCooker");
  const fanDevice = devices.find(d => d.name === "fan");
  const ironDevice = devices.find(d => d.name === "iron");

  useEffect(() => {
    onMessage("Dapur penuh peralatan listrik. Gunakan perangkat dengan bijak!", "info");
  }, [onMessage]);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.2} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <TileFloor />

      <Box position={[0, 2, -8]} args={[30, 10, 0.2]} receiveShadow>
        <meshStandardMaterial color="#f5f5dc" />
      </Box>
      <Box position={[-8, 2, 0]} args={[0.2, 10, 30]} receiveShadow>
        <meshStandardMaterial color="#faebd7" />
      </Box>
      <Box position={[8, 2, 0]} args={[0.2, 10, 30]} receiveShadow>
        <meshStandardMaterial color="#faebd7" />
      </Box>

      <DeviceFallback 
        position={FIXED_POSITIONS.fridge}
        color="#3b82f6"
        size={[1.2, 2, 0.8]}
        label="Kulkas (150W)"
        isOn={fridgeDevice?.isOn || false}
        onClick={() => onDeviceToggle("fridge")}
      />

      <DeviceFallback 
        position={FIXED_POSITIONS.riceCooker}
        color="#ef4444"
        size={[0.6, 0.4, 0.6]}
        label="Rice Cooker (400W)"
        isOn={riceCookerDevice?.isOn || false}
        onClick={() => onDeviceToggle("riceCooker")}
      />

      <DeviceFallback 
        position={FIXED_POSITIONS.fan}
        color="#gray"
        size={[0.5, 1.2, 0.5]}
        label="Kipas (50W)"
        isOn={fanDevice?.isOn || false}
        onClick={() => onDeviceToggle("fan")}
      />

      <DeviceFallback 
        position={FIXED_POSITIONS.iron}
        color="#475569"
        size={[0.4, 0.3, 0.7]}
        label="Setrika (1000W)"
        isOn={ironDevice?.isOn || false}
        onClick={() => onDeviceToggle("iron")}
      />

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

export function Level2() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "success" | "error">("info");
  const [devices, setDevices] = useState<DeviceState[]>([
    { name: "fridge", isOn: false, powerWatts: DEVICE_POWER.fridge },
    { name: "riceCooker", isOn: false, powerWatts: DEVICE_POWER.riceCooker },
    { name: "fan", isOn: false, powerWatts: DEVICE_POWER.fan },
    { name: "iron", isOn: false, powerWatts: DEVICE_POWER.iron },
  ]);
  const [keyCollected, setKeyCollected] = useState(false);

  const { addKey, changeState, setLevel2Efficiency } = useEnergyQuest();
  const { playSuccess, playHit } = useAudio();

  const totalPower = Object.values(DEVICE_POWER).reduce((a, b) => a + b, 0);
  const usedPower = devices.filter(d => d.isOn).reduce((sum, d) => sum + d.powerWatts, 0);
  const powerPercent = (usedPower / totalPower) * 100;
  const efficiency = 100 - powerPercent;

  useEffect(() => {
    setLevel2Efficiency(efficiency);
    
    if (efficiency >= 50 && !keyCollected) {
      setKeyCollected(true);
      addKey();
      playSuccess();
      setMessage("Efisiensi tercapai! Kunci energi didapat!");
      setMessageType("success");
      console.log(`[Level 2] Efficiency target reached: ${efficiency.toFixed(1)}%`);
      
      setTimeout(() => {
        setMessage("Level 2 Selesai! Menuju laboratorium...");
        setMessageType("success");
        setTimeout(() => changeState(GameState.Level3), 2000);
      }, 2000);
    } else if (powerPercent > 50 && devices.some(d => d.isOn)) {
      playHit();
      setMessage("Terlalu boros! Matikan beberapa perangkat yang tidak penting");
      setMessageType("error");
    }
  }, [efficiency, keyCollected, addKey, playSuccess, playHit, setLevel2Efficiency, changeState, devices, powerPercent]);

  const handleDeviceToggle = (deviceName: string) => {
    setDevices(prev => 
      prev.map(d => 
        d.name === deviceName ? { ...d, isOn: !d.isOn } : d
      )
    );
    
    const device = devices.find(d => d.name === deviceName);
    if (device) {
      const action = device.isOn ? "OFF" : "ON";
      console.log(`[Level 2] ${deviceName} toggled ${action} (${device.powerWatts}W)`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black">
      <Canvas 
        camera={{ position: [0, 6, 12], fov: 60 }}
        shadows
      >
        <Level2Scene 
          onMessage={(msg, type) => { setMessage(msg); setMessageType(type); }} 
          devices={devices}
          onDeviceToggle={handleDeviceToggle}
        />
      </Canvas>
      
      <GameUI 
        message={message}
        messageType={messageType}
        keysCollected={0}
      />

      <PowerMeter powerPercent={powerPercent} efficiency={efficiency} />
      
      <div className="fixed bottom-4 right-4 bg-gray-800/90 p-4 rounded-lg text-white text-sm max-w-xs">
        <h3 className="font-bold mb-2">Level 2: Dapur</h3>
        <p className="text-xs text-gray-300">
          <strong>Fixed Positions:</strong><br/>
          • Kulkas (-3,0,0): 150W<br/>
          • Rice Cooker (-1,0,0): 400W<br/>
          • Kipas (1,0,0): 50W<br/>
          • Setrika (3,0,0): 1000W<br/>
          <br/>
          <strong>Total Daya:</strong> {totalPower}W<br/>
          <strong>Terpakai:</strong> {usedPower}W ({powerPercent.toFixed(1)}%)
        </p>
      </div>
    </div>
  );
}
