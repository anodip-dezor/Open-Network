import React from 'react';

function Neuron({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="#00aaff" />
    </mesh>
  );
}

export default Neuron;
