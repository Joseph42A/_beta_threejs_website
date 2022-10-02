import React, { Suspense, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
// import { Model } from "./Model";
// import { main } from "./components/ModelDraco";
import { MainDraco } from "./components/MainDraco";
import { ModelDraco } from "./components/ModelDraco";
import { MainModel } from "./components/MainModel";
import { Camera, PerspectiveCamera } from "three";

function CameraHelper() {
  const camera = new PerspectiveCamera(60, 1, 1, 3);
  return (
    <group position={[0, 0, 2]}>
      <cameraHelper args={[camera]} />
    </group>
  );
}

function Controls() {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  return <orbitControls args={[camera, domElement]} />;
}

export default function App() {
  const ref = useRef();
  return (
    <>
      <Canvas
        // shadows
        // dpr={[9, 2]}
        camera={{ fov: 60, position: [0, 0, 2] }}
        style={{ height: "100vh" }}
      >
        <Suspense fallback={null}>
          <Stage
            controls={ref}
            preset="rembrandt"
            shadows={false}
            contactShadow={false}
            intensity={0.3}
            environment="city"
          >
            <MainModel />
          </Stage>
        </Suspense>
        {/* <Controls /> */}
        <CameraHelper />
        <OrbitControls ref={ref} shadows={false} enableZoom={false} />
      </Canvas>
    </>
  );
}
