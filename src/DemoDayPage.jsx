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

function createSceneModel(box, textureLoader) {
  const palette = themePalettes[box.theme] ?? themePalettes.sand;
  const group = new THREE.Group();
  group.rotation.set(-0.12, 0.22, 0);

  const meshesToDispose = [];
  const texturesToDispose = [];
  const materialsToDispose = [];

  function createMaterial(MaterialConstructor, options) {
    const material = new MaterialConstructor(options);
    materialsToDispose.push(material);
    return material;
  }

  function track(mesh) {
    meshesToDispose.push(mesh);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  function fitImagePlane(mesh, texture, maxWidth, maxHeight) {
    const image = texture.image;
    if (!image?.width || !image?.height) {
      return;
    }

    const aspect = image.width / image.height;
    let width = maxWidth;
    let height = width / aspect;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspect;
    }

    mesh.scale.set(width, height, 1);
    mesh.userData.fitWidth = width;
    mesh.userData.fitHeight = height;
  }

  function loadSceneTexture(src, onLoad) {
    const texture = textureLoader.load(src, (loadedTexture) => {
      loadedTexture.colorSpace = THREE.SRGBColorSpace;
      loadedTexture.anisotropy = 8;
      onLoad?.(loadedTexture);
    });

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texturesToDispose.push(texture);
    return texture;
  }

  function addPart(parent, geometry, material, position, rotation = [0, 0, 0], edgeOpacity = 0.12) {
    const mesh = track(new THREE.Mesh(geometry, material));
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    parent.add(mesh);

    const edge = track(new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      createMaterial(THREE.LineBasicMaterial, {
        color: palette.metal,
        transparent: true,
        opacity: edgeOpacity,
      }),
    ));
    edge.position.copy(mesh.position);
    edge.rotation.copy(mesh.rotation);
    parent.add(edge);

    return mesh;
  }

  const frameMaterial = createMaterial(THREE.MeshStandardMaterial, {
    color: palette.deep,
    roughness: 0.72,
    metalness: 0.06,
    transparent: true,
    opacity: 0.06,
  });
  const glowMaterial = createMaterial(THREE.MeshBasicMaterial, {
    color: palette.glow,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
  });
  const outerMaterial = createMaterial(THREE.MeshStandardMaterial, {
    color: palette.base,
    roughness: 0.66,
    metalness: 0.04,
  });
  const sideMaterial = createMaterial(THREE.MeshStandardMaterial, {
    color: palette.deep,
    roughness: 0.78,
    metalness: 0.05,
  });
  const interiorMaterial = createMaterial(THREE.MeshStandardMaterial, {
    color: palette.inside,
    roughness: 0.74,
    metalness: 0.02,
  });
  const trimMaterial = createMaterial(THREE.MeshStandardMaterial, {
    color: palette.metal,
    roughness: 0.38,
    metalness: 0.32,
  });

  const trayWidth = 5.7;
  const trayDepth = 3.82;
  const trayFloorHeight = 0.22;
  const wallHeight = 0.78;
  const wallThickness = 0.16;
  const lidWidth = trayWidth + 0.46;
  const lidDepth = trayDepth + 0.48;
  const lidThickness = 0.22;

  const boxGroup = new THREE.Group();
  boxGroup.position.set(0, 0.08, 0);
  group.add(boxGroup);

  addPart(
    boxGroup,
    new THREE.BoxGeometry(trayWidth, trayFloorHeight, trayDepth),
    interiorMaterial,
    [0, trayFloorHeight / 2, 0],
    [0, 0, 0],
    0.2,
  );
  addPart(
    boxGroup,
    new THREE.BoxGeometry(trayWidth + wallThickness * 2, wallHeight, wallThickness),
    sideMaterial,
    [0, trayFloorHeight + wallHeight / 2, -trayDepth / 2],
  );
  addPart(
    boxGroup,
    new THREE.BoxGeometry(wallThickness, wallHeight, trayDepth),
    sideMaterial,
    [-trayWidth / 2, trayFloorHeight + wallHeight / 2, 0],
  );
  addPart(
    boxGroup,
    new THREE.BoxGeometry(wallThickness, wallHeight, trayDepth),
    sideMaterial,
    [trayWidth / 2, trayFloorHeight + wallHeight / 2, 0],
  );

  const frontPivot = new THREE.Group();
  frontPivot.position.set(0, trayFloorHeight, trayDepth / 2 + wallThickness / 2);
  boxGroup.add(frontPivot);
  addPart(
    frontPivot,
    new THREE.BoxGeometry(trayWidth + wallThickness * 2, wallHeight, wallThickness),
    sideMaterial,
    [0, wallHeight / 2, 0],
  );

  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, trayFloorHeight + wallHeight + 0.04, -lidDepth / 2);
  boxGroup.add(lidPivot);
  addPart(
    lidPivot,
    new THREE.BoxGeometry(lidWidth, lidThickness, lidDepth),
    outerMaterial,
    [0, lidThickness / 2, lidDepth / 2],
    [0, 0, 0],
    0.46,
  );
  addPart(
    lidPivot,
    new THREE.BoxGeometry(lidWidth, 0.38, wallThickness),
    sideMaterial,
    [0, -0.16, lidDepth - wallThickness / 2],
    [0, 0, 0],
    0.34,
  );
  addPart(
    lidPivot,
    new THREE.BoxGeometry(wallThickness, 0.38, lidDepth),
    sideMaterial,
    [-lidWidth / 2 + wallThickness / 2, -0.16, lidDepth / 2],
    [0, 0, 0],
    0.28,
  );
  addPart(
    lidPivot,
    new THREE.BoxGeometry(wallThickness, 0.38, lidDepth),
    sideMaterial,
    [lidWidth / 2 - wallThickness / 2, -0.16, lidDepth / 2],
    [0, 0, 0],
    0.28,
  );

  const lidPhotoMaterial = createMaterial(THREE.MeshBasicMaterial, {
    transparent: true,
    opacity: 0.98,
    side: THREE.DoubleSide,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  });
  const lidPhoto = track(new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    lidPhotoMaterial,
  ));
  lidPhoto.position.set(0, lidThickness + 0.014, lidDepth / 2);
  lidPhoto.rotation.x = -Math.PI / 2;
  lidPivot.add(lidPhoto);
  lidPhotoMaterial.map = loadSceneTexture(box.images[0], (texture) => {
    fitImagePlane(lidPhoto, texture, lidWidth * 0.86, lidDepth * 0.82);
  });

  const trimHeight = 0.08;
  [-0.9, 0.9].forEach((x) => {
    addPart(
      boxGroup,
      new THREE.BoxGeometry(0.08, wallHeight * 0.72, trayDepth - 0.46),
      trimMaterial,
      [x, trayFloorHeight + wallHeight * 0.36, 0],
      [0, 0, 0],
      0.2,
    );
  });
  [-0.54, 0.58].forEach((z) => {
    addPart(
      boxGroup,
      new THREE.BoxGeometry(trayWidth - 0.44, wallHeight * 0.68, 0.08),
      trimMaterial,
      [0, trayFloorHeight + wallHeight * 0.34, z],
      [0, 0, 0],
      0.2,
    );
  });
  addPart(
    boxGroup,
    new THREE.BoxGeometry(trayWidth + 0.22, trimHeight, 0.12),
    trimMaterial,
    [0, trayFloorHeight + wallHeight + trimHeight / 2, trayDepth / 2 + 0.02],
    [0, 0, 0],
    0.24,
  );
  addPart(
    boxGroup,
    new THREE.BoxGeometry(trayWidth + 0.22, trimHeight, 0.12),
    trimMaterial,
    [0, trayFloorHeight + wallHeight + trimHeight / 2, -trayDepth / 2 - 0.02],
    [0, 0, 0],
    0.24,
  );

  const productGroup = new THREE.Group();
  productGroup.position.set(0, 1.28, -0.88);
  productGroup.scale.setScalar(0.8);
  productGroup.visible = false;
  group.add(productGroup);

  const imageDepth = track(new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.8, 0.18), frameMaterial));
  imageDepth.position.set(0, 0, -0.12);
  productGroup.add(imageDepth);

  const primaryMaterial = createMaterial(THREE.MeshBasicMaterial, {
    transparent: true,
    opacity: 0.16,
    side: THREE.DoubleSide,
    depthWrite: false,
    toneMapped: false,
  });
  const primaryImage = track(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), primaryMaterial));
  primaryImage.position.set(0, 0.02, 0.03);
  productGroup.add(primaryImage);

  primaryMaterial.map = loadSceneTexture(box.images[0], (texture) => {
    fitImagePlane(primaryImage, texture, 7.2, 5.75);
    imageDepth.scale.set(
      Math.max(1, primaryImage.userData.fitWidth / 5.2),
      Math.max(1, primaryImage.userData.fitHeight / 3.8),
      1,
    );
  });

  const secondaryMaterial = createMaterial(THREE.MeshBasicMaterial, {
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
    toneMapped: false,
  });
  const secondaryImage = track(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), secondaryMaterial));
  secondaryImage.position.set(0, -0.52, 0.1);
  secondaryImage.scale.setScalar(0.72);
  productGroup.add(secondaryImage);

  secondaryMaterial.map = loadSceneTexture(box.images[1] ?? box.images[0], (texture) => {
    fitImagePlane(secondaryImage, texture, 5.9, 4.35);
  });

  const productGlow = track(new THREE.Mesh(new THREE.CircleGeometry(3.6, 72), glowMaterial));
  productGlow.rotation.x = -Math.PI / 2;
  productGlow.position.set(0, -2.08, -0.6);
  productGroup.add(productGlow);

  const itemGroup = new THREE.Group();
  itemGroup.position.set(0, 0, 0.08);
  const itemMeshes = box.items.slice(0, 7).map((item, index) => {
    const layout = itemLayouts[index] ?? itemLayouts[itemLayouts.length - 1];
    const texture = loadSceneTexture(item.sprite);

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(layout.size, layout.size),
      createMaterial(THREE.MeshBasicMaterial, {
        map: texture,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    mesh.position.set(layout.x, trayFloorHeight + 0.1, layout.z);
    mesh.rotation.set(-Math.PI / 2, 0, layout.rotation);
    mesh.userData = {
      targetY: trayFloorHeight + 0.14 + index * 0.012,
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
      createMaterial(THREE.MeshBasicMaterial, {
        map: cardTexture,
        transparent: true,
        opacity: 0.28,
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
    createMaterial(THREE.MeshBasicMaterial, {
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
    productGroup,
    primaryImage,
    secondaryImage,
    imageDepth,
    lidPhoto,
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
      materialsToDispose.forEach((material) => material.dispose());
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
    camera.position.set(0, 3.1, 10.4);
    camera.lookAt(0, 1.25, 0);

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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.className = "jd-three-canvas";
    host.appendChild(renderer.domElement);

    const ambientLight = new THREE.HemisphereLight("#fff6df", "#6f5b45", 2.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight("#fff3d2", 3.6);
    keyLight.position.set(-4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -8;
    keyLight.shadow.camera.right = 8;
    keyLight.shadow.camera.top = 8;
    keyLight.shadow.camera.bottom = -8;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 20;
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
      camera.position.z = width < 700 ? 11.8 : 10.4;
      camera.position.y = width < 700 ? 3.6 : 3.1;
      camera.lookAt(0, 1.25, 0);
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
      const openTarget = state.isOpen ? -Math.PI * 0.52 : 0;
      const frontTarget = state.isOpen ? Math.PI * 0.34 : 0;

      model.lidPivot.rotation.x += (openTarget - model.lidPivot.rotation.x) * 0.085;
      model.frontPivot.rotation.x += (frontTarget - model.frontPivot.rotation.x) * 0.075;

      const productScaleTarget = state.isOpen ? 0.9 : 0.72;
      model.productGroup.scale.x += (productScaleTarget - model.productGroup.scale.x) * 0.075;
      model.productGroup.scale.y += (productScaleTarget - model.productGroup.scale.y) * 0.075;
      model.productGroup.scale.z += (productScaleTarget - model.productGroup.scale.z) * 0.075;
      model.productGroup.position.y += ((state.isOpen ? 2.05 : 1.18) - model.productGroup.position.y) * 0.075;
      model.productGroup.position.z += ((state.isOpen ? -1.18 : -0.88) - model.productGroup.position.z) * 0.075;
      model.primaryImage.material.opacity += (0 - model.primaryImage.material.opacity) * 0.08;
      model.secondaryImage.material.opacity += (0 - model.secondaryImage.material.opacity) * 0.08;
      model.secondaryImage.position.y += ((state.isOpen ? -1.22 : -0.52) - model.secondaryImage.position.y) * 0.08;
      model.secondaryImage.position.z += ((state.isOpen ? 0.36 : 0.1) - model.secondaryImage.position.z) * 0.08;
      model.imageDepth.material.opacity += ((state.isOpen ? 0.08 : 0.02) - model.imageDepth.material.opacity) * 0.08;
      model.lidPhoto.material.opacity += ((state.isOpen ? 0.84 : 0.98) - model.lidPhoto.material.opacity) * 0.08;

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
