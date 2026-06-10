import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NavLink } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import "./box-model-viewer.css";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const MODEL_WEB_PATH = "/models/you-are-important-box.glb";
const MODEL_PATH = assetPath(MODEL_WEB_PATH);
const MODEL_TARGET_SIZE = 4.7;
const FALLBACK_LID_OPEN_ROTATION = -Math.PI * 0.62;

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
      3D model could not be loaded. Check that /models/you-are-important-box.glb exists.
    </ViewerStatus>
  );
}

function findObjectByName(root, targetName) {
  const normalizedTarget = targetName.toLowerCase();
  let match = null;

  root.traverse((object) => {
    if (!match && object.name?.toLowerCase() === normalizedTarget) {
      match = object;
    }
  });

  return match;
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
        material.roughness = Math.max(material.roughness ?? 0.78, 0.7);
      }
      if ("metalness" in material) {
        material.metalness = Math.min(material.metalness ?? 0.08, 0.18);
      }
      if (material.map) {
        material.map.anisotropy = Math.max(material.map.anisotropy ?? 1, 6);
      }
      material.needsUpdate = true;
    });
  });

  return { scene, scale };
}

function AnimatedBoxModel({ isOpen, onToggle, onModelInfo }) {
  const groupRef = useRef(null);
  const lidRef = useRef(null);
  const initialLidRotationRef = useRef(0);
  const hasPlayedClipRef = useRef(false);
  const { scene, animations } = useGLTF(MODEL_PATH);
  const preparedModel = useMemo(() => prepareModel(scene), [scene]);
  const { actions } = useAnimations(animations, groupRef);
  const animationClip = animations[0] ?? null;
  const animationAction = animationClip?.name ? actions[animationClip.name] : null;
  const usesAnimationClip = Boolean(animationAction && animationClip);

  useEffect(() => {
    const lid = findObjectByName(preparedModel.scene, "lid");
    lidRef.current = lid;
    initialLidRotationRef.current = lid?.rotation.x ?? 0;

    onModelInfo?.({
      clipNames: animations.map((clip) => clip.name || "Unnamed clip"),
      hasLid: Boolean(lid),
      mode: animations.length > 0 ? "clip" : "lid-fallback",
    });
  }, [animations, onModelInfo, preparedModel.scene]);

  useEffect(() => {
    if (!animationAction || !animationClip) {
      return;
    }

    animationAction.enabled = true;
    animationAction.loop = THREE.LoopOnce;
    animationAction.clampWhenFinished = true;

    if (!hasPlayedClipRef.current && !isOpen) {
      animationAction.reset();
      animationAction.stop();
      animationAction.time = 0;
      return;
    }

    hasPlayedClipRef.current = true;
    animationAction.paused = false;
    animationAction.timeScale = isOpen ? 1 : -1;
    animationAction.reset();

    if (!isOpen) {
      animationAction.time = animationClip.duration;
    }

    animationAction.play();
  }, [animationAction, animationClip, isOpen]);

  useFrame((_, delta) => {
    if (usesAnimationClip || !lidRef.current) {
      return;
    }

    const targetRotation =
      initialLidRotationRef.current + (isOpen ? FALLBACK_LID_OPEN_ROTATION : 0);
    lidRef.current.rotation.x = THREE.MathUtils.damp(
      lidRef.current.rotation.x,
      targetRotation,
      7,
      delta,
    );
  });

  return (
    <group
      ref={groupRef}
      scale={preparedModel.scale}
      rotation={[-0.05, -0.35, 0]}
      position={[0, 0, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
    >
      <primitive object={preparedModel.scene} />
    </group>
  );
}

function CameraControls({ resetSignal }) {
  const controlsRef = useRef(null);

  useEffect(() => {
    if (resetSignal > 0) {
      controlsRef.current?.reset();
    }
  }, [resetSignal]);

  return (
    <OrbitControls
      ref={controlsRef}
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
  );
}

function XRSupport({ onSelect, onStatusChange, xrApiRef }) {
  const { gl, scene } = useThree();
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    let isMounted = true;
    let activeSession = null;

    function updateStatus(nextStatus) {
      if (isMounted) {
        onStatusChange?.(nextStatus);
      }
    }

    function handleControllerSelect() {
      onSelectRef.current?.();
    }

    function handleSessionEnd() {
      activeSession = null;
      updateStatus({
        checked: true,
        supported: true,
        isPresenting: false,
        message: "VR session ended. You can re-enter VR from Meta Quest Browser.",
      });
    }

    gl.xr.enabled = true;
    try {
      gl.xr.setReferenceSpaceType("local-floor");
    } catch {
      gl.xr.setReferenceSpaceType("local");
    }

    async function checkSupport() {
      if (typeof navigator === "undefined" || !navigator.xr) {
        updateStatus({
          checked: true,
          supported: false,
          isPresenting: false,
          message: "WebXR is not available in this browser. Open this page in Meta Quest Browser for VR.",
        });
        return;
      }

      try {
        const supported = await navigator.xr.isSessionSupported("immersive-vr");
        updateStatus({
          checked: true,
          supported,
          isPresenting: false,
          message: supported
            ? "VR ready. Use Enter VR, then controller trigger/select to open or close the box."
            : "Immersive VR is not available here. Touch and 360 rotation still work in browser mode.",
        });
      } catch {
        updateStatus({
          checked: true,
          supported: false,
          isPresenting: false,
          message: "Could not check WebXR support. Browser mode still works.",
        });
      }
    }

    async function enterVr() {
      if (typeof navigator === "undefined" || !navigator.xr) {
        updateStatus({
          checked: true,
          supported: false,
          isPresenting: false,
          message: "WebXR is not available in this browser. Open this page in Meta Quest Browser for VR.",
        });
        return false;
      }

      try {
        updateStatus({
          checked: true,
          supported: true,
          isPresenting: false,
          message: "Opening VR session...",
        });

        activeSession = await navigator.xr.requestSession("immersive-vr", {
          optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"],
        });
        activeSession.addEventListener("end", handleSessionEnd);
        await gl.xr.setSession(activeSession);

        updateStatus({
          checked: true,
          supported: true,
          isPresenting: true,
          message: "VR active. Use the Meta Quest trigger/select action to open or close the box.",
        });
        return true;
      } catch {
        updateStatus({
          checked: true,
          supported: true,
          isPresenting: false,
          message: "VR could not start. Make sure this page is open in Meta Quest Browser over HTTPS.",
        });
        return false;
      }
    }

    async function exitVr() {
      const session = gl.xr.getSession?.() ?? activeSession;
      if (session) {
        await session.end();
      }
    }

    const controllers = [gl.xr.getController(0), gl.xr.getController(1)];
    controllers.forEach((controller) => {
      controller.addEventListener("select", handleControllerSelect);
      scene.add(controller);
    });

    xrApiRef.current = { enterVr, exitVr };
    checkSupport();

    return () => {
      isMounted = false;
      if (xrApiRef.current?.enterVr === enterVr) {
        xrApiRef.current = null;
      }

      controllers.forEach((controller) => {
        controller.removeEventListener("select", handleControllerSelect);
        scene.remove(controller);
      });

      if (activeSession) {
        activeSession.removeEventListener("end", handleSessionEnd);
      }
    };
  }, [gl, onStatusChange, scene, xrApiRef]);

  return null;
}

function ViewerScene({
  isOpen,
  onToggle,
  onModelInfo,
  resetSignal,
  xrApiRef,
  onXrStatusChange,
}) {
  return (
    <>
      <color attach="background" args={["#f3e6d1"]} />
      <ambientLight intensity={0.72} color="#fff1d8" />
      <directionalLight
        castShadow
        color="#fff2d4"
        intensity={2}
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
        intensity={1.85}
        position={[3.6, 4.8, 4.2]}
        angle={0.42}
        penumbra={0.85}
        distance={14}
      />
      <spotLight
        color="#fff7ea"
        intensity={0.68}
        position={[-3.8, 2.8, -4.6]}
        angle={0.52}
        penumbra={0.9}
        distance={12}
      />

      <XRSupport
        onSelect={onToggle}
        onStatusChange={onXrStatusChange}
        xrApiRef={xrApiRef}
      />
      <ViewerErrorBoundary fallback={<ModelErrorFallback />}>
        <Suspense fallback={<ModelLoadingFallback />}>
          <AnimatedBoxModel
            isOpen={isOpen}
            onToggle={onToggle}
            onModelInfo={onModelInfo}
          />
          <Environment preset="studio" />
        </Suspense>
      </ViewerErrorBoundary>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.018, 0]} receiveShadow>
        <circleGeometry args={[4.4, 96]} />
        <meshStandardMaterial color="#ead9bd" roughness={0.94} metalness={0.02} />
      </mesh>
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.4}
        scale={7.2}
        blur={2.8}
        far={4.2}
        resolution={384}
        frames={1}
      />
      <CameraControls resetSignal={resetSignal} />
    </>
  );
}

export default function BoxModelViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [modelInfo, setModelInfo] = useState({
    clipNames: [],
    hasLid: false,
    mode: "loading",
  });
  const [xrStatus, setXrStatus] = useState({
    checked: false,
    supported: false,
    isPresenting: false,
    message: "Checking WebXR support...",
  });
  const xrApiRef = useRef(null);
  const toggleOpen = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);
  const handleVrToggle = useCallback(() => {
    if (xrStatus.isPresenting) {
      xrApiRef.current?.exitVr();
      return;
    }

    xrApiRef.current?.enterVr();
  }, [xrStatus.isPresenting]);

  const animationLabel =
    modelInfo.mode === "clip" && modelInfo.clipNames.length
      ? `Using GLB animation: ${modelInfo.clipNames.join(", ")}`
      : modelInfo.hasLid
        ? "Using lid fallback if no animation clip is available."
        : "Waiting for model animation data.";

  return (
    <section className="bmv-page" aria-label="Standalone You Are Important Box 3D and VR viewer">
      <div className="bmv-copy">
        <p className="jh-eyebrow">3D / VR Viewer</p>
        <h1>You Are Important Box</h1>
        <p>Drag to rotate, pinch or scroll to zoom, and click the box to open or close it.</p>
      </div>

      <div className="bmv-stage">
        <Canvas
          className="bmv-canvas"
          shadows
          dpr={[1, 1.35]}
          camera={{ position: [4.4, 2.85, 6.4], fov: 38, near: 0.1, far: 80 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
        >
          <ViewerScene
            isOpen={isOpen}
            onToggle={toggleOpen}
            onModelInfo={setModelInfo}
            resetSignal={resetSignal}
            xrApiRef={xrApiRef}
            onXrStatusChange={setXrStatus}
          />
        </Canvas>

        <div className="bmv-toolbar" aria-label="3D box controls">
          <button
            type="button"
            className={`bmv-control bmv-control--vr ${xrStatus.isPresenting ? "is-active" : ""}`}
            disabled={xrStatus.checked && !xrStatus.supported}
            onClick={handleVrToggle}
          >
            {xrStatus.isPresenting ? "Exit VR" : "Enter VR"}
          </button>
          <button type="button" className="bmv-control" onClick={toggleOpen}>
            {isOpen ? "Close Box" : "Open Box"}
          </button>
          <button
            type="button"
            className="bmv-control"
            onClick={() => setResetSignal((current) => current + 1)}
          >
            Reset View
          </button>
          <NavLink to="/" className="bmv-control bmv-control--link">
            Back to Home
          </NavLink>
        </div>

        <div className="bmv-mode-note" aria-live="polite">
          <span>{animationLabel}</span>
          <span>{xrStatus.message}</span>
        </div>
      </div>
    </section>
  );
}
