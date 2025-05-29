import React from 'react';
import Neuron from './Neuron';
import Connection from './Connection';

function NeuralNetwork({ layers }) {
  const layerSpacing = 4;
  const neuronSpacing = 1.5;

  // Calculate neuron positions
  const neuronPositions = layers.map((count, layerIndex) => {
    const yOffset = (count - 1) * neuronSpacing * 0.5;
    return Array.from({ length: count }, (_, i) => ({
      position: [
        layerIndex * layerSpacing,
        yOffset - i * neuronSpacing,
        0,
      ],
    }));
  });

  return (
    <>
      {/* Render neurons */}
      {neuronPositions.map((layer, layerIndex) =>
        layer.map((neuron, neuronIndex) => (
          <Neuron
            key={`neuron-${layerIndex}-${neuronIndex}`}
            position={neuron.position}
          />
        ))
      )}

      {/* Render connections */}
      {neuronPositions.slice(0, -1).map((layer, layerIndex) =>
        layer.map((fromNeuron, fromIndex) =>
          neuronPositions[layerIndex + 1].map((toNeuron, toIndex) => (
            <Connection
              key={`conn-${layerIndex}-${fromIndex}-${toIndex}`}
              start={fromNeuron.position}
              end={toNeuron.position}
              weight={Math.random()} // Replace with actual weight
            />
          ))
        )
      )}
    </>
  );
}

export default NeuralNetwork;
