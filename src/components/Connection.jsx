// components/Connection.jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

function Connection({ start, end, weight }) {
  const lineRef = useRef();
  const colorRef = useRef(new THREE.Color().setHSL(weight, 1.0, 0.5));

  useEffect(() => {
    const material = lineRef.current.material;
    material.color = colorRef.current;
  }, []);

  useEffect(() => {
    const oldColor = colorRef.current.clone();
    const newColor = new THREE.Color().setHSL(weight, 1.0, 0.5);
    new TWEEN.Tween(oldColor)
      .to(newColor, 1000)
      .onUpdate(() => {
        colorRef.current.copy(oldColor);
        lineRef.current.material.color = colorRef.current;
      })
      .start();
  }, [weight]);

  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial />
    </line>
  );
}

export default Connection;
