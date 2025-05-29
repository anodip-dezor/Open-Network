import React, { useState, useRef } from "react";
import NetworkForm from "./components/NetworkForm";
import NeuralNetwork from "./components/NeuralNetwork";
import TrainingAnimation from "./components/TrainingAnimation";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import "./index.css";

function App() {
  const [layers, setLayers] = useState([3, 5, 2]);
  const controlRef = useRef();
  const centerNeuronRef = useRef([0, 0, 0]); // default

  return (
    <div className="app">
      <div className="controls">
        <NetworkForm onSubmit={setLayers} />
      </div>
      <Canvas
        style={{ background: "black" }}
        camera={{ position: [0, 0, 10], fov: 50 }}
      >
        {/* Tetrahedral lights */}
        <pointLight intensity={10000.3} position={[40, 40, 40]} />
        <pointLight intensity={5000.3} position={[-40, -40, 40]} />
        <pointLight intensity={10000.3} position={[-40, 40, -40]} />
        <pointLight intensity={5000.3} position={[40, -40, -40]} />

        <Grid
          args={[100, 100]}
          sectionColor={"#555"}
          position={[0, -3, 0]} // ⬅️ Move grid 3 units down
          // rotation={[-Math.PI / 2, 0, 0]} // ⬅️ Rotate to be flat on the XZ plane
        />

        {/* Orbit controls locked to center neuron */}
        <OrbitControls ref={controlRef} target={centerNeuronRef.current} />

        <NeuralNetwork
          layers={layers}
          setCenter={(pos) => {
            centerNeuronRef.current = pos;
            if (controlRef.current) {
              controlRef.current.target.set(...pos);
            }
          }}
        />

        <TrainingAnimation />
      </Canvas>
    </div>
  );
}

export default App;
