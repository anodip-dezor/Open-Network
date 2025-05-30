import React, { useEffect, useMemo } from 'react';
import Neuron from './Neuron';
import Connection from './Connection';

function NeuralNetwork({ layers, weights = null, biases = null, setCenter }) {
  const layerSpacing = 2.5;
  const neuronSpacing = 0.8;

  const positions = useMemo(() => {
    const result = [];

    layers.forEach((layer, layerIdx) => {
      const layerPositions = [];
      const numNeurons = layer.neurons || 1; // default to 1 if not set
      const yOffset = ((numNeurons - 1) * neuronSpacing) / 2;

      for (let i = 0; i < numNeurons; i++) {
        const x = layerIdx * layerSpacing;
        const y = i * neuronSpacing - yOffset;
        layerPositions.push([x, y, 0]);
      }

      result.push(layerPositions);
    });

    return result;
  }, [layers]);

  useEffect(() => {
    const centerLayerIndex = Math.floor(positions.length / 2);
    const centerNeurons = positions[centerLayerIndex];
    const centerNeuron = centerNeurons[Math.floor(centerNeurons.length / 2)];
    if (centerNeuron && setCenter) {
      setCenter(centerNeuron);
    }
  }, [positions, setCenter]);

  return (
    <>
      {positions.map((layer, i) =>
        layer.map((pos, j) => (
          <Neuron key={`n-${i}-${j}`} position={pos} bias={biases?.[i]?.[j]} />
        ))
      )}
      {positions.slice(0, -1).map((layer, i) =>
        layer.flatMap((start, si) =>
          positions[i + 1].map((end, ei) => (
            <Connection
              key={`c-${i}-${si}-${ei}`}
              start={start}
              end={end}
              weight={weights?.[i]?.[si]?.[ei] ?? Math.random()}
            />
          ))
        )
      )}
    </>
  );
}

export default NeuralNetwork;
