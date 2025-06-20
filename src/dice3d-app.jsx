
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';

function Dice({ id }) {
  return (
    <RigidBody colliders="cuboid" restitution={0.6} friction={0.5}>
      <mesh position={[Math.random() * 2 - 1, 2 + Math.random() * 2, Math.random() * 2 - 1]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </RigidBody>
  );
}

export default function Dice3DApp() {
  const [diceCount, setDiceCount] = useState(1);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let threshold = 15;

    function handleMotion(event) {
      const acc = event.accelerationIncludingGravity;
      const delta = Math.abs(acc.x - lastX) + Math.abs(acc.y - lastY) + Math.abs(acc.z - lastZ);

      if (delta > threshold) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }

      lastX = acc.x;
      lastY = acc.y;
      lastZ = acc.z;
    }

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{ textAlign: 'center', padding: 10 }}>
        <button onClick={() => setDiceCount(Math.max(1, diceCount - 1))}>-</button>
        <span style={{ fontSize: 24, margin: '0 10px' }}>🎲 {diceCount}</span>
        <button onClick={() => setDiceCount(Math.min(10, diceCount + 1))}>+</button>
      </div>
      <Canvas shadows camera={{ position: [0, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} castShadow />
        <Physics gravity={[0, -9.81, 0]}>
          <RigidBody type="fixed">
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[10, 10]} />
              <meshStandardMaterial color="#444" />
            </mesh>
          </RigidBody>
          {Array.from({ length: diceCount }).map((_, i) => (
            <Dice key={i} id={i} />
          ))}
        </Physics>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
