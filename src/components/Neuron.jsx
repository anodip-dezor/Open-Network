import React from 'react';

function Neuron({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial color="#482957" />
    </mesh>
  );
}

export default Neuron;
