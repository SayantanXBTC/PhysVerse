import { OrbitControls } from '@react-three/drei';

// Enhanced orbit controls component for use inside Canvas
export function EnhancedOrbitControls() {
  return (
    <OrbitControls
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      panSpeed={0.5}
      minDistance={5}
      maxDistance={50}
      makeDefault
    />
  );
}
