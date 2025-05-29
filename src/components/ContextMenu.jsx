// src/components/ContextMenu.jsx
import React from "react";

const ContextMenu = ({ position, onAction }) => {
  const menuStyle = {
    position: "absolute",
    top: position.y,
    left: position.x,
    background: "#1a1a1a",
    color: "#fff",
    padding: "8px",
    borderRadius: "6px",
    boxShadow: "0 0 12px rgba(0,0,0,0.5)",
    zIndex: 9999,
  };

  const options = ["Add Layer", "Remove Layer", "Edit Layer", "New Project"];

  return (
    <div style={menuStyle}>
      {options.map((option) => (
        <div
          key={option}
          style={{ padding: "6px 10px", cursor: "pointer", whiteSpace: "nowrap" }}
          onClick={() => onAction(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default ContextMenu;
