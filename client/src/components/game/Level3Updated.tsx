import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import { useState, useEffect } from "react";
import * as THREE from "three";
import { useEnergyQuest, GameState } from "@/lib/stores/useEnergyQuest";
import { GameUI } from "./GameUI";
import { useAudio } from "@/lib/stores/useAudio";
import { calculateKWh, calculateBill } from "@/lib/utils/fisherYates";

const FIXED_POSITIONS = {
  ac: [0, 2, 0] as [number, number, number],
  tv: [2, 0, 0] as [number, number, number],
  lamp: [-2, 0, 0] as [number, number, number],
  fridge: [-4, 0, 0] as [number, number, number],
};

const DEVICE_SPECS = {
  ac: { powerWatts: 1000, usageHours: 24 },
  tv: { powerWatts: 100, usageHours: 24 },
  lamp: { powerWatts: 15, usageHours: 24 },
  fridge: { powerWatts: 150, usageHours: 24 },
};

interface DeviceState {
  name: string;
  isOn: boolean;
  powerWatts: number;
  usageHours: number;
}

function LabFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#2a2a3a" />
    </mesh>
  );
}

function DeviceFallback({ 
  position, 
  color, 
  size, 
  label, 
  isOn, 
  onClick,
  powerWatts 
}: { 
  position: [number, number, number], 
  color: string, 
  size: [number, number, number],
  label: string,
  isOn: boolean,
  onClick: () => void,
  powerWatts: number
}) {
  return (
    <group position={position} onClick={onClick}>
      <Box args={size} castShadow receiveShadow>
        <meshStandardMaterial 
          color={color} 
          emissive={isOn ? color : "#000000"}
          emissiveIntensity={isOn ? 0.4 : 0}
        />
      </Box>
      {isOn && (
        <>
          <mesh position={[0, size[1] / 2 + 0.2, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="red" emissive="red" emissiveIntensity={1.5} />
          </mesh>
          <pointLight position={[0, 0, 0]} intensity={0.5} distance={4} color={color} />
        </>
      )}
    </group>
  );
}

function BillMeter({ 
  bill, 
  totalKWh, 
  target = 300000 
}: { 
  bill: number, 
  totalKWh: number,
  target?: number 
}) {
  const billPercent = (bill / 500000) * 100;
  const color = bill <= target ? "#22c55e" : bill <= 400000 ? "#f59e0b" : "#ef4444";
  
  return (
    <div className="fixed top-4 left-4 bg-gray-800/90 p-4 rounded-lg text-white min-w-72">
      <h3 className="font-bold mb-2 text-lg">Simulator Tagihan Listrik</h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Total Konsumsi</span>
            <span>{totalKWh.toFixed(2)} kWh</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Tarif per kWh</span>
            <span>Rp 1.500</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Total Tagihan</span>
            <span className="font-bold">Rp {bill.toLocaleString('id-ID')}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-6">
            <div 
              className="h-6 rounded-full transition-all duration-300 flex items-center justify-center text-xs font-bold"
              style={{ 
                width: `${Math.min(billPercent, 100)}%`,
                backgroundColor: color
              }}
            >
              {billPercent.toFixed(0)}%
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-300 border-t border-gray-600 pt-2">
          <p>Target: ≤ Rp {target.toLocaleString('id-ID')}</p>
          <p className="mt-1">
            Status: {bill <= target ? "✓ Efisien!" : "✗ Terlalu Boros"}
          </p>
        </div>
        <div className="text-xs bg-gray-700/50 p-2 rounded">
          <p className="font-mono">Rumus: E = (P × t) / 1000</p>
          <p className="text-gray-400 mt-1">E = Energi (kWh), P = Daya (Watt), t = Waktu (jam)</p>
        </div>
      </div>
    </div>
  );
}

function Level3Scene({ 
  onMessage, 
  devices, 
  onDeviceToggle 
}: { 
  onMessage: (msg: string, type: "info" | "success" | "error") => void,
  devices: DeviceState[],
  onDeviceToggle: (name: string) => void
}) {
  const acDevice = devices.find(d => d.name === "ac");
  const tvDevice = devices.find(d => d.name === "tv");
  const lampDevice = devices.find(d => d.name === "lamp");
  const fridgeDevice = devices.find(d => d.name === "fridge");

  useEffect(() => {
    onMessage("Laboratorium Profesor. Atur perangkat agar tagihan ≤ Rp 300.000", "info");
  }, [onMessage]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <LabFloor />

      <Box position={[0, 2, -8]} args={[30, 10, 0.2]} receiveShadow>
        <meshStandardMaterial color="#1a1a2a" />
      </Box>
      <Box position={[-8, 2, 0]} args={[0.2, 10, 30]} receiveShadow>
        <meshStandardMaterial color="#2a2a3a" />
      </Box>
      <Box position={[8, 2, 0]} args={[0.2, 10, 30]} receiveShadow>
        <meshStandardMaterial color="#2a2a3a" />
      </Box>

      <DeviceFallback 
        position={FIXED_POSITIONS.ac}
        color="#3b82f6"
        size={[1.5, 0.4, 0.6]}
        label="AC (1000W)"
        isOn={acDevice?.isOn || false}
        onClick={() => onDeviceToggle("ac")}
        powerWatts={DEVICE_SPECS.ac.powerWatts}
      />

      <DeviceFallback 
        position={FIXED_POSITIONS.tv}
        color="#475569"
        size={[1.2, 0.8, 0.15]}
        label="TV (100W)"
        isOn={tvDevice?.isOn || false}
        onClick={() => onDeviceToggle("tv")}
        powerWatts={DEVICE_SPECS.tv.powerWatts}
      />

      <DeviceFallback 
        position={FIXED_POSITIONS.lamp}
        color="#fbbf24"
        size={[0.3, 0.6, 0.3]}
        label="Lampu (15W)"
        isOn={lampDevice?.isOn || false}
        onClick={() => onDeviceToggle("lamp")}
        powerWatts={DEVICE_SPECS.lamp.powerWatts}
      />

      <DeviceFallback 
        position={FIXED_POSITIONS.fridge}
        color="#10b981"
        size={[0.9, 1.6, 0.6]}
        label="Kulkas (150W)"
        isOn={fridgeDevice?.isOn || false}
        onClick={() => onDeviceToggle("fridge")}
        powerWatts={DEVICE_SPECS.fridge.powerWatts}
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

export function Level3() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "success" | "error">("info");
  const [devices, setDevices] = useState<DeviceState[]>([
    { name: "ac", isOn: false, powerWatts: DEVICE_SPECS.ac.powerWatts, usageHours: DEVICE_SPECS.ac.usageHours },
    { name: "tv", isOn: false, powerWatts: DEVICE_SPECS.tv.powerWatts, usageHours: DEVICE_SPECS.tv.usageHours },
    { name: "lamp", isOn: false, powerWatts: DEVICE_SPECS.lamp.powerWatts, usageHours: DEVICE_SPECS.lamp.usageHours },
    { name: "fridge", isOn: false, powerWatts: DEVICE_SPECS.fridge.powerWatts, usageHours: DEVICE_SPECS.fridge.usageHours },
  ]);
  const [keyCollected, setKeyCollected] = useState(false);

  const { addKey, changeState, setLevel3Bill } = useEnergyQuest();
  const { playSuccess, playHit } = useAudio();

  const totalKWh = devices
    .filter(d => d.isOn)
    .reduce((sum, d) => sum + calculateKWh(d.powerWatts, d.usageHours), 0);
  
  const bill = calculateBill(totalKWh, 1500);
  const TARGET_BILL = 300000;

  useEffect(() => {
    setLevel3Bill(bill);
    
    if (bill <= TARGET_BILL && bill > 0 && !keyCollected) {
      setKeyCollected(true);
      addKey();
      playSuccess();
      setMessage(`Target tercapai! Tagihan: Rp ${bill.toLocaleString('id-ID')}. Kunci energi didapat!`);
      setMessageType("success");
      console.log(`[Level 3] Bill target achieved: Rp ${bill.toLocaleString('id-ID')} (${totalKWh.toFixed(2)} kWh)`);
      
      setTimeout(() => {
        setMessage("Level 3 Selesai! Menuju basement untuk quiz final...");
        setMessageType("success");
        setTimeout(() => changeState(GameState.Level4), 2000);
      }, 2000);
    } else if (bill > TARGET_BILL && devices.some(d => d.isOn)) {
      playHit();
      setMessage(`Tagihan terlalu tinggi: Rp ${bill.toLocaleString('id-ID')}! Matikan perangkat boros`);
      setMessageType("error");
    }
  }, [bill, keyCollected, addKey, playSuccess, playHit, setLevel3Bill, changeState, devices, totalKWh]);

  const handleDeviceToggle = (deviceName: string) => {
    setDevices(prev => 
      prev.map(d => 
        d.name === deviceName ? { ...d, isOn: !d.isOn } : d
      )
    );
    
    const device = devices.find(d => d.name === deviceName);
    if (device) {
      const action = device.isOn ? "OFF" : "ON";
      const kwh = calculateKWh(device.powerWatts, device.usageHours);
      console.log(`[Level 3] ${deviceName} toggled ${action} (${device.powerWatts}W, ${kwh.toFixed(2)} kWh/day)`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black">
      <Canvas 
        camera={{ position: [0, 6, 12], fov: 60 }}
        shadows
      >
        <Level3Scene 
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

      <BillMeter bill={bill} totalKWh={totalKWh} target={TARGET_BILL} />
      
      <div className="fixed bottom-4 right-4 bg-gray-800/90 p-4 rounded-lg text-white text-sm max-w-xs">
        <h3 className="font-bold mb-2">Level 3: Laboratorium</h3>
        <p className="text-xs text-gray-300">
          <strong>Fixed Positions (24 jam):</strong><br/>
          • AC (0,2,0): 1000W = {calculateKWh(1000, 24).toFixed(1)} kWh<br/>
          • TV (2,0,0): 100W = {calculateKWh(100, 24).toFixed(1)} kWh<br/>
          • Lampu (-2,0,0): 15W = {calculateKWh(15, 24).toFixed(1)} kWh<br/>
          • Kulkas (-4,0,0): 150W = {calculateKWh(150, 24).toFixed(1)} kWh<br/>
          <br/>
          <strong>Rumus:</strong> kWh = (P × t) / 1000<br/>
          <strong>Tarif:</strong> Rp 1.500/kWh
        </p>
      </div>
    </div>
  );
}
