export function saveNetwork({ layers, weights, biases }) {
  const data = { layers, weights, biases };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "network.json";
  link.click();
}

export function loadNetwork(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = JSON.parse(e.target.result);
    callback(data);
  };
  reader.readAsText(file);
}
