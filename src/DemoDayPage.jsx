import { Component, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import { boxCatalog } from "./judhoorData";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const getItemCount = (box) => box.itemCount ?? box.items?.length ?? 0;

const themePalettes = {
  sand: {
    base: "#d8c09b",
    deep: "#3b2a1f",
    inside: "#f5ead8",
    ribbon: "#b9914b",
    metal: "#c8a25d",
    glow: "#efd4a5",
    lining: "#ead7bb",
  },
  sage: {
    base: "#c7c0a0",
    deep: "#354032",
    inside: "#edf0df",
    ribbon: "#a89d62",
    metal: "#c2a45d",
    glow: "#cfd9bd",
    lining: "#dee1c8",
  },
  rose: {
    base: "#d6b8aa",
    deep: "#4b2d2b",
    inside: "#f4e3dc",
    ribbon: "#b98b5e",
    metal: "#caa35d",
    glow: "#e7c4b8",
    lining: "#ead2c8",
  },
  midnight: {
    base: "#4a443d",
    deep: "#1f211f",
    inside: "#eadbbf",
    ribbon: "#b8904f",
    metal: "#c8a25d",
    glow: "#bba985",
    lining: "#d9c7a7",
  },
};

const itemLayouts = [
  { x: -1.55, y: 0.76, z: -0.46, size: 0.9, rotation: 0.28 },
  { x: -0.54, y: 0.92, z: 0.28, size: 0.84, rotation: -0.2 },
  { x: 0.58, y: 0.82, z: -0.34, size: 0.86, rotation: 0.18 },
  { x: 1.5, y: 0.74, z: 0.26, size: 0.8, rotation: -0.32 },
  { x: -1.16, y: 0.48, z: 0.78, size: 0.72, rotation: 0.08 },
  { x: 0.08, y: 0.55, z: 0.82, size: 0.78, rotation: -0.08 },
  { x: 1.18, y: 0.5, z: 0.74, size: 0.72, rotation: 0.12 },
];

const presentationMoments = [
  {
    label: "First beat",
    title: "The room sees a gift, not a product.",
    body: "The box enters closed, quiet, premium, and ceremonial before anything is explained.",
  },
  {
    label: "Second beat",
    title: "The lid opens into memory.",
    body: "Objects rise into view so judges can immediately understand the tactile experience.",
  },
  {
    label: "Final beat",
    title: "It becomes a family ritual.",
    body: "The story ends with voice notes, prompts, and repeatable moments between generations.",
  },
];

const companionFlows = [
  {
    key: "voice",
    label: "QR voice message",
    title: "Voice note ready",
    status: "0:42 from Mariam",
    body: "A warm family recording opens with one tap, with a simple transcript for quiet rooms.",
    cta: "Play elder voice",
  },
  {
    key: "prompt",
    label: "Family prompt card",
    title: "Today’s memory prompt",
    status: "Reflection card",
    body: "Ask about a place that still feels like home. Let the answer move slowly.",
    cta: "Save response",
  },
  {
    key: "caregiver",
    label: "Caregiver note",
    title: "Gentle care cues",
    status: "Before the visit",
    body: "Keep the box nearby, offer one item at a time, and let silence be comfortable.",
    cta: "Mark reviewed",
  },
  {
    key: "checkout",
    label: "Demo checkout",
    title: "Box reserved",
    status: "Demo order",
    body: "The selected box can move straight into cart, customization, and checkout.",
    cta: "Add to cart",
  },
];

const elderVoiceHints =
  /natural|neural|online|premium|google|microsoft|apple|david|george|daniel|arthur|fred|guy|mark|zira|hazel|susan|martha|moira|victoria|samantha/i;

const memoryVoiceScripts = [
  {
    role: "Grandmother",
    text: "My dear... come closer. This photograph takes me back many years.",
    rate: 0.68,
    pitch: 0.78,
    voiceHints: elderVoiceHints,
  },
  {
    role: "Grandfather",
    text: "I remember the old house very clearly... the smell of coffee, and everyone laughing after lunch.",
    rate: 0.66,
    pitch: 0.72,
    voiceHints: elderVoiceHints,
  },
  {
    role: "Grandmother",
    text: "When you read this letter to me slowly... I feel that I am still held by my family.",
    rate: 0.7,
    pitch: 0.8,
    voiceHints: elderVoiceHints,
  },
  {
    role: "Grandfather",
    text: "These small things are not small to me. They carry my days, my people, and my stories.",
    rate: 0.67,
    pitch: 0.74,
    voiceHints: elderVoiceHints,
  },
  {
    role: "Grandmother",
    text: "Stay a little longer, habibi... I have one more memory I want to share with you.",
    rate: 0.69,
    pitch: 0.82,
    voiceHints: elderVoiceHints,
  },
];

const GLB_MODEL_PATHS = {
  "past-box": "/models/past-box.glb",
  "balance-box": "/models/balance-box.glb",
  "important-box": "/models/you-are-important-box.glb",
  "travel-box": "/models/travel-box.glb",
};

const GLB_OBJECT_NAME_ASSUMPTIONS = [
  "base",
  "lid",
  "inner_tray",
  "item_radio",
  "item_perfume",
  "item_coffee_cup",
  "item_cards",
  "item_booklet",
  "item_envelope",
  "item_pouch",
];

const MODEL_TARGET_SIZE = 4.7;
const LID_OPEN_ROTATION = -Math.PI * 0.62;

Object.values(GLB_MODEL_PATHS).forEach((path) => {
  useGLTF.preload(assetPath(path));
});

function getModelPath(box) {
  return assetPath(GLB_MODEL_PATHS[box.slug] ?? GLB_MODEL_PATHS["past-box"]);
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

function chooseOpenAnimation(animations) {
  return (
    animations.find((clip) => /open|unbox|lid|reveal/i.test(clip.name)) ??
    animations[0] ??
    null
  );
}

function prepareModelScene(sourceScene) {
  const modelScene = sourceScene.clone(true);
  const bounds = new THREE.Box3().setFromObject(modelScene);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  bounds.getSize(size);
  bounds.getCenter(center);

  const maxDimension = Math.max(size.x, size.y, size.z, 1);
  const scale = MODEL_TARGET_SIZE / maxDimension;

  modelScene.position.sub(center);
  modelScene.position.y += size.y / 2;

  modelScene.traverse((object) => {
    if (!object.isMesh) {
      return;
    }

    object.castShadow = true;
    object.receiveShadow = true;
    object.frustumCulled = true;

    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.filter(Boolean).forEach((material) => {
      if ("roughness" in material) {
        material.roughness = Math.max(material.roughness ?? 0.82, 0.72);
      }
      if ("metalness" in material) {
        material.metalness = Math.min(material.metalness ?? 0.08, 0.28);
      }
      if (material.map) {
        material.map.anisotropy = Math.max(material.map.anisotropy ?? 1, 8);
      }
      material.needsUpdate = true;
    });
  });

  return {
    scene: modelScene,
    scale,
    lid: findObjectByName(modelScene, "lid"),
    base: findObjectByName(modelScene, "base"),
    innerTray: findObjectByName(modelScene, "inner_tray"),
  };
}

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(previousProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function ModelLoadingFallback({ box }) {
  const palette = themePalettes[box.theme] ?? themePalettes.sand;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.1, 1.18, 96]} />
        <meshBasicMaterial color={palette.metal} transparent opacity={0.34} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[1.55, 1.58, 96]} />
        <meshBasicMaterial color={palette.glow} transparent opacity={0.18} />
      </mesh>
      <Html center className="jd-model-status">
        <span>Loading {box.name}</span>
      </Html>
    </group>
  );
}

function ModelPendingFallback({ box, modelPath }) {
  const palette = themePalettes[box.theme] ?? themePalettes.sand;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[2.4, 96]} />
        <meshBasicMaterial color={palette.glow} transparent opacity={0.14} />
      </mesh>
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[1.64, 1.8, 0.18, 96]} />
        <meshStandardMaterial color={palette.base} roughness={0.92} metalness={0.02} />
      </mesh>
      <mesh position={[0, 0.84, 0]}>
        <cylinderGeometry args={[1.76, 1.76, 0.12, 96]} />
        <meshStandardMaterial color={palette.deep} roughness={0.9} metalness={0.04} />
      </mesh>
      <Html center className="jd-model-status jd-model-status--missing">
        <span>{box.name} model pending</span>
        <small>{modelPath.replace(import.meta.env.BASE_URL, "/")}</small>
      </Html>
    </group>
  );
}

function JudhoorGLBModel({ box, isOpen }) {
  const groupRef = useRef(null);
  const lidRef = useRef(null);
  const closedLidRotationRef = useRef(0);
  const modelPath = getModelPath(box);
  const { scene, animations } = useGLTF(modelPath);
  const preparedModel = useMemo(() => prepareModelScene(scene), [scene]);
  const openAnimation = useMemo(() => chooseOpenAnimation(animations), [animations]);
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    lidRef.current = preparedModel.lid;
    closedLidRotationRef.current = preparedModel.lid?.rotation.x ?? 0;
  }, [preparedModel]);

  useEffect(() => {
    if (!openAnimation) {
      return undefined;
    }

    const action = actions[openAnimation.name];
    if (!action) {
      return undefined;
    }

    action.enabled = true;
    action.clampWhenFinished = true;
    action.setLoop(THREE.LoopOnce, 1);
    action.paused = false;
    action.timeScale = isOpen ? 1 : -1;

    if (isOpen) {
      action.reset();
    } else {
      action.time = action.getClip().duration;
    }

    action.play();

    return () => {
      action.fadeOut(0.12);
    };
  }, [actions, isOpen, openAnimation]);

  useFrame((_, delta) => {
    if (openAnimation || !lidRef.current) {
      return;
    }

    const targetRotation = isOpen
      ? closedLidRotationRef.current + LID_OPEN_ROTATION
      : closedLidRotationRef.current;

    lidRef.current.rotation.x = THREE.MathUtils.damp(
      lidRef.current.rotation.x,
      targetRotation,
      6,
      delta,
    );
  });

  return (
    <group
      ref={groupRef}
      scale={preparedModel.scale}
      rotation={[-0.08, -0.32, 0]}
      position={[0, -0.02, 0]}
    >
      <primitive object={preparedModel.scene} />
    </group>
  );
}

function DemoThreeScene({ box, isOpen, autoRotate }) {
  const modelPath = getModelPath(box);

  return (
    <div className="jd-three-host" aria-label={`${box.name} 3D stage`}>
      <Canvas
        className="jd-three-canvas"
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [4.1, 2.8, 7.4], fov: 38, near: 0.1, far: 80 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
        }}
      >
        <ambientLight intensity={0.72} color="#fff1d4" />
        <directionalLight
          castShadow
          color="#fff2cf"
          intensity={2.4}
          position={[-4.5, 6.8, 4.6]}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />
        <spotLight
          castShadow
          color="#ffdca1"
          intensity={2.6}
          position={[3.8, 5.2, 4.1]}
          angle={0.38}
          penumbra={0.82}
          distance={14}
        />
        <spotLight
          color="#fff7e8"
          intensity={0.88}
          position={[-3.5, 3.2, -4.8]}
          angle={0.52}
          penumbra={0.9}
          distance={12}
        />

        <Suspense fallback={<ModelLoadingFallback box={box} />}>
          <ModelErrorBoundary
            resetKey={`${box.slug}-${modelPath}`}
            fallback={<ModelPendingFallback box={box} modelPath={modelPath} />}
          >
            <JudhoorGLBModel box={box} isOpen={isOpen} />
          </ModelErrorBoundary>
          <Environment preset="studio" />
        </Suspense>

        <ContactShadows
          position={[0, -0.02, 0]}
          opacity={0.42}
          scale={7.4}
          blur={2.8}
          far={4.2}
          resolution={512}
          frames={1}
        />
        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.065}
          rotateSpeed={0.72}
          autoRotate={autoRotate}
          autoRotateSpeed={0.72}
          minDistance={5.6}
          maxDistance={10.8}
          minPolarAngle={Math.PI * 0.18}
          maxPolarAngle={Math.PI * 0.58}
          target={[0, 0.95, 0]}
        />
      </Canvas>
    </div>
  );
}

function stopAtmosphere(engine) {
  if (!engine) {
    return;
  }

  engine.timers.forEach((timerId) => {
    window.clearInterval(timerId);
    window.clearTimeout(timerId);
  });
  engine.sources.forEach((source) => {
    try {
      source.stop();
    } catch {
      // Already stopped.
    }
  });
  window.speechSynthesis?.cancel();
  engine.context?.close?.();
}

function getBrowserVoices() {
  if (!window.speechSynthesis) {
    return Promise.resolve([]);
  }

  const loadedVoices = window.speechSynthesis.getVoices();
  if (loadedVoices.length > 0) {
    return Promise.resolve(loadedVoices);
  }

  return new Promise((resolve) => {
    const timeoutId = window.setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      resolve(window.speechSynthesis.getVoices());
    }, 1400);

    function handleVoicesChanged() {
      window.clearTimeout(timeoutId);
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      resolve(window.speechSynthesis.getVoices());
    }

    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
  });
}

function scoreNaturalVoice(voice, script, usedVoiceNames) {
  const name = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  const language = voice.lang.toLowerCase();
  let score = 0;

  if (language.startsWith("en")) score += 60;
  if (/natural|neural|online|premium/i.test(name)) score += 80;
  if (/microsoft|google|apple|samantha|aria|jenny|guy|zira|david|george|daniel|arthur|hazel|susan|martha|moira|victoria/i.test(name)) {
    score += 42;
  }
  if (/david|george|daniel|arthur|fred|guy|mark|hazel|susan|martha|moira|victoria/i.test(name)) {
    score += 36;
  }
  if (/child|kid|junior|young|teen/i.test(name)) score -= 90;
  if (/robot|compact|eloquence|novelty/i.test(name)) score -= 35;
  if (script.voiceHints.test(name)) score += 34;
  if (!voice.localService) score += 16;
  if (usedVoiceNames.has(voice.name)) score -= 8;

  return score;
}

function buildVoiceCast(voices) {
  const usedVoiceNames = new Set();

  return memoryVoiceScripts.map((script) => {
    const bestVoice = voices
      .filter((voice) => /^en/i.test(voice.lang))
      .sort((first, second) =>
        scoreNaturalVoice(second, script, usedVoiceNames) -
        scoreNaturalVoice(first, script, usedVoiceNames),
      )[0] || voices[0];

    if (bestVoice) {
      usedVoiceNames.add(bestVoice.name);
    }

    return { ...script, voice: bestVoice };
  });
}

function useMemoryAtmosphere() {
  const [isPlaying, setIsPlaying] = useState(false);
  const engineRef = useRef(null);

  useEffect(() => () => stopAtmosphere(engineRef.current), []);

  async function start() {
    if (engineRef.current) {
      return;
    }

    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) {
      return;
    }

    const context = new AudioContextConstructor();
    await context.resume();

    const master = context.createGain();
    master.gain.value = 0.0001;
    master.connect(context.destination);
    master.gain.exponentialRampToValueAtTime(0.3, context.currentTime + 0.9);

    const sources = [];
    const timers = [];
    const voices = await getBrowserVoices();
    const voiceCast = buildVoiceCast(voices);
    let nextVoiceIndex = 0;

    const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let index = 0; index < noiseData.length; index += 1) {
      noiseData[index] = (Math.random() * 2 - 1) * 0.3;
    }

    const roomSource = context.createBufferSource();
    roomSource.buffer = noiseBuffer;
    roomSource.loop = true;
    const roomFilter = context.createBiquadFilter();
    roomFilter.type = "bandpass";
    roomFilter.frequency.value = 420;
    roomFilter.Q.value = 0.72;
    const roomGain = context.createGain();
    roomGain.gain.value = 0.09;
    roomSource.connect(roomFilter).connect(roomGain).connect(master);
    roomSource.start();
    sources.push(roomSource);

    const playChime = () => {
      [392, 523.25, 659.25].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const chimeGain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        chimeGain.gain.value = 0.0001;
        oscillator.connect(chimeGain).connect(master);
        const startAt = context.currentTime + index * 0.13;
        oscillator.start(startAt);
        chimeGain.gain.linearRampToValueAtTime(0.055, startAt + 0.05);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, startAt + 1.2);
        oscillator.stop(startAt + 1.35);
      });
    };
    playChime();
    timers.push(window.setInterval(playChime, 14500));

    const crackleTimer = window.setInterval(() => {
      const tick = context.createBufferSource();
      const tickBuffer = context.createBuffer(1, 1200, context.sampleRate);
      const tickData = tickBuffer.getChannelData(0);
      for (let index = 0; index < tickData.length; index += 1) {
        tickData[index] = (Math.random() * 2 - 1) * Math.max(0, 1 - index / tickData.length);
      }
      tick.buffer = tickBuffer;
      const tickGain = context.createGain();
      tickGain.gain.value = 0.018;
      tick.connect(tickGain).connect(master);
      tick.start();
    }, 2400);
    timers.push(crackleTimer);

    const speakMemoryLine = (delay = 0) => {
      if (!window.speechSynthesis) {
        return;
      }

      if (window.speechSynthesis.speaking) {
        const retryId = window.setTimeout(() => speakMemoryLine(), 700);
        engineRef.current?.timers.push(retryId);
        return;
      }

      const script = voiceCast[nextVoiceIndex % voiceCast.length];
      nextVoiceIndex += 1;
      const utterance = new SpeechSynthesisUtterance(script.text);
      utterance.lang = script.voice?.lang || "en-US";

      if (script.voice) {
        utterance.voice = script.voice;
      }

      utterance.rate = clamp(script.rate + (Math.random() - 0.5) * 0.035, 0.6, 0.78);
      utterance.pitch = clamp(script.pitch + (Math.random() - 0.5) * 0.04, 0.66, 0.88);
      utterance.volume = 0.92;
      utterance.onend = () => {
        if (!engineRef.current) {
          return;
        }

        const nextDelay = 2800 + Math.random() * 3600;
        const timeoutId = window.setTimeout(() => speakMemoryLine(), nextDelay);
        engineRef.current.timers.push(timeoutId);
      };

      const timeoutId = window.setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, delay);
      timers.push(timeoutId);
    };

    engineRef.current = { context, sources, timers };
    window.speechSynthesis?.cancel();
    speakMemoryLine(450);
    setIsPlaying(true);
  }

  function stop() {
    stopAtmosphere(engineRef.current);
    engineRef.current = null;
    setIsPlaying(false);
  }

  function toggle() {
    if (isPlaying) {
      stop();
      return;
    }

    start().catch(() => {
      stop();
    });
  }

  return { isPlaying, toggle };
}

export default function DemoDayPage({ currencyCode = "AED", onAddToCart }) {
  const [selectedSlug, setSelectedSlug] = useState("past-box");
  const [isOpen, setIsOpen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [activeCompanionKey, setActiveCompanionKey] = useState(companionFlows[0].key);
  const { isPlaying, toggle } = useMemoryAtmosphere();

  const selectedBox = useMemo(
    () => boxCatalog.find((box) => box.slug === selectedSlug) ?? boxCatalog[0],
    [selectedSlug],
  );
  const selectedItem = selectedBox.items[selectedItemIndex] ?? selectedBox.items[0];
  const palette = themePalettes[selectedBox.theme] ?? themePalettes.sand;
  const activeCompanion =
    companionFlows.find((flow) => flow.key === activeCompanionKey) ?? companionFlows[0];

  useEffect(() => {
    setSelectedItemIndex(0);
  }, [selectedSlug]);

  function handleBoxChange(slug) {
    setSelectedSlug(slug);
    setIsOpen(false);
  }

  function handleCompanionSelect(flowKey) {
    setActiveCompanionKey(flowKey);

    if (flowKey === "voice" && !isPlaying) {
      toggle();
    }
  }

  function handleCompanionPrimary() {
    if (activeCompanion.key === "voice") {
      toggle();
      return;
    }

    if (activeCompanion.key === "prompt") {
      setSelectedItemIndex((current) => (current + 1) % selectedBox.items.length);
      return;
    }

    if (activeCompanion.key === "caregiver") {
      setIsOpen(true);
      return;
    }

    if (activeCompanion.key === "checkout") {
      onAddToCart?.(selectedBox.slug);
    }
  }

  return (
    <section
      className={`jd-page jd-page--${selectedBox.theme}`}
      style={{ "--jd-accent": palette.ribbon, "--jd-deep": palette.deep }}
    >
      <div className="jd-atmosphere" aria-hidden="true">
        <span className="jd-atmosphere__line jd-atmosphere__line--one" />
        <span className="jd-atmosphere__line jd-atmosphere__line--two" />
        <span className="jd-atmosphere__line jd-atmosphere__line--three" />
      </div>

      <section className="jd-hero">
        <div className="jd-copy">
          <p className="jh-eyebrow">Pitch Day Experience</p>
          <h1>Judhoor Demo Day</h1>
          <p>
            A cinematic, touch-ready 3D unboxing built for the moment the audience
            needs to feel why these boxes matter.
          </p>
          <div className="jd-hero__actions">
            <button
              type="button"
              className="jh-button jh-button--solid"
              onClick={() => setIsOpen((current) => !current)}
            >
              {isOpen ? "Close the box" : "Open the box"}
            </button>
            <button
              type="button"
              className="jh-button jh-button--ghost"
              aria-pressed={isPlaying}
              onClick={toggle}
            >
              {isPlaying ? "Stop voices" : "Play natural voices"}
            </button>
          </div>
        </div>

        <div className="jd-stage" data-open={isOpen ? "true" : "false"}>
          <DemoThreeScene box={selectedBox} isOpen={isOpen} autoRotate={autoRotate} />
          <div className="jd-stage__shade" aria-hidden="true" />
          <div className="jd-stage__controls">
            <div className="jd-selector" aria-label="Choose a box">
              {boxCatalog.map((box) => (
                <button
                  key={box.slug}
                  type="button"
                  className={box.slug === selectedSlug ? "jd-selector__button is-active" : "jd-selector__button"}
                  aria-pressed={box.slug === selectedSlug}
                  onClick={() => handleBoxChange(box.slug)}
                >
                  <span>{box.name.replace(" Box", "")}</span>
                  <small>{box.tagline}</small>
                </button>
              ))}
            </div>
            <div className="jd-control-row">
              <button
                type="button"
                className={isOpen ? "jd-icon-button is-active" : "jd-icon-button"}
                aria-pressed={isOpen}
                onClick={() => setIsOpen((current) => !current)}
              >
                {isOpen ? "Close" : "Open"}
              </button>
              <button
                type="button"
                className={autoRotate ? "jd-icon-button is-active" : "jd-icon-button"}
                aria-pressed={autoRotate}
                onClick={() => setAutoRotate((current) => !current)}
              >
                360
              </button>
              <button
                type="button"
                className={isPlaying ? "jd-icon-button is-active" : "jd-icon-button"}
                aria-pressed={isPlaying}
                onClick={toggle}
              >
                Voices
              </button>
            </div>
          </div>
          <div className="jd-stage__caption">
            <strong>{selectedBox.name}</strong>
            <span>{getItemCount(selectedBox)} curated items</span>
          </div>
        </div>
      </section>

      <section className="jd-details">
        <article className="jd-spotlight">
          <div className="jd-spotlight__media">
            <img src={selectedItem.sprite} alt={selectedItem.name} />
          </div>
          <div className="jd-spotlight__copy">
            <p className="jh-eyebrow">Object Spotlight</p>
            <h2>{selectedItem.name}</h2>
            <p>{selectedItem.note}</p>
            <div className="jd-item-strip" aria-label={`${selectedBox.name} item selector`}>
              {selectedBox.items.slice(0, 8).map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  className={index === selectedItemIndex ? "jd-item-chip is-active" : "jd-item-chip"}
                  onClick={() => setSelectedItemIndex(index)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </article>

        <div className="jd-narrative">
          {presentationMoments.map((moment) => (
            <article key={moment.title} className="jd-moment">
              <span>{moment.label}</span>
              <h3>{moment.title}</h3>
              <p>{moment.body}</p>
            </article>
          ))}
        </div>

        <article className="jd-companion">
          <div>
            <p className="jh-eyebrow">Companion Flow</p>
            <h2>The physical box can move straight into a user-ready app demo.</h2>
          </div>
          <div className="jd-phone-demo" aria-label="Companion app preview">
            <div className="jd-phone-demo__screen">
              <div className="jd-phone-demo__brand">
                <img src={assetPath("/judhoor-logo.png")} alt="Judhoor logo" />
                <span>{selectedBox.name}</span>
              </div>
              <strong>{selectedBox.name.replace(" Box", "")}</strong>
              <span>{selectedBox.tagline}</span>
              <div className={`jd-phone-demo__panel jd-phone-demo__panel--${activeCompanion.key}`}>
                <small>{activeCompanion.key === "voice" && isPlaying ? "Playing now" : activeCompanion.status}</small>
                <h3>{activeCompanion.title}</h3>
                <p>{activeCompanion.body}</p>

                {activeCompanion.key === "voice" ? (
                  <div className={isPlaying ? "jd-voice-wave is-playing" : "jd-voice-wave"} aria-hidden="true">
                    {Array.from({ length: 18 }).map((_, index) => (
                      <span key={index} style={{ "--jd-wave-index": index }} />
                    ))}
                  </div>
                ) : null}

                {activeCompanion.key === "prompt" ? (
                  <blockquote>
                    "Which object from this box reminds you of someone you love?"
                  </blockquote>
                ) : null}

                {activeCompanion.key === "caregiver" ? (
                  <ul className="jd-care-list">
                    <li>One object at a time</li>
                    <li>Read prompts slowly</li>
                    <li>Let the elder lead</li>
                  </ul>
                ) : null}

                {activeCompanion.key === "checkout" ? (
                  <div className="jd-checkout-mini">
                    <span>{getItemCount(selectedBox)} items</span>
                    <strong>{selectedBox.price} {currencyCode}</strong>
                  </div>
                ) : null}

                <button type="button" className="jd-phone-demo__primary" onClick={handleCompanionPrimary}>
                  {activeCompanion.key === "voice" && isPlaying ? "Pause voice" : activeCompanion.cta}
                </button>
              </div>
              <div className="jd-phone-demo__tabs">
                {companionFlows.map((flow) => (
                  <button
                    key={flow.key}
                    type="button"
                    className={flow.key === activeCompanion.key ? "is-active" : ""}
                    aria-pressed={flow.key === activeCompanion.key}
                    onClick={() => handleCompanionSelect(flow.key)}
                  >
                    {flow.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="jd-companion__actions">
            <NavLink to="/shop" className="jh-button jh-button--ghost">
              Open shop demo
            </NavLink>
            <button
              type="button"
              className="jh-button jh-button--solid"
              onClick={() => onAddToCart?.(selectedBox.slug)}
            >
              Add demo box
            </button>
          </div>
        </article>
      </section>
    </section>
  );
}
