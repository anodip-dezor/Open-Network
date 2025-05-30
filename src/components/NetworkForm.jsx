import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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

  const handleLayerNameChange = (index, value) => {
    const newNames = [...layerNames];
    newNames[index] = value;
    setLayerNames(newNames);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const from = result.source.index;
    const to = result.destination.index;

    const newLayers = [...layers];
    const newNames = [...layerNames];

    const [movedLayer] = newLayers.splice(from, 1);
    const [movedName] = newNames.splice(from, 1);

    newLayers.splice(to, 0, movedLayer);
    newNames.splice(to, 0, movedName);

    setLayers(newLayers);
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
            <button
              type="button"
              onClick={() => setIsEditingTitle(true)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <FaPen />
            </button>
          </>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="layers">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {layers.map((neurons, index) => (
                <Draggable
                  key={index}
                  draggableId={`layer-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        marginBottom: "0.5rem",
                        padding: "0.5rem",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        background: "#f9f9f9",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        {editingLayerIndex === index ? (
                          <input
                            type="text"
                            value={layerNames[index]}
                            autoFocus
                            onChange={(e) =>
                              handleLayerNameChange(index, e.target.value)
                            }
                            onBlur={() => setEditingLayerIndex(null)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && setEditingLayerIndex(null)
                            }
                          />
                        ) : (
                          <>
                            <label>{layerNames[index]}:</label>
                            <button
                              type="button"
                              onClick={() => setEditingLayerIndex(index)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              <FaPen size={12} />
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
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button type="button" onClick={addLayer}>
        Add Layer
      </button>

      {/* Local Settings Section */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          border: "1px solid #aaa",
          borderRadius: "6px",
          background: "#f0f0f0",
        }}
      >
        <h4>Layer Setting</h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
          }}
        >
          <label>
            Filter
            <input type="number" defaultValue={15} />
          </label>
          <label>
            Padding
            <input type="number" defaultValue={15} />
          </label>
          <label>
            Kernel
            <input type="number" defaultValue={15} />
          </label>
          <label>
            Strides
            <input type="number" defaultValue={15} />
          </label>
          <label>
            Activation
            <select defaultValue="relu">
              <option value="relu">ReLU (Rectified Linear Unit)</option>
              <option value="sigmoid">Sigmoid</option>
              <option value="tanh">Tanh</option>
              <option value="softmax">Softmax</option>
            </select>
          </label>
          <label>
            Regularization
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <select defaultValue="l2">
                <option value="l2">L2 Ridge</option>
                <option value="l1">L1 Lasso</option>
              </select>
              <input type="number" step="0.01" defaultValue={0.1} />
            </div>
          </label>
          <label>
            Bias Initializer
            <select defaultValue="xavier">
              <option value="xavier">Xavier Initializer</option>
              <option value="he">He Initializer</option>
              <option value="zero">Zero</option>
            </select>
          </label>
          <label>
            Skip Connection
            <input type="text" placeholder="#3" />
            <input type="text" placeholder="#5" />
          </label>
        </div>

        {/* Keep existing Save/Load buttons below */}
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

        <div style={{ marginTop: "1rem" }}>
          <label>Load Architecture</label>
          <input
            type="file"
            accept="application/json"
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
                      setLayerNames(
                        json.layers.map((_, i) => `Layer ${i + 1}`)
                      );
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
        </div>
      </div>
    </form>
  );
}

export default NetworkForm;
