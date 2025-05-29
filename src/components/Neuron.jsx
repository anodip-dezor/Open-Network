import React from 'react';

function Neuron({ position, bias }) {

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.15 + (bias ?? 0) * 0.01, 32, 32]} />
      <meshStandardMaterial color="#482957" />
    </mesh>
  );
}


export default Neuron;
