import { Component, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import "./box-model-viewer.css";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const MODEL_PATH = assetPath("/models/you-are-important-box.glb");
const MODEL_TARGET_SIZE = 4.6;

useGLTF.preload(MODEL_PATH);

class ViewerErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function ViewerStatus({ children, muted = false }) {
  return (
    <Html center className={`bmv-status ${muted ? "bmv-status--muted" : ""}`}>
      {children}
    </Html>
  );
}

function ModelLoadingFallback() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.1, 1.18, 96]} />
        <meshBasicMaterial color="#c7a15f" transparent opacity={0.32} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[1.55, 1.58, 96]} />
        <meshBasicMaterial color="#ead4ad" transparent opacity={0.2} />
      </mesh>
      <ViewerStatus muted>Loading You Are Important Box</ViewerStatus>
    </group>
  );
}

function ModelErrorFallback() {
  return (
    <ViewerStatus>
      3D model could not be loaded. Please check /models/you-are-important-box.glb
    </ViewerStatus>
  );
}

function prepareModel(sourceScene) {
  const scene = sourceScene.clone(true);
  const bounds = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  bounds.getSize(size);
  bounds.getCenter(center);

  const maxDimension = Math.max(size.x, size.y, size.z, 1);
  const scale = MODEL_TARGET_SIZE / maxDimension;

  scene.position.set(-center.x, -bounds.min.y, -center.z);
  scene.traverse((object) => {
    if (!object.isMesh) {
      return;
    }

    object.castShadow = true;
    object.receiveShadow = true;

    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.filter(Boolean).forEach((material) => {
      if ("roughness" in material) {
        material.roughness = Math.max(material.roughness ?? 0.78, 0.68);
      }
      if ("metalness" in material) {
        material.metalness = Math.min(material.metalness ?? 0.08, 0.22);
      }
      if (material.map) {
        material.map.anisotropy = Math.max(material.map.anisotropy ?? 1, 8);
      }
      material.needsUpdate = true;
    });
  });

  return { scene, scale };
}

function YouAreImportantModel() {
  const { scene } = useGLTF(MODEL_PATH);
  const preparedModel = useMemo(() => prepareModel(scene), [scene]);

  return (
    <group scale={preparedModel.scale} rotation={[-0.05, -0.35, 0]} position={[0, 0, 0]}>
      <primitive object={preparedModel.scene} />
    </group>
  );
}

export default function BoxModelViewer() {
  return (
    <section className="bmv-page" aria-label="Standalone You Are Important Box 3D viewer">
      <div className="bmv-copy">
        <p className="jh-eyebrow">Standalone 3D Viewer</p>
        <h1>You Are Important Box</h1>
        <p>Drag to rotate. Pinch or scroll to zoom.</p>
      </div>

      <div className="bmv-stage">
        <Canvas
          className="bmv-canvas"
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [4.4, 2.85, 6.4], fov: 38, near: 0.1, far: 80 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
        >
          <color attach="background" args={["#f3e6d1"]} />
          <ambientLight intensity={0.7} color="#fff1d8" />
          <directionalLight
            castShadow
            color="#fff2d4"
            intensity={2.2}
            position={[-4.4, 6.2, 4.8]}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
          />
          <spotLight
            castShadow
            color="#ffdca6"
            intensity={2.1}
            position={[3.6, 4.8, 4.2]}
            angle={0.42}
            penumbra={0.85}
            distance={14}
          />
          <spotLight
            color="#fff7ea"
            intensity={0.7}
            position={[-3.8, 2.8, -4.6]}
            angle={0.52}
            penumbra={0.9}
            distance={12}
          />

          <ViewerErrorBoundary fallback={<ModelErrorFallback />}>
            <Suspense fallback={<ModelLoadingFallback />}>
              <YouAreImportantModel />
              <Environment preset="studio" />
            </Suspense>
          </ViewerErrorBoundary>

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.018, 0]} receiveShadow>
            <circleGeometry args={[4.4, 96]} />
            <meshStandardMaterial color="#ead9bd" roughness={0.94} metalness={0.02} />
          </mesh>
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.42}
            scale={7.2}
            blur={2.8}
            far={4.2}
            resolution={512}
            frames={1}
          />
          <OrbitControls
            makeDefault
            enablePan={false}
            enableZoom
            enableDamping
            dampingFactor={0.07}
            rotateSpeed={0.72}
            zoomSpeed={0.78}
            minDistance={3.8}
            maxDistance={11}
            minPolarAngle={Math.PI * 0.16}
            maxPolarAngle={Math.PI * 0.7}
            target={[0, 1.05, 0]}
          />
        </Canvas>
      </div>
    </section>
  );
}
