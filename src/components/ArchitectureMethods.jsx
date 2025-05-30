import React from "react";

const ArchitectureMethods = ({ layers, setLayers }) => {
  const saveToFile = () => {
    const json = JSON.stringify(layers, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "model-architecture.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (Array.isArray(parsed)) {
          setLayers(parsed);
        } else {
          alert("Invalid file format.");
        }
      } catch (err) {
        alert("Error loading file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="architecture-methods" style={{ marginTop: "1rem" }}>
      <button onClick={saveToFile}>💾 Save Architecture</button>
      <label style={{ cursor: "pointer", display: "block", marginTop: "0.5rem" }}>
        📂 Load Architecture
        <input
          type="file"
          accept="application/json"
          onChange={loadFromFile}
          style={{ display: "none" }}
        />
      </label>
    </div>
  );
};

export default ArchitectureMethods;
