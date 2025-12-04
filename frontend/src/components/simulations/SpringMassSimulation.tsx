import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Box } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  parameters: Record<string, any>;
  isRunning: boolean;
}

export default function SpringMassSimulation({ parameters, isRunning }: Props) {
  const massRef = useRef<THREE.Mesh>(null);
  const [position, setPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);

  const {
    mass = 1,
    springConstant = 10,
    damping = 0.1,
    displacement = 2
  } = parameters;

  const anchorY = 5;

  useEffect(() => {
    setPosition(displacement);
    setVelocity(0);
  }, [mass, springConstant, damping, displacement]);

  useFrame((state, delta) => {
    if (!isRunning || !massRef.current) return;

    const dt = Math.min(delta, 0.05);

    // Hooke's law: F = -kx - cv
    const springForce = -springConstant * position;
    const dampingForce = -damping * velocity;
    const totalForce = springForce + dampingForce;

    // F = ma => a = F/m
    const acceleration = totalForce / mass;

    // Euler integration
    const newVelocity = velocity + acceleration * dt;
    const newPosition = position + newVelocity * dt;

    setPosition(newPosition);
    setVelocity(newVelocity);

    massRef.current.position.y = anchorY - newPosition;
  });

  const springPoints = [
    new THREE.Vector3(0, anchorY, 0),
    new THREE.Vector3(0, anchorY - position, 0)
  ];

  return (
    <>
      {/* Anchor point */}
      <Box args={[1, 0.2, 1]} position={[0, anchorY, 0]}>
        <meshStandardMaterial color="#666666" />
      </Box>

      {/* Spring */}
      <Line
        points={springPoints}
        color="#fbbf24"
        lineWidth={3}
      />

      {/* Mass */}
      <Sphere ref={massRef} args={[0.5, 32, 32]} position={[0, anchorY - displacement, 0]}>
        <meshStandardMaterial color="#ef4444" />
      </Sphere>

      {/* Reference line (equilibrium) */}
      <Line
        points={[
          new THREE.Vector3(-2, anchorY, 0),
          new THREE.Vector3(2, anchorY, 0)
        ]}
        color="#4b5563"
        lineWidth={1}
        transparent
        opacity={0.3}
      />
    </>
  );
}
