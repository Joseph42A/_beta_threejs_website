import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sparkles, Stage } from "@react-three/drei";

import { MainModel } from "./components/MainModel";
import { AxesHelper, PerspectiveCamera } from "three";
import { useControls } from "leva";

import { BufferAttribute } from "three";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function BufferPoints({ count = 1000 }) {
  // const CircleImg = useLoader(THREE.TextureLoader, circleImg);
  const gltf = useLoader(GLTFLoader, "/blue_small.gltf");

  const points = useMemo(() => {
    const p = new Array(count).fill(0).map((v) => (0.5 - Math.random()) * 7.5);
    return new BufferAttribute(new Float32Array(p), 3);
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach={"attributes-position"} {...points} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        threshold={0.1}
        color={"orange"}
        sizeAttenuation={true}
      />
    </points>
  );
}

const Camera = ({ ref }) => {
  const camera = useRef();

  if (!!camera.current) {
    camera.current.position.x = Math.sin(2 * Math.PI * 2) * 32;
    camera.current.position.z = Math.cos(1 * Math.PI * 2) * 10;
    camera.current.position.y = 2 * 3;
  }

  const { position, position_camera, intensity } = useControls("Light", {
    position: [-8.4, -20.9, 16.2],
    position_camera: [0, 6, -20],
    intensity: 0.42,
  });

  return (
    <perspectiveCamera
      // ref={camera}
      position={position_camera}
      fov={25}
      aspect={window.innerWidth / window.innerHeight}
      far={10}
    >
      <MainModel />
      {/* <BufferPoints count={5000} /> */}

      <ambientLight intensity={0.2} />
      {/* <spotLight position={[-2.4, -8.0, 16.2]} intensity={0.6} /> */}
      {/* <pointLight position={position} intensity={0.1} /> */}
      <spotLight position={[-1, 26.68, 8.86]} intensity={intensity} />
      {/* <pointLightHelper  /> */}
    </perspectiveCamera>
  );
};

function Particles({ count, mouse }) {
  const mesh = useRef();
  const light = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const dummy = useMemo(() => new THREE.Object3D(), []);
  // const dummy = useLoader(GLTFLoader, "./blue_small.gltf");

  // Generate some random positions, speed factors and timings
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.001;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);
  // The innards of this hook will run every frame
  useFrame((state) => {
    // Makes the light follow the mouse
    light.current.position.set(
      mouse?.current?.[0] / aspect,
      -mouse?.current?.[1] / aspect,
      0
    );
    // Run through the randomized data to calculate some movement
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      // There is no sense or reason to any of this, just messing around with trigonometric functions
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      particle.mx += (mouse?.current?.[0] - particle.mx) * 0.01;
      particle.my += (mouse?.current?.[1] * -1 - particle.my) * 0.01;
      // Update the dummy object
      dummy.position.set(
        (particle.mx / 10) * a +
          xFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b +
          yFactor +
          Math.sin((t / 10) * factor) +
          (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b +
          zFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      // And apply the matrix to the instanced item
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <>
      <pointLight ref={light} distance={40} intensity={8} color="lightblue" />
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshPhongMaterial color="yellow" />
      </instancedMesh>
    </>
  );
}

export default function App() {
  const mouse = useRef([0, 0]);

  const scale = Array.from({ length: 1000 }, () => 0.5 + Math.random() * 4);

  return (
    <>
      {/* <Canvas style={{ position: "fixed" }}>
        <BufferPoints count={8000} />
      </Canvas> */}
      <Canvas
        // camera={{ fov: 100, position: [0, 0, 30] }}
        style={{ height: "100vh", background: "black" }}
        linear
      >
        <Camera />
        {/* <Sparkles
          count={scale.length}
          size={scale}
          position={[0, 0, 0]}
          scale={[4, 1.5, 4]}
          speed={0.3}
          dispose={90}
        /> */}

        <Particles count={false ? 5000 : 10000} mouse={mouse} />

        {/* <axesHelper args={[10]} /> */}
        {/* <OrbitControls ref={ref} shadows={false} enableZoom={false} /> */}
      </Canvas>
    </>
  );
}
