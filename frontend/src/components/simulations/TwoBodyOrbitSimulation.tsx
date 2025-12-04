import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  parameters: Record<string, any>;
  isRunning: boolean;
}

interface Body {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mass: number;
}

export default function TwoBodyOrbitSimulation({ parameters, isRunning }: Props) {
  const body1Ref = useRef<THREE.Mesh>(null);
  const body2Ref = useRef<THREE.Mesh>(null);
  
  const [body1, setBody1] = useState<Body>({
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    mass: 100
  });
  
  const [body2, setBody2] = useState<Body>({
    position: new THREE.Vector3(10, 0, 0),
    velocity: new THREE.Vector3(0, 5, 0),
    mass: 1
  });

  const [trail1, setTrail1] = useState<THREE.Vector3[]>([]);
  const [trail2, setTrail2] = useState<THREE.Vector3[]>([]);

  const {
    mass1 = 100,
    mass2 = 1,
    distance = 10,
    velocity: v = 5
  } = parameters;

  const G = 1; // Gravitational constant (scaled for visualization)

  useEffect(() => {
    setBody1({
      position: new THREE.Vector3(0, 0, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      mass: mass1
    });
    
    setBody2({
      position: new THREE.Vector3(distance, 0, 0),
      velocity: new THREE.Vector3(0, v, 0),
      mass: mass2
    });

    setTrail1([new THREE.Vector3(0, 0, 0)]);
    setTrail2([new THREE.Vector3(distance, 0, 0)]);
  }, [mass1, mass2, distance, v]);

  useFrame((state, delta) => {
    if (!isRunning || !body1Ref.current || !body2Ref.current) return;

    const dt = Math.min(delta, 0.05);

    // Calculate gravitational force
    const r = body2.position.clone().sub(body1.position);
    const distance = r.length();
    
    if (distance < 0.1) return; // Prevent singularity

    const forceMagnitude = (G * body1.mass * body2.mass) / (distance * distance);
    const forceDirection = r.normalize();
    const force = forceDirection.multiplyScalar(forceMagnitude);

    // Update velocities (F = ma => a = F/m)
    const newBody1Velocity = body1.velocity.clone().add(
      force.clone().divideScalar(body1.mass).multiplyScalar(dt)
    );
    
    const newBody2Velocity = body2.velocity.clone().sub(
      force.clone().divideScalar(body2.mass).multiplyScalar(dt)
    );

    // Update positions
    const newBody1Position = body1.position.clone().add(
      newBody1Velocity.clone().multiplyScalar(dt)
    );
    
    const newBody2Position = body2.position.clone().add(
      newBody2Velocity.clone().multiplyScalar(dt)
    );

    // Update state
    setBody1({
      ...body1,
      position: newBody1Position,
      velocity: newBody1Velocity
    });
    
    setBody2({
      ...body2,
      position: newBody2Position,
      velocity: newBody2Velocity
    });

    // Update trails
    if (trail1.length < 500) {
      setTrail1([...trail1, newBody1Position.clone()]);
      setTrail2([...trail2, newBody2Position.clone()]);
    } else {
      setTrail1([...trail1.slice(1), newBody1Position.clone()]);
      setTrail2([...trail2.slice(1), newBody2Position.clone()]);
    }

    // Update mesh positions
    body1Ref.current.position.copy(newBody1Position);
    body2Ref.current.position.copy(newBody2Position);
  });

  const body1Size = Math.max(0.5, Math.log(body1.mass + 1) * 0.3);
  const body2Size = Math.max(0.3, Math.log(body2.mass + 1) * 0.3);

  return (
    <>
      {/* Body 1 (larger mass) */}
      <Sphere ref={body1Ref} args={[body1Size, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
      </Sphere>

      {/* Body 2 (smaller mass) */}
      <Sphere ref={body2Ref} args={[body2Size, 32, 32]} position={[distance, 0, 0]}>
        <meshStandardMaterial color="#3b82f6" />
      </Sphere>

      {/* Trails */}
      {trail1.length > 1 && (
        <Line
          points={trail1}
          color="#fbbf24"
          lineWidth={1}
          transparent
          opacity={0.4}
        />
      )}
      
      {trail2.length > 1 && (
        <Line
          points={trail2}
          color="#3b82f6"
          lineWidth={1}
          transparent
          opacity={0.4}
        />
      )}
    </>
  );
}
