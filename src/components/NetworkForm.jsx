// src/components/NetworkForm.jsx
import React, { useState } from "react";

function NetworkForm({ onSubmit }) {
  const [layers, setLayers] = useState([3, 5, 2]);

  const getTotalNeurons = (arr) => arr.reduce((a, b) => a + b, 0);

  const handleChange = (index, value) => {
    const parsed = parseInt(value) || 0;
    const newLayers = [...layers];

    if (parsed < 1) {
      const confirmRemove = window.confirm(
        `Neurons in Layer ${index + 1} is less than 1. Do you want to remove this layer?`
      );
      if (confirmRemove) {
        removeLayer(index);
        return;
      } else {
        return;
      }
    }

    newLayers[index] = parsed;
    if (getTotalNeurons(newLayers) <= 250) {
      setLayers(newLayers);
      onSubmit(newLayers);
    } else {
      alert("Total neurons cannot exceed 250.");
    }
  };

  const addLayer = () => {
    const currentTotal = getTotalNeurons(layers);
    if (currentTotal + 1 <= 250) {
      const newLayers = [...layers, 1];
      setLayers(newLayers);
      onSubmit(newLayers);
    } else {
      alert("Cannot add more neurons. Total neuron limit is 250.");
    }
  };

  const removeLayer = (index) => {
    if (layers.length > 1) {
      const newLayers = layers.filter((_, i) => i !== index);
      setLayers(newLayers);
      onSubmit(newLayers);
    }
  };

  const moveLayer = (from, to) => {
    if (to < 0 || to >= layers.length) return;
    const newLayers = [...layers];
    const [moved] = newLayers.splice(from, 1);
    newLayers.splice(to, 0, moved);
    setLayers(newLayers);
    onSubmit(newLayers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(layers);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Define Neural Network Structure</h3>
      {layers.map((neurons, index) => (
        <div key={index} style={{ marginBottom: "0.5rem" }}>
          <label>Layer {index + 1} Neurons:</label>
          <input
            type="number"
            value={neurons}
            min="1"
            onChange={(e) => handleChange(index, e.target.value)}
          />
          <button type="button" onClick={() => removeLayer(index)}>
            Remove
          </button>
          <button
            type="button"
            onClick={() => moveLayer(index, index - 1)}
            disabled={index === 0}
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => moveLayer(index, index + 1)}
            disabled={index === layers.length - 1}
          >
            ↓
          </button>
        </div>
      ))}

      <button type="button" onClick={addLayer}>
        Add Layer
      </button>
      <button type="submit">Update Network</button>

      {/* Save to JSON */}
      <button
        type="button"
        onClick={() => {
          const blob = new Blob([JSON.stringify({ layers }, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "network.json";
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        Save Architecture
      </button>
      <br />
      Load Architecture
      <input
        type="file"
        accept="application/json"
        style={{ display: "block", marginTop: "1rem" }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const json = JSON.parse(event.target.result);
              if (
                Array.isArray(json.layers) &&
                json.layers.every((n) => Number.isInteger(n) && n > 0)
              ) {
                setLayers(json.layers);
                onSubmit(json.layers);
              } else {
                alert("Invalid architecture format.");
              }
            } catch (err) {
              alert("Failed to parse JSON.");
            }
          };
          reader.readAsText(file);
        }}
      />
    </form>
  );
}

export default NetworkForm;
