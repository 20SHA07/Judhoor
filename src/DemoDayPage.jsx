import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import * as THREE from "three";
import { boxCatalog } from "./judhoorData";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const getItemCount = (box) => box.itemCount ?? box.items?.length ?? 0;

const themePalettes = {
  sand: {
    base: "#d7b68a",
    deep: "#7a5231",
    inside: "#f3dfc3",
    ribbon: "#b9873e",
    metal: "#e6c173",
    glow: "#f3d39b",
  },
  sage: {
    base: "#8f9c82",
    deep: "#3f4e3f",
    inside: "#e6eadb",
    ribbon: "#c9b470",
    metal: "#e1c978",
    glow: "#c7d4b8",
  },
  rose: {
    base: "#c78e8b",
    deep: "#704141",
    inside: "#f4dddd",
    ribbon: "#d7b064",
    metal: "#f0c87d",
    glow: "#efbdba",
  },
  midnight: {
    base: "#233449",
    deep: "#132233",
    inside: "#e7d7b7",
    ribbon: "#c49a50",
    metal: "#d8b36b",
    glow: "#a6b4c6",
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

const companionMoments = [
  "QR voice message",
  "Family prompt card",
  "Caregiver note",
  "Demo checkout",
];

function createTextTexture(box, palette) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  context.fillStyle = palette.base;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.26)");
  gradient.addColorStop(0.42, "rgba(255, 255, 255, 0.04)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.18)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(255, 242, 203, 0.72)";
  context.lineWidth = 10;
  context.strokeRect(52, 52, canvas.width - 104, canvas.height - 104);

  context.fillStyle = "#fff7e7";
  context.textAlign = "center";
  context.font = "700 82px Georgia, serif";
  context.fillText("Judhoor", canvas.width / 2, 176);
  context.font = "600 54px Georgia, serif";
  context.fillText(box.name, canvas.width / 2, 286);
  context.font = "500 32px Arial, sans-serif";
  context.fillText(box.tagline, canvas.width / 2, 362);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function createSceneModel(box, textureLoader) {
  const palette = themePalettes[box.theme] ?? themePalettes.sand;
  const group = new THREE.Group();
  group.rotation.set(-0.16, 0.42, 0);

  const dimensions = { width: 4.8, depth: 3.2, height: 1.24, thickness: 0.14 };
  const { width, depth, height, thickness } = dimensions;
  const matExterior = new THREE.MeshStandardMaterial({
    color: palette.base,
    roughness: 0.55,
    metalness: 0.08,
  });
  const matInterior = new THREE.MeshStandardMaterial({
    color: palette.inside,
    roughness: 0.78,
    metalness: 0.02,
  });
  const matDeep = new THREE.MeshStandardMaterial({
    color: palette.deep,
    roughness: 0.58,
    metalness: 0.05,
  });
  const matGold = new THREE.MeshStandardMaterial({
    color: palette.metal,
    roughness: 0.32,
    metalness: 0.44,
  });

  const meshesToDispose = [];
  const texturesToDispose = [];

  function track(mesh) {
    meshesToDispose.push(mesh);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  const floor = track(
    new THREE.Mesh(new THREE.BoxGeometry(width, thickness, depth), matInterior),
  );
  floor.position.y = thickness / 2;
  group.add(floor);

  const back = track(
    new THREE.Mesh(new THREE.BoxGeometry(width, height, thickness), matExterior),
  );
  back.position.set(0, height / 2 + thickness, -depth / 2);
  group.add(back);

  const left = track(
    new THREE.Mesh(new THREE.BoxGeometry(thickness, height, depth), matExterior),
  );
  left.position.set(-width / 2, height / 2 + thickness, 0);
  group.add(left);

  const right = track(
    new THREE.Mesh(new THREE.BoxGeometry(thickness, height, depth), matExterior),
  );
  right.position.set(width / 2, height / 2 + thickness, 0);
  group.add(right);

  const frontPivot = new THREE.Group();
  frontPivot.position.set(0, thickness, depth / 2);
  const front = track(
    new THREE.Mesh(new THREE.BoxGeometry(width, height, thickness), matExterior),
  );
  front.position.set(0, height / 2, 0);
  frontPivot.add(front);
  group.add(frontPivot);

  const labelTexture = createTextTexture(box, palette);
  texturesToDispose.push(labelTexture);

  const frontLabel = track(
    new THREE.Mesh(
      new THREE.PlaneGeometry(2.45, 0.74),
      new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
        toneMapped: false,
      }),
    ),
  );
  frontLabel.position.set(0, height / 2 + 0.02, thickness / 2 + 0.006);
  frontPivot.add(frontLabel);

  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, height + thickness * 1.45, -depth / 2);
  const lid = track(
    new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.24, thickness, depth + 0.24),
      matExterior,
    ),
  );
  lid.position.set(0, 0, depth / 2);
  lidPivot.add(lid);

  const lidLabel = track(
    new THREE.Mesh(
      new THREE.PlaneGeometry(2.62, 1.32),
      new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
        toneMapped: false,
      }),
    ),
  );
  lidLabel.rotation.x = -Math.PI / 2;
  lidLabel.position.set(0, thickness / 2 + 0.009, depth / 2);
  lidPivot.add(lidLabel);
  group.add(lidPivot);

  const ribbonVertical = track(
    new THREE.Mesh(new THREE.BoxGeometry(0.14, thickness + 0.02, depth + 0.32), matGold),
  );
  ribbonVertical.position.set(0, height + thickness * 1.55, 0);
  group.add(ribbonVertical);

  const ribbonHorizontal = track(
    new THREE.Mesh(new THREE.BoxGeometry(width + 0.3, thickness + 0.024, 0.14), matGold),
  );
  ribbonHorizontal.position.set(0, height + thickness * 1.57, 0);
  group.add(ribbonHorizontal);

  const logoTexture = textureLoader.load(assetPath("/judhoor-logo.png"));
  logoTexture.colorSpace = THREE.SRGBColorSpace;
  texturesToDispose.push(logoTexture);
  const logo = track(
    new THREE.Mesh(
      new THREE.PlaneGeometry(0.82, 0.82),
      new THREE.MeshBasicMaterial({
        map: logoTexture,
        transparent: true,
        toneMapped: false,
      }),
    ),
  );
  logo.rotation.x = -Math.PI / 2;
  logo.position.set(0, thickness / 2 + 0.014, depth / 2 - 0.78);
  lidPivot.add(logo);

  const itemGroup = new THREE.Group();
  const itemMeshes = box.items.slice(0, 7).map((item, index) => {
    const layout = itemLayouts[index] ?? itemLayouts[itemLayouts.length - 1];
    const texture = textureLoader.load(item.sprite);
    texture.colorSpace = THREE.SRGBColorSpace;
    texturesToDispose.push(texture);

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(layout.size, layout.size),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    mesh.position.set(layout.x, 0.22, layout.z);
    mesh.rotation.y = layout.rotation;
    mesh.userData = {
      targetY: layout.y,
      baseX: layout.x,
      baseZ: layout.z,
      delay: index * 0.12,
    };
    itemGroup.add(mesh);
    return mesh;
  });
  group.add(itemGroup);

  const memoryCards = new THREE.Group();
  ["Story", "Family", "Voice", "Care", "Roots", "Ritual"].forEach((word, index) => {
    const cardCanvas = document.createElement("canvas");
    cardCanvas.width = 512;
    cardCanvas.height = 288;
    const ctx = cardCanvas.getContext("2d");
    ctx.fillStyle = "rgba(255, 247, 229, 0.88)";
    ctx.fillRect(0, 0, cardCanvas.width, cardCanvas.height);
    ctx.strokeStyle = palette.metal;
    ctx.lineWidth = 8;
    ctx.strokeRect(24, 24, cardCanvas.width - 48, cardCanvas.height - 48);
    ctx.fillStyle = palette.deep;
    ctx.textAlign = "center";
    ctx.font = "700 52px Georgia, serif";
    ctx.fillText(word, cardCanvas.width / 2, 166);

    const cardTexture = new THREE.CanvasTexture(cardCanvas);
    cardTexture.colorSpace = THREE.SRGBColorSpace;
    texturesToDispose.push(cardTexture);
    const card = new THREE.Mesh(
      new THREE.PlaneGeometry(0.82, 0.46),
      new THREE.MeshBasicMaterial({
        map: cardTexture,
        transparent: true,
        opacity: 0.62,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    );
    const angle = (index / 6) * Math.PI * 2;
    card.position.set(Math.cos(angle) * 4.2, 1.9 + index * 0.08, Math.sin(angle) * 3.3);
    card.rotation.set(-0.18, -angle + Math.PI / 2, 0.08);
    card.userData = { angle, speed: 0.18 + index * 0.018, y: card.position.y };
    memoryCards.add(card);
  });
  group.add(memoryCards);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(3.8, 72),
    new THREE.MeshBasicMaterial({
      color: "#2f251d",
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.01;
  group.add(shadow);
  meshesToDispose.push(shadow);

  return {
    group,
    frontPivot,
    lidPivot,
    itemMeshes,
    memoryCards,
    palette,
    dispose() {
      meshesToDispose.forEach((mesh) => {
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => material.dispose());
        } else {
          mesh.material?.dispose();
        }
      });
      texturesToDispose.forEach((texture) => texture.dispose());
      [matExterior, matInterior, matDeep, matGold].forEach((material) => material.dispose());
    },
  };
}

function DemoThreeScene({ box, isOpen, autoRotate }) {
  const hostRef = useRef(null);
  const stateRef = useRef({
    isOpen,
    autoRotate,
    dragging: false,
    baseX: 0,
    baseY: 0,
    startX: 0,
    startY: 0,
  });

  useEffect(() => {
    stateRef.current.isOpen = isOpen;
    stateRef.current.autoRotate = autoRotate;
  }, [isOpen, autoRotate]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
    camera.position.set(0, 3.2, 8.2);
    camera.lookAt(0, 0.8, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "jd-three-canvas";
    host.appendChild(renderer.domElement);

    const ambientLight = new THREE.HemisphereLight("#fff6df", "#6f5b45", 2.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight("#fff3d2", 3.6);
    keyLight.position.set(-4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight("#d8af6a", 1.8, 18);
    fillLight.position.set(4, 3, 3);
    scene.add(fillLight);

    const textureLoader = new THREE.TextureLoader();
    let model = createSceneModel(box, textureLoader);
    scene.add(model.group);

    function resize() {
      const bounds = host.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 700 ? 9.4 : 8.2;
      camera.position.y = width < 700 ? 3.8 : 3.2;
      camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    function handlePointerDown(event) {
      event.preventDefault();
      renderer.domElement.setPointerCapture?.(event.pointerId);
      stateRef.current.dragging = true;
      stateRef.current.startX = event.clientX;
      stateRef.current.startY = event.clientY;
      stateRef.current.baseX = model.group.rotation.x;
      stateRef.current.baseY = model.group.rotation.y;
    }

    function handlePointerMove(event) {
      if (!stateRef.current.dragging) {
        return;
      }

      const deltaX = event.clientX - stateRef.current.startX;
      const deltaY = event.clientY - stateRef.current.startY;
      model.group.rotation.y = stateRef.current.baseY + deltaX * 0.012;
      model.group.rotation.x = clamp(
        stateRef.current.baseX + deltaY * 0.008,
        -0.58,
        0.34,
      );
    }

    function handlePointerUp(event) {
      renderer.domElement.releasePointerCapture?.(event.pointerId);
      stateRef.current.dragging = false;
    }

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);
    renderer.domElement.addEventListener("pointercancel", handlePointerUp);

    let frameId = 0;
    function animate() {
      const elapsed = performance.now() * 0.001;
      const state = stateRef.current;
      const openTarget = state.isOpen ? -Math.PI * 0.72 : 0;
      const frontTarget = state.isOpen ? Math.PI * 0.43 : 0;

      model.lidPivot.rotation.x += (openTarget - model.lidPivot.rotation.x) * 0.085;
      model.frontPivot.rotation.x += (frontTarget - model.frontPivot.rotation.x) * 0.075;

      model.itemMeshes.forEach((mesh, index) => {
        const targetOpacity = state.isOpen ? 1 : 0;
        const targetY = state.isOpen
          ? mesh.userData.targetY + Math.sin(elapsed * 1.7 + index) * 0.035
          : 0.22;
        mesh.position.y += (targetY - mesh.position.y) * 0.08;
        mesh.position.x =
          mesh.userData.baseX + (state.isOpen ? Math.sin(elapsed * 1.2 + index) * 0.025 : 0);
        mesh.position.z =
          mesh.userData.baseZ + (state.isOpen ? Math.cos(elapsed * 1.05 + index) * 0.025 : 0);
        mesh.material.opacity += (targetOpacity - mesh.material.opacity) * 0.075;
        const targetScale = state.isOpen ? 1 : 0.72;
        mesh.scale.x += (targetScale - mesh.scale.x) * 0.08;
        mesh.scale.y += (targetScale - mesh.scale.y) * 0.08;
      });

      model.memoryCards.children.forEach((card) => {
        const angle = card.userData.angle + elapsed * card.userData.speed;
        card.position.x = Math.cos(angle) * 4.2;
        card.position.z = Math.sin(angle) * 3.3;
        card.position.y = card.userData.y + Math.sin(elapsed * 1.1 + card.userData.angle) * 0.16;
        card.rotation.y = -angle + Math.PI / 2;
      });

      if (state.autoRotate && !state.dragging) {
        model.group.rotation.y += 0.006;
      }

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("pointercancel", handlePointerUp);
      scene.remove(model.group);
      model.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [box]);

  return <div ref={hostRef} className="jd-three-host" aria-label={`${box.name} 3D stage`} />;
}

function stopAtmosphere(engine) {
  if (!engine) {
    return;
  }

  engine.timers.forEach((timerId) => window.clearInterval(timerId));
  engine.sources.forEach((source) => {
    try {
      source.stop();
    } catch {
      // Already stopped.
    }
  });
  engine.context.close();
}

function useMemoryAtmosphere() {
  const [isPlaying, setIsPlaying] = useState(false);
  const engineRef = useRef(null);

  useEffect(() => () => stopAtmosphere(engineRef.current), []);

  async function start() {
    if (engineRef.current) {
      return;
    }

    const context = new AudioContext();
    await context.resume();

    const master = context.createGain();
    master.gain.value = 0.0001;
    master.connect(context.destination);
    master.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 1.2);

    const sources = [];
    const timers = [];

    const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let index = 0; index < noiseData.length; index += 1) {
      noiseData[index] = (Math.random() * 2 - 1) * 0.18;
    }

    const roomSource = context.createBufferSource();
    roomSource.buffer = noiseBuffer;
    roomSource.loop = true;
    const roomFilter = context.createBiquadFilter();
    roomFilter.type = "bandpass";
    roomFilter.frequency.value = 420;
    roomFilter.Q.value = 0.7;
    const roomGain = context.createGain();
    roomGain.gain.value = 0.1;
    roomSource.connect(roomFilter).connect(roomGain).connect(master);
    roomSource.start();
    sources.push(roomSource);

    [118, 145, 172, 208].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = index % 2 === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;

      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 720 + index * 120;

      const voiceGain = context.createGain();
      voiceGain.gain.value = 0.0001;
      oscillator.connect(filter).connect(voiceGain).connect(master);
      oscillator.start();
      sources.push(oscillator);

      const timerId = window.setInterval(() => {
        const now = context.currentTime;
        const nextFrequency = frequency + (Math.random() - 0.5) * 26;
        const nextGain = 0.018 + Math.random() * 0.038;
        oscillator.frequency.cancelScheduledValues(now);
        oscillator.frequency.linearRampToValueAtTime(nextFrequency, now + 0.22);
        voiceGain.gain.cancelScheduledValues(now);
        voiceGain.gain.setValueAtTime(voiceGain.gain.value, now);
        voiceGain.gain.linearRampToValueAtTime(nextGain, now + 0.24);
        voiceGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2 + Math.random() * 0.9);
      }, 620 + index * 170);
      timers.push(timerId);
    });

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

    engineRef.current = { context, sources, timers };
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

    start();
  }

  return { isPlaying, toggle };
}

export default function DemoDayPage({ currencyCode = "AED", onAddToCart }) {
  const [selectedSlug, setSelectedSlug] = useState("past-box");
  const [isOpen, setIsOpen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const { isPlaying, toggle } = useMemoryAtmosphere();

  const selectedBox = useMemo(
    () => boxCatalog.find((box) => box.slug === selectedSlug) ?? boxCatalog[0],
    [selectedSlug],
  );
  const selectedItem = selectedBox.items[selectedItemIndex] ?? selectedBox.items[0];
  const palette = themePalettes[selectedBox.theme] ?? themePalettes.sand;

  useEffect(() => {
    setSelectedItemIndex(0);
  }, [selectedSlug]);

  function handleBoxChange(slug) {
    setSelectedSlug(slug);
    setIsOpen(false);
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
              {isPlaying ? "Stop atmosphere" : "Start atmosphere"}
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
                Audio
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
              <img src={assetPath("/judhoor-logo.png")} alt="Judhoor logo" />
              <strong>{selectedBox.name}</strong>
              <span>{selectedBox.tagline}</span>
              {companionMoments.map((moment) => (
                <button key={moment} type="button">
                  {moment}
                </button>
              ))}
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
