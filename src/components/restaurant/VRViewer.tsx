import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { X, RotateCcw } from 'lucide-react';
import * as THREE from 'three';

interface VRViewerProps {
  itemName: string;
  itemImage: string;
  onClose: () => void;
}

function MealModel({ image }: { image: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture] = useState(() => new THREE.TextureLoader().load(image));
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[2.5, 1.5, 0.1]} />
      <meshStandardMaterial map={texture} metalness={0.3} roughness={0.4} />
    </mesh>
  );
}

function Plate() {
  return (
    <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[2, 64]} />
      <meshStandardMaterial color="#f5f5f5" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

export default function VRViewer({ itemName, itemImage, onClose }: VRViewerProps) {
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 5]);

  const resetCamera = () => {
    setCameraPosition([0, 0, 5]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h2 className="text-white text-xl font-semibold">{itemName}</h2>
            <p className="text-white/70 text-sm">VR View - Drag to rotate, scroll to zoom</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={resetCamera}
              className="text-white hover:bg-white/20"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-6 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">🖱️ Drag</span>
              <span>Rotate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">🖱️ Scroll</span>
              <span>Zoom</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">📱 Pinch</span>
              <span>Zoom (Mobile)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas>
        <PerspectiveCamera makeDefault position={cameraPosition} />
        <OrbitControls 
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 4}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.3} intensity={1} castShadow />
        <spotLight position={[-10, 10, -10]} angle={0.3} intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={0.5} />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* Models */}
        <MealModel image={itemImage} />
        <Plate />
        
        {/* Background */}
        <mesh position={[0, 0, -5]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </Canvas>
    </div>
  );
}
