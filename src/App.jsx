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
  const [layers, setLayers] = useState([
            {
              id: 1,
              name: "Layer 1",
              neurons: 3,
              filter: 25,
              kernel: 25,
              padding: 25,
              strides: 25,
              activation: "relu",
              regularization: { type: "l2", value: 0.1 },
              biasInit: "xavier",
              skip: [],
            },
            {
              id: 2,
              name: "Layer 2",
              neurons: 5,
              filter: 15,
              kernel: 15,
              padding: 15,
              strides: 15,
              activation: "relu",
              regularization: { type: "l2", value: 0.1 },
              biasInit: "xavier",
              skip: [],
            },
            {
              id: 3,
              name: "Layer 3",
              neurons: 2,
              filter: 35,
              kernel: 35,
              padding: 35,
              strides: 35,
              activation: "relu",
              regularization: { type: "l2", value: 0.1 },
              biasInit: "xavier",
              skip: [],
            },
          ]);

  const [selectedLayerIndex, setSelectedLayerIndex] = useState(2);
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
        if (layers.length < 250) {
          const newLayer = {
            id: layers.length + 1,
            name: `Layer ${layers.length + 1}`,
            neurons: 4,
            filter: 15,
            kernel: 15,
            padding: 15,
            strides: 15,
            activation: "relu",
            regularization: { type: "l2", value: 0.1 },
            biasInit: "xavier",
            skip: [],
          };
          setLayers([...layers, newLayer]);
        }
        break;

      case "Remove Layer":
        if (layers.length > 1) {
          setLayers(layers.slice(0, -1));
        }
        break;

      case "Edit Layer": {
        const index = parseInt(prompt(`Which layer to edit? (1-${layers.length})`), 10);
        const count = parseInt(prompt(`Enter new neuron count for Layer ${index}:`), 10);
        if (index > 0 && index <= layers.length && count > 0) {
          const newLayers = [...layers];
          newLayers[index - 1] = {
            ...newLayers[index - 1],
            neurons: count,
          };
          setLayers(newLayers);
        }
        break;
      }

      case "New Project":
        if (window.confirm("Start a new project? This will reset layers.")) {
          setLayers([
            {
              id: 1,
              name: "Layer 1",
              neurons: 3,
              filter: 25,
              kernel: 25,
              padding: 25,
              strides: 25,
              activation: "relu",
              regularization: { type: "l2", value: 0.1 },
              biasInit: "xavier",
              skip: [],
            },
            {
              id: 2,
              name: "Layer 2",
              neurons: 5,
              filter: 15,
              kernel: 15,
              padding: 15,
              strides: 15,
              activation: "relu",
              regularization: { type: "l2", value: 0.1 },
              biasInit: "xavier",
              skip: [],
            },
            {
              id: 3,
              name: "Layer 3",
              neurons: 2,
              filter: 35,
              kernel: 35,
              padding: 35,
              strides: 35,
              activation: "relu",
              regularization: { type: "l2", value: 0.1 },
              biasInit: "xavier",
              skip: [],
            },
          ]);
          setWeights(null);
          setBiases(null);
          setSelectedLayerIndex(null);
        }
        break;

      default:
        break;
    }

    setContextMenu(null); // close menu
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
    <div className="app" style={{ position: "relative" }}>
      <div className="controls">
        <NetworkForm
          layers={layers}
          setLayers={setLayers}
          selectedLayerIndex={selectedLayerIndex}
          setSelectedLayerIndex={setSelectedLayerIndex}
        />
      </div>

      <Canvas
        onContextMenu={handleRightClick}
        style={{ background: "black" }}
        camera={{ position: [0, 0, 10], fov: 50 }}
      >
        <LensFlareEffect />
        <OrbitControls ref={controlRef} target={centerNeuronRef.current} />

        <RotatingGroup>
          <Grid
            args={[100, 100]}
            sectionColor={"#555555"}
            position={[0, -3, 0]}
          />
          <NeuralNetwork
            layers={layers}
            weights={weights}
            biases={biases}
            selectedLayerIndex={selectedLayerIndex}
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
