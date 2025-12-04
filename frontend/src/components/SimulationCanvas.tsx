import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import { SimulationEngine } from '@/simulation/engine/SimulationEngine';
import { simulationRegistry } from '@/simulation/registry';
import { EnhancedOrbitControls } from './CameraControls';

interface Props {
  simulationId: string;
  parameters: Record<string, unknown>;
  isRunning: boolean;
  onReset?: () => void;
}

function SimulationRunner({ simulationId, parameters, isRunning }: Props) {
  const { scene } = useThree();
  const engineRef = useRef<SimulationEngine | null>(null);

  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new SimulationEngine(scene);
    }

    const simulation = simulationRegistry.create(simulationId);
    if (simulation) {
      engineRef.current.loadSimulation(simulation, parameters);
    }

    return () => {
      engineRef.current?.cleanup();
    };
  }, [simulationId, scene, parameters]);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateParameters(parameters);
    }
  }, [parameters]);

  useEffect(() => {
    if (engineRef.current) {
      if (isRunning) {
        engineRef.current.play();
      } else {
        engineRef.current.pause();
      }
    }
  }, [isRunning]);

  useFrame((state, delta) => {
    if (engineRef.current && isRunning) {
      engineRef.current.update(delta);
    }
  });

  return null;
}

export default function SimulationCanvas({ simulationId, parameters, isRunning, onReset }: Props) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-950 to-black relative overflow-hidden">
      <Canvas 
        camera={{ position: [10, 10, 10], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#0a0a0a']} />
        
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />
        <hemisphereLight args={['#ffffff', '#444444', 0.3]} />

        <Grid 
          args={[20, 20]} 
          cellColor="#1a1a1a" 
          sectionColor="#2a2a2a"
          fadeDistance={30}
          fadeStrength={1}
        />

        <SimulationRunner 
          simulationId={simulationId}
          parameters={parameters}
          isRunning={isRunning}
          onReset={onReset}
        />

        <EnhancedOrbitControls />
      </Canvas>
    </div>
  );
}
