import React, { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaPen } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import ArchitectureMethods from "./ArchitectureMethods";


function SortableItem({
  id,
  index,
  layer,
  name,
  onChange,
  onRemove,
  onRename,
  onSelect,
  onToggleSettings,
  isSelected,
  settingsOpen,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "0.5rem",
    padding: "0.5rem",
    border: isSelected ? "2px solid #007bff" : "1px solid #ccc",
    borderRadius: "5px",
    background: isSelected ? "#e7f1ff" : "#f9f9f9",
    cursor: "pointer",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onSelect(index)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
        <label>{name}:</label>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRename(index);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          title="Rename Layer"
        >
          <FaPen size={12} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSettings(index);
          }}
          style={{
            background: settingsOpen ? "#007bff" : "none",
            color: settingsOpen ? "white" : "black",
            border: "1px solid #007bff",
            borderRadius: "3px",
            cursor: "pointer",
            padding: "0 6px",
            fontSize: "0.8rem",
            marginLeft: "auto",
          }}
          title="Toggle Settings"
        >
          ⚙
        </button>
      </div>
      <input
        type="number"
        value={layer.neurons}
        min="1"
        onChange={(e) => onChange(index, e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
      >
        Remove
      </button>
    </div>
  );
}

function NetworkForm({ layers, setLayers }) {
  const [title, setTitle] = useState("Define Neural Network Structure");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [layerNames, setLayerNames] = useState(
    layers.map((_, i) => `Layer ${i + 1}`)
  );
  const [editingLayerIndex, setEditingLayerIndex] = useState(null);
  const [ids, setIds] = useState(layers.map(() => uuidv4()));
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(1);
  const [settingsOpenIndex, setSettingsOpenIndex] = useState(1);

  // Initialize skipConnections state synced with layers
  const [skipConnections, setSkipConnections] = useState(
    layers.map((layer) => layer.skipConnections || ["", ""])
  );

  // Sync layerNames, ids, skipConnections length with layers length
  useEffect(() => {
    setLayerNames((names) => {
      const newNames = [...names];
      while (newNames.length < layers.length) {
        newNames.push(`Layer ${newNames.length + 1}`);
      }
      while (newNames.length > layers.length) {
        newNames.pop();
      }
      return newNames;
    });
    setIds((oldIds) => {
      const newIds = [...oldIds];
      while (newIds.length < layers.length) {
        newIds.push(uuidv4());
      }
      while (newIds.length > layers.length) {
        newIds.pop();
      }
      return newIds;
    });
    setSkipConnections((oldSkipConns) => {
      const newSkipConns = [...oldSkipConns];
      while (newSkipConns.length < layers.length) {
        newSkipConns.push(["", ""]);
      }
      while (newSkipConns.length > layers.length) {
        newSkipConns.pop();
      }
      return newSkipConns;
    });

    if (selectedLayerIndex !== null && selectedLayerIndex >= layers.length) {
      setSelectedLayerIndex(null);
      setSettingsOpenIndex(null);
    }
  }, [layers, selectedLayerIndex]);

  const getTotalNeurons = (arr) => arr.reduce((a, b) => a + b.neurons, 0);

  const defaultLayer = () => ({
    neurons: 1,
    filter: 15,
    padding: 15,
    kernel: 15,
    strides: 15,
    activation: "relu",
    regularization: { type: "l2", value: 0.1 },
    biasInitializer: "xavier",
    skipConnections: ["", ""],
  });

  const handleChange = (index, value) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) return;

    if (parsed < 1) {
      const confirmRemove = window.confirm(
        `Neurons in ${layerNames[index]} is less than 1. Remove layer?`
      );
      if (confirmRemove) {
        removeLayer(index);
      }
      return;
    }

    const newLayers = [...layers];
    newLayers[index].neurons = parsed;

    if (getTotalNeurons(newLayers) <= 250) {
      setLayers(newLayers);
    } else {
      alert("Total neurons cannot exceed 250.");
    }
  };

  const addLayer = () => {
    const currentTotal = getTotalNeurons(layers);
    if (currentTotal + 1 <= 250) {
      setLayers([...layers, defaultLayer()]);
      setLayerNames([...layerNames, `Layer ${layerNames.length + 1}`]);
      setIds([...ids, uuidv4()]);
      setSkipConnections([...skipConnections, ["", ""]]);
    } else {
      alert("Cannot add more neurons. Total neuron limit is 250.");
    }
  };

  const removeLayer = (index) => {
    if (layers.length > 1) {
      setLayers(layers.filter((_, i) => i !== index));
      setLayerNames(layerNames.filter((_, i) => i !== index));
      setIds(ids.filter((_, i) => i !== index));
      setSkipConnections(skipConnections.filter((_, i) => i !== index));
      if (selectedLayerIndex === index) {
        setSelectedLayerIndex(null);
        setSettingsOpenIndex(null);
      } else if (selectedLayerIndex > index) {
        setSelectedLayerIndex(selectedLayerIndex - 1);
      }
    }
  };

  const handleLayerNameChange = (index, value) => {
    const newNames = [...layerNames];
    newNames[index] = value;
    setLayerNames(newNames);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);

    setIds((items) => arrayMove(items, oldIndex, newIndex));
    setLayers((items) => arrayMove(items, oldIndex, newIndex));
    setLayerNames((items) => arrayMove(items, oldIndex, newIndex));
    setSkipConnections((items) => arrayMove(items, oldIndex, newIndex));

    // Adjust selectedLayerIndex and settingsOpenIndex if needed
    if (selectedLayerIndex === oldIndex) {
      setSelectedLayerIndex(newIndex);
    } else if (
      selectedLayerIndex >= Math.min(oldIndex, newIndex) &&
      selectedLayerIndex <= Math.max(oldIndex, newIndex)
    ) {
      if (oldIndex < newIndex) {
        setSelectedLayerIndex((idx) => (idx === oldIndex ? newIndex : idx - 1));
      } else {
        setSelectedLayerIndex((idx) => (idx === oldIndex ? newIndex : idx + 1));
      }
    }
    if (settingsOpenIndex === oldIndex) {
      setSettingsOpenIndex(newIndex);
    } else if (
      settingsOpenIndex >= Math.min(oldIndex, newIndex) &&
      settingsOpenIndex <= Math.max(oldIndex, newIndex)
    ) {
      if (oldIndex < newIndex) {
        setSettingsOpenIndex((idx) => (idx === oldIndex ? newIndex : idx - 1));
      } else {
        setSettingsOpenIndex((idx) => (idx === oldIndex ? newIndex : idx + 1));
      }
    }
  };

  const toggleSettings = (index) => {
    // Toggle settings for clicked layer. Close if same layer clicked.
    setSettingsOpenIndex((current) => (current === index ? null : index));
    setSelectedLayerIndex(index); // also select the layer
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {/* Title with rename */}
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
              title="Rename Title"
            >
              <FaPen />
            </button>
          </>
        )}
      </div>

      {/* Drag and drop layers */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {layers.map((layer, index) => (
            <div key={ids[index]}>
              {editingLayerIndex === index ? (
                <input
                  type="text"
                  value={layerNames[index]}
                  autoFocus
                  onChange={(e) => handleLayerNameChange(index, e.target.value)}
                  onBlur={() => setEditingLayerIndex(null)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setEditingLayerIndex(null)
                  }
                />
              ) : (
                <SortableItem
                  id={ids[index]}
                  index={index}
                  layer={layer}
                  name={layerNames[index]}
                  onChange={handleChange}
                  onRemove={removeLayer}
                  onRename={setEditingLayerIndex}
                  onSelect={setSelectedLayerIndex}
                  onToggleSettings={toggleSettings}
                  isSelected={selectedLayerIndex === index}
                  settingsOpen={settingsOpenIndex === index}
                />
              )}
            </div>
          ))}
        </SortableContext>
      </DndContext>

      <button type="button" onClick={addLayer} style={{ marginTop: "1rem" }}>
        Add Layer
      </button>

      {/* Settings panel outside and below the layers list */}
      {settingsOpenIndex !== null && layers[settingsOpenIndex] && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px solid #aaa",
            borderRadius: "6px",
            background: "#f0f0f0",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h4>Layer Settings for {layerNames[settingsOpenIndex]}</h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
            }}
          >
            {["filter", "padding", "kernel", "strides"].map((field) => (
              <label key={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
                <input
                  type="number"
                  value={layers[settingsOpenIndex][field]}
                  onChange={(e) => {
                    const newLayers = [...layers];
                    newLayers[settingsOpenIndex][field] = parseInt(
                      e.target.value,
                      10
                    );
                    setLayers(newLayers);
                  }}
                  min="0"
                />
              </label>
            ))}

            <label>
              Activation
              <select
                value={layers[settingsOpenIndex].activation}
                onChange={(e) => {
                  const newLayers = [...layers];
                  newLayers[settingsOpenIndex].activation = e.target.value;
                  setLayers(newLayers);
                }}
              >
                <option value="relu">ReLU</option>
                <option value="sigmoid">Sigmoid</option>
                <option value="tanh">Tanh</option>
                <option value="softmax">Softmax</option>
              </select>
            </label>

            <label>
              Bias Initializer
              <select
                value={layers[settingsOpenIndex].biasInitializer}
                onChange={(e) => {
                  const newLayers = [...layers];
                  newLayers[settingsOpenIndex].biasInitializer = e.target.value;
                  setLayers(newLayers);
                }}
              >
                <option value="xavier">Xavier</option>
                <option value="he">He</option>
                <option value="random">Random</option>
              </select>
            </label>

            <label>
              Regularization Type
              <select
                value={layers[settingsOpenIndex].regularization.type}
                onChange={(e) => {
                  const newLayers = [...layers];
                  newLayers[settingsOpenIndex].regularization.type =
                    e.target.value;
                  setLayers(newLayers);
                }}
              >
                <option value="l1">L1</option>
                <option value="l2">L2</option>
                <option value="none">None</option>
              </select>
            </label>

            <label>
              Regularization Value
              <input
                type="number"
                step="0.01"
                value={layers[settingsOpenIndex].regularization.value}
                onChange={(e) => {
                  const newLayers = [...layers];
                  newLayers[settingsOpenIndex].regularization.value =
                    parseFloat(e.target.value);
                  setLayers(newLayers);
                }}
                min="0"
              />
            </label>
          </div>

          {/* Skip Connections */}
          <div style={{ marginTop: "1rem" }}>
            <label>Skip Connections:</label>
            {(skipConnections[settingsOpenIndex] || ["", ""]).map((val, i) => (
              <input
                key={i}
                type="text"
                value={val}
                onChange={(e) => {
                  const newSkipConns = [...skipConnections];
                  newSkipConns[settingsOpenIndex][i] = e.target.value;
                  setSkipConnections(newSkipConns);

                  // Optional: Sync with layers as well if needed
                  const newLayers = [...layers];
                  if (!newLayers[settingsOpenIndex].skipConnections) {
                    newLayers[settingsOpenIndex].skipConnections = ["", ""];
                  }
                  newLayers[settingsOpenIndex].skipConnections[i] =
                    e.target.value;
                  setLayers(newLayers);
                }}
              />
            ))}
          </div>
        </div>
      )}
      <ArchitectureMethods layers={layers} setLayers={setLayers} />

    </form>
  );
}

export default NetworkForm;
