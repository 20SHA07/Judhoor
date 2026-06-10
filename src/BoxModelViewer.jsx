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
const XR_DEFAULT_SCALE = 0.12;
const XR_MIN_SCALE = 0.07;
const XR_MAX_SCALE = 0.22;
const XR_SCALE_STEP = 0.015;
const XR_DEFAULT_PLACEMENT = {
  position: [0, 0, -1.25],
  rotationY: 0,
  scale: XR_DEFAULT_SCALE,
  placed: false,
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

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

function AnimatedBoxModel({
  displayMode,
  isOpen,
  onToggle,
  onModelInfo,
  xrPlacement,
}) {
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

  const isBrowserMode = displayMode === "browser";
  const isArMode = displayMode === "ar";
  const modelScale = preparedModel.scale * (isBrowserMode ? 1 : xrPlacement.scale);
  const modelPosition = isBrowserMode
    ? [0, 0, 0]
    : displayMode === "vr"
      ? [0, -0.18, -1.38]
      : xrPlacement.position;
  const modelRotation = isBrowserMode
    ? [-0.05, -0.35, 0]
    : [0, displayMode === "vr" ? -0.18 : xrPlacement.rotationY, 0];
  const modelVisible = !isArMode || xrPlacement.placed;

  return (
    <group
      ref={groupRef}
      scale={modelScale}
      rotation={modelRotation}
      position={modelPosition}
      visible={modelVisible}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
    >
      <primitive object={preparedModel.scene} />
    </group>
  );
}

function CameraControls({ enabled, resetSignal }) {
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
      enabled={enabled}
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

function ARPlacementReticle({ enabled, onHitUpdate }) {
  const { gl } = useThree();
  const reticleRef = useRef(null);
  const hitTestSourceRef = useRef(null);
  const hitTestRequestedRef = useRef(false);
  const onHitUpdateRef = useRef(onHitUpdate);
  const reticleGeometry = useMemo(
    () => new THREE.RingGeometry(0.18, 0.205, 72).rotateX(-Math.PI / 2),
    [],
  );

  useEffect(() => {
    onHitUpdateRef.current = onHitUpdate;
  }, [onHitUpdate]);

  useEffect(() => {
    if (enabled) {
      return undefined;
    }

    hitTestSourceRef.current?.cancel?.();
    hitTestSourceRef.current = null;
    hitTestRequestedRef.current = false;
    onHitUpdateRef.current?.(null);

    if (reticleRef.current) {
      reticleRef.current.visible = false;
    }

    return undefined;
  }, [enabled]);

  useFrame((_, __, frame) => {
    const reticle = reticleRef.current;
    if (!enabled || !frame || !reticle) {
      if (reticle) {
        reticle.visible = false;
      }
      return;
    }

    const session = gl.xr.getSession?.();
    if (!session) {
      reticle.visible = false;
      return;
    }

    if (!hitTestRequestedRef.current) {
      hitTestRequestedRef.current = true;

      session
        .requestReferenceSpace("viewer")
        .then((viewerSpace) => session.requestHitTestSource({ space: viewerSpace }))
        .then((source) => {
          hitTestSourceRef.current = source;
        })
        .catch(() => {
          hitTestRequestedRef.current = false;
        });

      session.addEventListener(
        "end",
        () => {
          hitTestSourceRef.current?.cancel?.();
          hitTestSourceRef.current = null;
          hitTestRequestedRef.current = false;
          onHitUpdateRef.current?.(null);
        },
        { once: true },
      );
    }

    const hitTestSource = hitTestSourceRef.current;
    const referenceSpace = gl.xr.getReferenceSpace?.();
    if (!hitTestSource || !referenceSpace) {
      reticle.visible = false;
      return;
    }

    const hitTestResults = frame.getHitTestResults(hitTestSource);
    if (hitTestResults.length === 0) {
      reticle.visible = false;
      onHitUpdateRef.current?.(null);
      return;
    }

    const hitPose = hitTestResults[0].getPose(referenceSpace);
    if (!hitPose) {
      reticle.visible = false;
      onHitUpdateRef.current?.(null);
      return;
    }

    reticle.visible = true;
    reticle.matrix.fromArray(hitPose.transform.matrix);
    const position = new THREE.Vector3().setFromMatrixPosition(reticle.matrix);
    onHitUpdateRef.current?.(position.toArray());
  });

  return (
    <mesh ref={reticleRef} geometry={reticleGeometry} matrixAutoUpdate={false} visible={false}>
      <meshBasicMaterial color="#c49a5c" transparent opacity={0.9} side={THREE.DoubleSide} />
    </mesh>
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
    let activeMode = "none";
    let supportState = {
      arSupported: false,
      vrSupported: false,
    };

    function updateStatus(nextStatus) {
      if (isMounted) {
        onStatusChange?.(nextStatus);
      }
    }

    function handleControllerSelect() {
      onSelectRef.current?.();
    }

    function handleSessionEnd() {
      const endedMode = activeMode;
      activeSession = null;
      activeMode = "none";
      updateStatus({
        checked: true,
        supported: supportState.arSupported || supportState.vrSupported,
        arSupported: supportState.arSupported,
        vrSupported: supportState.vrSupported,
        isPresenting: false,
        mode: "none",
        message:
          endedMode === "ar"
            ? "AR session ended. You can re-enter AR to place the box on a table again."
            : "VR session ended. You can re-enter VR from Meta Quest Browser.",
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
          arSupported: false,
          vrSupported: false,
          isPresenting: false,
          mode: "none",
          message:
            "WebXR is not available in this browser. Open this page in Meta Quest Browser for AR or VR.",
        });
        return;
      }

      try {
        const [arSupported, vrSupported] = await Promise.all([
          navigator.xr.isSessionSupported("immersive-ar").catch(() => false),
          navigator.xr.isSessionSupported("immersive-vr").catch(() => false),
        ]);
        supportState = { arSupported, vrSupported };
        updateStatus({
          checked: true,
          supported: arSupported || vrSupported,
          arSupported,
          vrSupported,
          isPresenting: false,
          mode: "none",
          message: arSupported
            ? "AR ready. Use Enter AR, aim at a table or floor, then tap or trigger to place the box."
            : vrSupported
              ? "VR ready. The box now opens at a smaller physical scale."
              : "Immersive AR/VR is not available here. Touch and 360 rotation still work in browser mode.",
        });
      } catch {
        updateStatus({
          checked: true,
          supported: false,
          arSupported: false,
          vrSupported: false,
          isPresenting: false,
          mode: "none",
          message: "Could not check WebXR support. Browser mode still works.",
        });
      }
    }

    async function enterSession(mode) {
      const sessionMode = mode === "ar" ? "immersive-ar" : "immersive-vr";
      if (typeof navigator === "undefined" || !navigator.xr) {
        updateStatus({
          checked: true,
          supported: false,
          arSupported: false,
          vrSupported: false,
          isPresenting: false,
          mode: "none",
          message:
            "WebXR is not available in this browser. Open this page in Meta Quest Browser for AR or VR.",
        });
        return false;
      }

      try {
        updateStatus({
          checked: true,
          supported: supportState.arSupported || supportState.vrSupported,
          arSupported: supportState.arSupported,
          vrSupported: supportState.vrSupported,
          isPresenting: false,
          mode: "none",
          message: mode === "ar" ? "Opening AR placement session..." : "Opening VR session...",
        });

        try {
          gl.xr.setReferenceSpaceType(mode === "ar" ? "local" : "local-floor");
        } catch {
          gl.xr.setReferenceSpaceType("local");
        }

        if (mode === "ar") {
          try {
            activeSession = await navigator.xr.requestSession(sessionMode, {
              requiredFeatures: ["hit-test"],
              optionalFeatures: ["local-floor", "bounded-floor", "dom-overlay"],
              domOverlay: { root: document.body },
            });
          } catch {
            activeSession = await navigator.xr.requestSession(sessionMode, {
              requiredFeatures: ["hit-test"],
              optionalFeatures: ["local-floor", "bounded-floor"],
            });
          }
        } else {
          activeSession = await navigator.xr.requestSession(sessionMode, {
            optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"],
          });
        }
        activeMode = mode;
        activeSession.addEventListener("end", handleSessionEnd);
        await gl.xr.setSession(activeSession);

        updateStatus({
          checked: true,
          supported: supportState.arSupported || supportState.vrSupported || mode === "ar" || mode === "vr",
          arSupported: supportState.arSupported || mode === "ar",
          vrSupported: supportState.vrSupported || mode === "vr",
          isPresenting: true,
          mode,
          message:
            mode === "ar"
              ? "AR active. Aim at a flat surface, tap or trigger once to place, then use controls to resize or rotate."
              : "VR active. Use the Meta Quest trigger/select action to open or close the box.",
        });
        return true;
      } catch {
        activeSession = null;
        activeMode = "none";
        updateStatus({
          checked: true,
          supported: supportState.arSupported || supportState.vrSupported,
          arSupported: supportState.arSupported,
          vrSupported: supportState.vrSupported,
          isPresenting: false,
          mode: "none",
          message:
            mode === "ar"
              ? "AR could not start. Open this page in Meta Quest Browser over HTTPS and allow camera/AR access."
              : "VR could not start. Make sure this page is open in Meta Quest Browser over HTTPS.",
        });
        return false;
      }
    }

    async function enterAr() {
      return enterSession("ar");
    }

    async function enterVr() {
      return enterSession("vr");
    }

    async function exitXr() {
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

    xrApiRef.current = {
      enterAr,
      enterVr,
      exitXr,
    };
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
  onArHitUpdate,
  resetSignal,
  xrApiRef,
  xrMode,
  xrPlacement,
  onXrStatusChange,
}) {
  const displayMode = xrMode === "ar" || xrMode === "vr" ? xrMode : "browser";
  const showStudioFloor = displayMode !== "ar";

  return (
    <>
      {showStudioFloor && <color attach="background" args={["#f3e6d1"]} />}
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
            displayMode={displayMode}
            isOpen={isOpen}
            onToggle={onToggle}
            onModelInfo={onModelInfo}
            xrPlacement={xrPlacement}
          />
          <ARPlacementReticle
            enabled={displayMode === "ar" && !xrPlacement.placed}
            onHitUpdate={onArHitUpdate}
          />
          <Environment preset="studio" />
        </Suspense>
      </ViewerErrorBoundary>

      {showStudioFloor && (
        <>
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
        </>
      )}
      <CameraControls enabled={displayMode === "browser"} resetSignal={resetSignal} />
    </>
  );
}

export default function BoxModelViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [xrPlacement, setXrPlacement] = useState(XR_DEFAULT_PLACEMENT);
  const [modelInfo, setModelInfo] = useState({
    clipNames: [],
    hasLid: false,
    mode: "loading",
  });
  const [xrStatus, setXrStatus] = useState({
    checked: false,
    supported: false,
    arSupported: false,
    vrSupported: false,
    isPresenting: false,
    mode: "none",
    message: "Checking WebXR support...",
  });
  const xrApiRef = useRef(null);
  const latestArHitRef = useRef(null);
  const toggleOpen = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);
  const handleArHitUpdate = useCallback((position) => {
    latestArHitRef.current = position;
  }, []);
  const resetPlacement = useCallback(() => {
    latestArHitRef.current = null;
    setXrPlacement({
      ...XR_DEFAULT_PLACEMENT,
      position: [...XR_DEFAULT_PLACEMENT.position],
    });
  }, []);
  const placeBoxAtLatestHit = useCallback(() => {
    const hitPosition = latestArHitRef.current;
    if (!hitPosition) {
      return false;
    }

    setXrPlacement((current) => ({
      ...current,
      position: hitPosition,
      placed: true,
    }));
    return true;
  }, []);
  const handleSceneSelect = useCallback(() => {
    if (xrStatus.mode === "ar" && !xrPlacement.placed && placeBoxAtLatestHit()) {
      return;
    }

    toggleOpen();
  }, [placeBoxAtLatestHit, toggleOpen, xrPlacement.placed, xrStatus.mode]);
  const adjustPlacementScale = useCallback((amount) => {
    setXrPlacement((current) => ({
      ...current,
      scale: clamp(current.scale + amount, XR_MIN_SCALE, XR_MAX_SCALE),
    }));
  }, []);
  const rotatePlacement = useCallback((amount) => {
    setXrPlacement((current) => ({
      ...current,
      rotationY: current.rotationY + amount,
    }));
  }, []);
  const handleArToggle = useCallback(() => {
    if (xrStatus.isPresenting) {
      xrApiRef.current?.exitXr();
      return;
    }

    resetPlacement();
    xrApiRef.current?.enterAr();
  }, [resetPlacement, xrStatus.isPresenting]);
  const handleVrToggle = useCallback(() => {
    if (xrStatus.isPresenting) {
      xrApiRef.current?.exitXr();
      return;
    }

    xrApiRef.current?.enterVr();
  }, [xrStatus.isPresenting]);
  const isArMode = xrStatus.mode === "ar";
  const isVrMode = xrStatus.mode === "vr";
  const scalePercent = Math.round((xrPlacement.scale / XR_DEFAULT_SCALE) * 100);
  const placementLabel = isArMode
    ? xrPlacement.placed
      ? `Placed at tabletop scale (${scalePercent}%). Resize or rotate as needed.`
      : "Aim at a table or floor until the gold ring appears, then tap or trigger to place."
    : `Immersive scale set to ${scalePercent}% for Meta Quest viewing.`;

  const animationLabel =
    modelInfo.mode === "clip" && modelInfo.clipNames.length
      ? `Using GLB animation: ${modelInfo.clipNames.join(", ")}`
      : modelInfo.hasLid
        ? "Using lid fallback if no animation clip is available."
        : "Waiting for model animation data.";

  return (
    <section className="bmv-page" aria-label="Standalone You Are Important Box 3D, AR, and VR viewer">
      <div className="bmv-copy">
        <p className="jh-eyebrow">3D / AR / VR Viewer</p>
        <h1>You Are Important Box</h1>
        <p>
          Drag to rotate, pinch or scroll to zoom, or use AR on Meta Quest Browser to place
          the box on a real table at adjustable scale.
        </p>
      </div>

      <div className={`bmv-stage ${isArMode ? "bmv-stage--ar" : ""}`}>
        <Canvas
          className="bmv-canvas"
          shadows
          dpr={[1, 1.35]}
          camera={{ position: [4.4, 2.85, 6.4], fov: 38, near: 0.1, far: 80 }}
          onPointerDown={() => {
            if (isArMode && !xrPlacement.placed) {
              placeBoxAtLatestHit();
            }
          }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
        >
          <ViewerScene
            isOpen={isOpen}
            onToggle={handleSceneSelect}
            onModelInfo={setModelInfo}
            onArHitUpdate={handleArHitUpdate}
            resetSignal={resetSignal}
            xrApiRef={xrApiRef}
            xrMode={xrStatus.mode}
            xrPlacement={xrPlacement}
            onXrStatusChange={setXrStatus}
          />
        </Canvas>

        <div className="bmv-toolbar" aria-label="3D box controls">
          <button
            type="button"
            className={`bmv-control bmv-control--ar ${isArMode ? "is-active" : ""}`}
            disabled={
              (xrStatus.checked && !xrStatus.arSupported) ||
              (xrStatus.isPresenting && !isArMode)
            }
            onClick={handleArToggle}
          >
            {isArMode ? "Exit AR" : "Enter AR"}
          </button>
          <button
            type="button"
            className={`bmv-control bmv-control--vr ${isVrMode ? "is-active" : ""}`}
            disabled={
              (xrStatus.checked && !xrStatus.vrSupported) ||
              (xrStatus.isPresenting && !isVrMode)
            }
            onClick={handleVrToggle}
          >
            {isVrMode ? "Exit VR" : "Enter VR"}
          </button>
          <button type="button" className="bmv-control" onClick={toggleOpen}>
            {isOpen ? "Close Box" : "Open Box"}
          </button>
          <button
            type="button"
            className="bmv-control"
            onClick={() => adjustPlacementScale(-XR_SCALE_STEP)}
          >
            Smaller
          </button>
          <button
            type="button"
            className="bmv-control"
            onClick={() => adjustPlacementScale(XR_SCALE_STEP)}
          >
            Larger
          </button>
          <button
            type="button"
            className="bmv-control"
            onClick={() => rotatePlacement(Math.PI / 12)}
          >
            Rotate Left
          </button>
          <button
            type="button"
            className="bmv-control"
            onClick={() => rotatePlacement(-Math.PI / 12)}
          >
            Rotate Right
          </button>
          <button type="button" className="bmv-control" onClick={resetPlacement}>
            Reset Placement
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
          <span>{placementLabel}</span>
          <span>{xrStatus.message}</span>
        </div>
      </div>
    </section>
  );
}
