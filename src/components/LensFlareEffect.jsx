// src/components/LensFlareEffect.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import {
  Lensflare,
  LensflareElement,
} from "three/examples/jsm/objects/Lensflare";

function LensFlareEffect() {
  const { scene } = useThree();
  const flareRefs = useRef([]);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const textureFlare0 = loader.load(
      "https://threejs.org/examples/textures/lensflare/lensflare0.png"
    );
    const textureFlare1 = loader.load(
      "https://threejs.org/examples/textures/lensflare/lensflare3.png"
    );
    const textureFlare2 = loader.load(
      "https://threejs.org/examples/textures/lensflare/lensflare3.png"
    );

    const createFlare = (position) => {
      const light = new THREE.PointLight(0xffffff, 10000.5, 2000);
      light.position.set(...position);

      const lensflare = new Lensflare();
      lensflare.addElement(new LensflareElement(textureFlare0, 700, 0));
      lensflare.addElement(new LensflareElement(textureFlare1, 60, 0.6));
      lensflare.addElement(new LensflareElement(textureFlare2, 70, 0.7));
      light.add(lensflare);

      scene.add(light);
      return light;
    };

    const flarePositions = [
      [40, 40, 40],
      [-40, -40, 40],
      [40, -40, -40],
      [-40, 40, -40],
    ];

    flareRefs.current = flarePositions.map(createFlare);

    return () => {
      flareRefs.current.forEach((flare) => scene.remove(flare));
    };
  }, [scene]);

  return null;
}

export default LensFlareEffect;
