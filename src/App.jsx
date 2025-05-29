// src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import NetworkForm from "./components/NetworkForm";
import NeuralNetwork from "./components/NeuralNetwork";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import LensFlareEffect from "./components/LensFlareEffect";
import ContextMenu from "./components/ContextMenu";
import "./index.css";

function RotatingGroup({ children }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.00025;
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
  const [contextMenu, setContextMenu] = useState(null);

  const handleRightClick = (e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleContextAction = (action) => {
    switch (action) {
      case "Add Layer":
        if (layers.reduce((a, b) => a + b, 0) < 250) {
          setLayers([...layers, 1]);
        }
        break;
      case "Remove Layer":
        if (layers.length > 1) {
          setLayers(layers.slice(0, -1));
        }
        break;
      case "Edit Layer": {
        const index = prompt(`Which layer to edit? (1-${layers.length})`);
        const count = prompt(`Enter new neuron count for Layer ${index}:`);
        const i = parseInt(index) - 1;
        const n = parseInt(count);
        if (i >= 0 && i < layers.length && n > 0) {
          const newLayers = [...layers];
          newLayers[i] = n;
          setLayers(newLayers);
        }
        break;
      }
      case "New Project":
        if (window.confirm("Start a new project? This will reset layers.")) {
          setLayers([3, 5, 2]);
          setWeights(null);
          setBiases(null);
        }
        break;
      default:
        break;
    }
    setContextMenu(null); // close after action
  };

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    const handleEscape = (e) => e.key === "Escape" && setContextMenu(null);
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="app" onContextMenu={handleRightClick} style={{ position: "relative" }}>
      <div className="controls">
        <NetworkForm layers={layers} setLayers={setLayers} />

      </div>

      <Canvas
        style={{ background: "black" }}
        camera={{ position: [0, 0, 10], fov: 50 }}
      >
        {/* Lights for immersive effect */}
        <pointLight intensity={1500} position={[40, 40, 40]} color="white" />
        <pointLight intensity={1500} position={[-40, -40, 40]} color="cyan" />
        <pointLight intensity={1500} position={[-40, 40, -40]} color="magenta" />
        <pointLight intensity={1500} position={[40, -40, -40]} color="blue" />

        <LensFlareEffect />
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
        </RotatingGroup>
      </Canvas>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          position={contextMenu}
          onAction={handleContextAction}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

export default App;
