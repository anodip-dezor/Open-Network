// src/App.jsx
import React, { useState } from 'react';
import NetworkForm from './components/NetworkForm';
import NeuralNetwork from './components/NeuralNetwork';
import TrainingAnimation from './components/TrainingAnimation';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './index.css';

function App() {
  const [layers, setLayers] = useState([3, 5, 2]);

  return (
    <div className="app">
      <div className="controls">
        <NetworkForm onSubmit={setLayers} />
      </div>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <NeuralNetwork layers={layers} />
        <TrainingAnimation layers={layers} />
      </Canvas>
    </div>
  );
}

export default App;
