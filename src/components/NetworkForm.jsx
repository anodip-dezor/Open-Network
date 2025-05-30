import React, { useState } from "react";
import { FaPen } from "react-icons/fa";

function NetworkForm({ layers, setLayers }) {
  const [title, setTitle] = useState("Define Neural Network Structure");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [layerNames, setLayerNames] = useState(
    layers.map((_, i) => `Layer ${i + 1}`)
  );
  const [editingLayerIndex, setEditingLayerIndex] = useState(null);

  const getTotalNeurons = (arr) => arr.reduce((a, b) => a + b, 0);

  const handleChange = (index, value) => {
    const parsed = parseInt(value) || 0;
    const newLayers = [...layers];

    if (parsed < 1) {
      const confirmRemove = window.confirm(
        `Neurons in ${layerNames[index]} is less than 1. Do you want to remove this layer?`
      );
      if (confirmRemove) {
        removeLayer(index);
      }
      return;
    }

    newLayers[index] = parsed;
    if (getTotalNeurons(newLayers) <= 250) {
      setLayers(newLayers);
    } else {
      alert("Total neurons cannot exceed 250.");
    }
  };

  const addLayer = () => {
    const currentTotal = getTotalNeurons(layers);
    if (currentTotal + 1 <= 250) {
      setLayers([...layers, 1]);
      setLayerNames([...layerNames, `Layer ${layerNames.length + 1}`]);
    } else {
      alert("Cannot add more neurons. Total neuron limit is 250.");
    }
  };

  const removeLayer = (index) => {
    if (layers.length > 1) {
      setLayers(layers.filter((_, i) => i !== index));
      setLayerNames(layerNames.filter((_, i) => i !== index));
    }
  };

  const moveLayer = (from, to) => {
    if (to < 0 || to >= layers.length) return;

    const newLayers = [...layers];
    const newNames = [...layerNames];

    const [movedNeuron] = newLayers.splice(from, 1);
    const [movedName] = newNames.splice(from, 1);

    newLayers.splice(to, 0, movedNeuron);
    newNames.splice(to, 0, movedName);

    setLayers(newLayers);
    setLayerNames(newNames);
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleLayerNameChange = (index, value) => {
    const newNames = [...layerNames];
    newNames[index] = value;
    setLayerNames(newNames);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
          />
        ) : (
          <>
            <h3>{title}</h3>
            <button type="button" onClick={handleTitleEdit}>
              <FaPen/>
            </button>
          </>
        )}
      </div>

      {layers.map((neurons, index) => (
        <div key={index} style={{ marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            {editingLayerIndex === index ? (
              <input
                type="text"
                value={layerNames[index]}
                autoFocus
                onChange={(e) => handleLayerNameChange(index, e.target.value)}
                onBlur={() => setEditingLayerIndex(null)}
                onKeyDown={(e) => e.key === "Enter" && setEditingLayerIndex(null)}
              />
            ) : (
              <>
                <label>{layerNames[index]}:</label>
                <button type="button" onClick={() => setEditingLayerIndex(index)}>
                  <FaPen/>
                </button>
              </>
            )}
          </div>
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

      <button
        type="button"
        onClick={() => {
          const blob = new Blob(
            [JSON.stringify({ title, layers, layerNames }, null, 2)],
            { type: "application/json" }
          );
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
                if (Array.isArray(json.layerNames)) {
                  setLayerNames(json.layerNames);
                } else {
                  setLayerNames(json.layers.map((_, i) => `Layer ${i + 1}`));
                }
                if (typeof json.title === "string") {
                  setTitle(json.title);
                }
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
