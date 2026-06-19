"use client";

import React from "react";

/**
 * Lighting: Instantiates the static light sources in the scene.
 * Named properties allow the ThemeLighting controller to locate and animate them dynamically.
 */
export default function Lighting() {
  return (
    <>
      <ambientLight name="ambient-light" />
      <directionalLight
        name="dir-light"
        position={[-6, 7, -4]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <pointLight 
        name="point-light" 
        position={[0, 4.5, 3]} 
        decay={2}
      />
      <spotLight
        name="spot-light"
        position={[9, -5.5, 6]}
        angle={0.6}
        penumbra={1}
        castShadow
      />
    </>
  );
}
