import React, { useState, useRef } from "react";
import NetworkForm from "./components/NetworkForm";
import NeuralNetwork from "./components/NeuralNetwork";
import TrainingAnimation from "./components/TrainingAnimation";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import "./index.css";
// import { saveNetwork, loadNetwork } from "./utils/storage";

function RotatingGroup({ children }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0001;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

function App() {
  const [layers, setLayers] = useState([3, 5, 2]);
  const [weights, setWeights] = useState(null);
  const [biases, setBiases] = useState(null);
  const controlRef = useRef();
  const centerNeuronRef = useRef([0, 0, 0]);
  const groupRef = useRef(); // for auto-rotation

  // const handleSave = () => {
  //   saveNetwork({ layers, weights, biases });
  // };

  // const handleLoad = (e) => {
  //   loadNetwork(e.target.files[0], ({ layers, weights, biases }) => {
  //     setLayers(layers);
  //     setWeights(weights);
  //     setBiases(biases);
  //   });
  // };

  return (
    <div className="app">
      <div className="controls">
        <NetworkForm onSubmit={setLayers} />
        {/* <button onClick={handleSave}>Save</button> */}
        {/* <input type="file" accept=".json" onChange={handleLoad} /> */}
      </div>
      <Canvas
        style={{ background: "black" }}
        camera={{ position: [0, 0, 10], fov: 50 }}
      >
        {/* Lights */}
        <pointLight intensity={10000.3} position={[40, 40, 40]} />
        <pointLight intensity={5000.3} position={[-40, -40, 40]} />
        <pointLight intensity={10000.3} position={[-40, 40, -40]} />
        <pointLight intensity={5000.3} position={[40, -40, -40]} />

        <OrbitControls ref={controlRef} target={centerNeuronRef.current} />

        <RotatingGroup>
        <Grid args={[100, 100]} sectionColor={"#555555"} position={[0, -3, 0]} />
          <NeuralNetwork
            layers={layers}
            weights={weights}
            biases={biases}
            setCenter={(pos) => {
              centerNeuronRef.current = pos;
              if (controlRef.current) {
                controlRef.current.target.set(...pos);
              }
            }}
          />
          <TrainingAnimation />
        </RotatingGroup>
      </Canvas>
    </div>
  );
}

export default App;
