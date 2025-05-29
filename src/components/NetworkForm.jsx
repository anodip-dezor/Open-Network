// src/components/NetworkForm.jsx
import React, { useState } from 'react';

function NetworkForm({ onSubmit }) {
  const [layers, setLayers] = useState([3, 5, 2]); // Default layers

  const handleChange = (index, value) => {
    const newLayers = [...layers];
    newLayers[index] = parseInt(value) || 0;
    setLayers(newLayers);
  };

  const addLayer = () => {
    setLayers([...layers, 1]);
    onSubmit(layers);
  };

  const removeLayer = (index) => {
    if (layers.length > 1) {
      const newLayers = layers.filter((_, i) => i !== index);
      setLayers(newLayers);
      onSubmit(layers);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(layers);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Define Neural Network Structure</h3>
      {layers.map((neurons, index) => (
        <div key={index}>
          <label>Layer {index + 1} Neurons:</label>
          <input
            type="number"
            value={neurons}
            min="1"
            onChange={(e) => handleChange(index, e.target.value)}
          />
          <button type="button" onClick={() => removeLayer(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={addLayer}>Add Layer</button>
      <button type="submit">Update Network</button>
    </form>
  );
}

export default NetworkForm;
