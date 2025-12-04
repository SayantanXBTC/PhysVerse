import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  parameters: Record<string, any>;
  isRunning: boolean;
}

export default function ProjectileSimulation({ parameters, isRunning }: Props) {
  const ballRef = useRef<THREE.Mesh>(null);
  const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0));
  const [velocity, setVelocity] = useState(new THREE.Vector3(0, 0, 0));
  const [time, setTime] = useState(0);
  const [trail, setTrail] = useState<THREE.Vector3[]>([]);

  const { velocity: v0 = 20, angle = 45, gravity = 9.8 } = parameters;

  useEffect(() => {
    // Reset simulation when parameters change
    const angleRad = (angle * Math.PI) / 180;
    const vx = v0 * Math.cos(angleRad);
    const vy = v0 * Math.sin(angleRad);
    
    setPosition(new THREE.Vector3(0, 0.5, 0));
    setVelocity(new THREE.Vector3(vx, vy, 0));
    setTime(0);
    setTrail([new THREE.Vector3(0, 0.5, 0)]);
  }, [v0, angle, gravity]);

  useFrame((state, delta) => {
    if (!isRunning || !ballRef.current) return;

    const dt = Math.min(delta, 0.1);
    const newTime = time + dt;

    // Physics calculation
    const newVelocity = velocity.clone();
    newVelocity.y -= gravity * dt;

    const newPosition = position.clone();
    newPosition.add(velocity.clone().multiplyScalar(dt));

    // Ground collision
    if (newPosition.y <= 0.5) {
      newPosition.y = 0.5;
      newVelocity.y = 0;
      newVelocity.x *= 0.8; // Friction
    }

    setPosition(newPosition);
    setVelocity(newVelocity);
    setTime(newTime);

    // Update trail
    if (trail.length < 200) {
      setTrail([...trail, newPosition.clone()]);
    }

    ballRef.current.position.copy(newPosition);
  });

  return (
    <>
      {/* Projectile */}
      <Sphere ref={ballRef} args={[0.5, 32, 32]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#3b82f6" />
      </Sphere>

      {/* Trail */}
      {trail.length > 1 && (
        <Line
          points={trail}
          color="#60a5fa"
          lineWidth={2}
          transparent
          opacity={0.6}
        />
      )}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </>
  );
}
