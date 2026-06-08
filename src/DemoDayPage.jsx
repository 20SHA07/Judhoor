import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
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

function createRoundedRectShape(width, depth, radius) {
  const safeRadius = clamp(radius, 0.001, Math.min(width, depth) / 2 - 0.001);
  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  const shape = new THREE.Shape();

  shape.moveTo(-halfWidth + safeRadius, -halfDepth);
  shape.lineTo(halfWidth - safeRadius, -halfDepth);
  shape.quadraticCurveTo(halfWidth, -halfDepth, halfWidth, -halfDepth + safeRadius);
  shape.lineTo(halfWidth, halfDepth - safeRadius);
  shape.quadraticCurveTo(halfWidth, halfDepth, halfWidth - safeRadius, halfDepth);
  shape.lineTo(-halfWidth + safeRadius, halfDepth);
  shape.quadraticCurveTo(-halfWidth, halfDepth, -halfWidth, halfDepth - safeRadius);
  shape.lineTo(-halfWidth, -halfDepth + safeRadius);
  shape.quadraticCurveTo(-halfWidth, -halfDepth, -halfWidth + safeRadius, -halfDepth);

  return shape;
}

function createRoundedBoxGeometry(width, height, depth, radius = 0.08, bevel = 0.018) {
  const safeBevel = Math.min(bevel, height * 0.28, width * 0.08, depth * 0.08);
  const geometry = new THREE.ExtrudeGeometry(createRoundedRectShape(width, depth, radius), {
    depth: height,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: safeBevel,
    bevelThickness: safeBevel,
    curveSegments: 12,
    steps: 1,
  });

  geometry.rotateX(-Math.PI / 2);
  geometry.computeVertexNormals();
  return geometry;
}

function createSceneModel(box, textureLoader) {
  const palette = themePalettes[box.theme] ?? themePalettes.sand;
  const group = new THREE.Group();
  group.rotation.set(-0.22, 0.34, -0.015);

  const meshesToDispose = [];
  const texturesToDispose = [];
  const materialsToDispose = [];

  function createMaterial(MaterialConstructor, options) {
    const material = new MaterialConstructor(options);
    materialsToDispose.push(material);
    return material;
  }

  function track(mesh, { castShadow = true, receiveShadow = true } = {}) {
    meshesToDispose.push(mesh);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;
    return mesh;
  }

  function createSeededRandom(seedText) {
    let seed = 2166136261;
    for (let index = 0; index < seedText.length; index += 1) {
      seed ^= seedText.charCodeAt(index);
      seed = Math.imul(seed, 16777619);
    }

    return () => {
      seed = Math.imul(seed + 0x6d2b79f5, 0x85ebca6b);
      seed ^= seed >>> 13;
      return ((seed >>> 0) % 10000) / 10000;
    };
  }

  function cssColor(color, alpha = 1) {
    const parsed = new THREE.Color(color);
    return `rgba(${Math.round(parsed.r * 255)}, ${Math.round(parsed.g * 255)}, ${Math.round(parsed.b * 255)}, ${alpha})`;
  }

  function createCanvasTexture(width, height, draw) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    draw(context, canvas);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texturesToDispose.push(texture);
    return texture;
  }

  function createPaperTexture(baseColor, fiberColor, seedText) {
    const random = createSeededRandom(seedText);
    const texture = createCanvasTexture(768, 768, (ctx, canvas) => {
      ctx.fillStyle = cssColor(baseColor);
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let index = 0; index < 1800; index += 1) {
        const alpha = 0.025 + random() * 0.07;
        const x = random() * canvas.width;
        const y = random() * canvas.height;
        const length = 4 + random() * 34;
        const rotation = (random() - 0.5) * 0.28;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.strokeStyle = random() > 0.48
          ? cssColor("#fff8ec", alpha)
          : cssColor(fiberColor, alpha);
        ctx.lineWidth = 0.6 + random() * 1.4;
        ctx.beginPath();
        ctx.moveTo(-length / 2, 0);
        ctx.lineTo(length / 2, 0);
        ctx.stroke();
        ctx.restore();
      }

      for (let index = 0; index < 260; index += 1) {
        ctx.fillStyle = cssColor(fiberColor, 0.025 + random() * 0.04);
        ctx.fillRect(random() * canvas.width, random() * canvas.height, 1 + random() * 3, 1);
      }
    });
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.6, 1.35);
    return texture;
  }

  function createPaperBumpTexture(seedText) {
    const random = createSeededRandom(seedText);
    const texture = createCanvasTexture(512, 512, (ctx, canvas) => {
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let index = 0; index < 1500; index += 1) {
        const tone = 106 + Math.floor(random() * 70);
        ctx.fillStyle = `rgb(${tone}, ${tone}, ${tone})`;
        ctx.fillRect(random() * canvas.width, random() * canvas.height, 1 + random() * 5, 1);
      }
    });
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2.4, 2.1);
    return texture;
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

  function addRoundedPart(
    parent,
    dimensions,
    material,
    position,
    rotation = [0, 0, 0],
    radius = 0.06,
    bevel = 0.014,
  ) {
    const [width, height, depth] = dimensions;
    const mesh = track(new THREE.Mesh(
      createRoundedBoxGeometry(width, height, depth, radius, bevel),
      material,
    ));
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    parent.add(mesh);
    return mesh;
  }

  function createLidTitleTexture() {
    return createCanvasTexture(1200, 760, (ctx, canvas) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = cssColor(palette.metal, 0.76);
      ctx.lineWidth = 8;
      ctx.strokeRect(82, 86, canvas.width - 164, canvas.height - 172);

      ctx.strokeStyle = cssColor(palette.metal, 0.38);
      ctx.lineWidth = 2;
      ctx.strokeRect(118, 122, canvas.width - 236, canvas.height - 244);

      ctx.fillStyle = cssColor(palette.metal, 0.88);
      ctx.textAlign = "center";
      ctx.letterSpacing = "10px";
      ctx.font = "700 54px Georgia, serif";
      ctx.fillText("JUDHOOR", canvas.width / 2, 225);

      ctx.letterSpacing = "0px";
      ctx.fillStyle = cssColor(palette.deep, 0.92);
      ctx.font = "700 102px Georgia, serif";
      ctx.fillText(box.name.replace(" Box", ""), canvas.width / 2, 380);

      ctx.fillStyle = cssColor(palette.deep, 0.64);
      ctx.font = "500 42px Georgia, serif";
      ctx.fillText(box.tagline, canvas.width / 2, 460);

      ctx.strokeStyle = cssColor(palette.metal, 0.72);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 210, 532);
      ctx.lineTo(canvas.width / 2 - 54, 532);
      ctx.moveTo(canvas.width / 2 + 54, 532);
      ctx.lineTo(canvas.width / 2 + 210, 532);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(canvas.width / 2, 532, 24, 0, Math.PI * 2);
      ctx.stroke();
    });
  }

  const outerPaper = createPaperTexture(palette.base, palette.deep, `${box.slug}-outer`);
  const outerBump = createPaperBumpTexture(`${box.slug}-outer-bump`);
  const sidePaper = createPaperTexture(palette.deep, "#fff4df", `${box.slug}-side`);
  const sideBump = createPaperBumpTexture(`${box.slug}-side-bump`);
  const linerPaper = createPaperTexture(palette.inside, palette.deep, `${box.slug}-liner`);
  const linerBump = createPaperBumpTexture(`${box.slug}-liner-bump`);

  const outerMaterial = createMaterial(THREE.MeshStandardMaterial, {
    color: palette.base,
    map: outerPaper,
    bumpMap: outerBump,
    bumpScale: 0.022,
    roughness: 0.94,
    metalness: 0.015,
  });
  const sideMaterial = createMaterial(THREE.MeshStandardMaterial, {
    color: palette.deep,
    map: sidePaper,
    bumpMap: sideBump,
    bumpScale: 0.014,
    roughness: 0.9,
    metalness: 0.02,
  });
  const interiorMaterial = createMaterial(THREE.MeshStandardMaterial, {
    color: palette.inside,
    map: linerPaper,
    bumpMap: linerBump,
    bumpScale: 0.018,
    roughness: 0.96,
    metalness: 0.02,
  });
  const linerMaterial = createMaterial(THREE.MeshStandardMaterial, {
    color: palette.lining,
    map: linerPaper,
    bumpMap: linerBump,
    bumpScale: 0.012,
    roughness: 0.94,
    metalness: 0.01,
  });
  const trimMaterial = createMaterial(THREE.MeshStandardMaterial, {
    color: palette.metal,
    roughness: 0.34,
    metalness: 0.48,
  });
  const softShadowMaterial = createMaterial(THREE.ShadowMaterial, {
    color: "#261a12",
    transparent: true,
    opacity: 0.28,
  });

  const trayWidth = 5.75;
  const trayDepth = 3.95;
  const trayFloorHeight = 0.22;
  const wallHeight = 0.76;
  const wallThickness = 0.24;
  const outerWidth = trayWidth + wallThickness * 2;
  const outerDepth = trayDepth + wallThickness * 2;
  const lidWidth = outerWidth + 0.28;
  const lidDepth = outerDepth + 0.3;
  const lidThickness = 0.24;
  const lidSkirtHeight = 0.48;

  const boxGroup = new THREE.Group();
  boxGroup.position.set(0, 0.1, 0);
  group.add(boxGroup);

  addRoundedPart(
    boxGroup,
    [outerWidth, trayFloorHeight, outerDepth],
    sideMaterial,
    [0, trayFloorHeight / 2, 0],
    [0, 0, 0],
    0.2,
    0.025,
  );
  addRoundedPart(
    boxGroup,
    [trayWidth - 0.12, 0.06, trayDepth - 0.12],
    interiorMaterial,
    [0, trayFloorHeight + 0.03, 0],
    [0, 0, 0],
    0.16,
    0.01,
  );
  addRoundedPart(
    boxGroup,
    [outerWidth, wallHeight, wallThickness],
    sideMaterial,
    [0, trayFloorHeight + wallHeight / 2, -trayDepth / 2 - wallThickness / 2],
    [0, 0, 0],
    0.08,
    0.018,
  );
  addRoundedPart(
    boxGroup,
    [wallThickness, wallHeight, outerDepth],
    sideMaterial,
    [-trayWidth / 2 - wallThickness / 2, trayFloorHeight + wallHeight / 2, 0],
    [0, 0, 0],
    0.08,
    0.018,
  );
  addRoundedPart(
    boxGroup,
    [wallThickness, wallHeight, outerDepth],
    sideMaterial,
    [trayWidth / 2 + wallThickness / 2, trayFloorHeight + wallHeight / 2, 0],
    [0, 0, 0],
    0.08,
    0.018,
  );
  addRoundedPart(
    boxGroup,
    [trayWidth - 0.14, wallHeight * 0.82, 0.045],
    linerMaterial,
    [0, trayFloorHeight + wallHeight / 2, -trayDepth / 2 + 0.035],
    [0, 0, 0],
    0.035,
    0.006,
  );
  addRoundedPart(
    boxGroup,
    [0.045, wallHeight * 0.82, trayDepth - 0.14],
    linerMaterial,
    [-trayWidth / 2 + 0.035, trayFloorHeight + wallHeight / 2, 0],
    [0, 0, 0],
    0.035,
    0.006,
  );
  addRoundedPart(
    boxGroup,
    [0.045, wallHeight * 0.82, trayDepth - 0.14],
    linerMaterial,
    [trayWidth / 2 - 0.035, trayFloorHeight + wallHeight / 2, 0],
    [0, 0, 0],
    0.035,
    0.006,
  );

  const frontPivot = new THREE.Group();
  frontPivot.position.set(0, trayFloorHeight, trayDepth / 2 + wallThickness / 2);
  boxGroup.add(frontPivot);
  addRoundedPart(
    frontPivot,
    [outerWidth, wallHeight, wallThickness],
    sideMaterial,
    [0, wallHeight / 2, 0],
    [0, 0, 0],
    0.08,
    0.018,
  );
  addRoundedPart(
    frontPivot,
    [trayWidth - 0.1, wallHeight * 0.76, 0.045],
    linerMaterial,
    [0, wallHeight / 2, -wallThickness / 2 + 0.038],
    [0, 0, 0],
    0.035,
    0.006,
  );

  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, trayFloorHeight + wallHeight + 0.05, -lidDepth / 2);
  boxGroup.add(lidPivot);
  addRoundedPart(
    lidPivot,
    [lidWidth, lidThickness, lidDepth],
    outerMaterial,
    [0, lidThickness / 2, lidDepth / 2],
    [0, 0, 0],
    0.2,
    0.024,
  );
  addRoundedPart(
    lidPivot,
    [lidWidth, lidSkirtHeight, wallThickness],
    sideMaterial,
    [0, -lidSkirtHeight / 2 + 0.02, lidDepth - wallThickness / 2],
    [0, 0, 0],
    0.08,
    0.014,
  );
  addRoundedPart(
    lidPivot,
    [wallThickness, lidSkirtHeight, lidDepth],
    sideMaterial,
    [-lidWidth / 2 + wallThickness / 2, -lidSkirtHeight / 2 + 0.02, lidDepth / 2],
    [0, 0, 0],
    0.08,
    0.014,
  );
  addRoundedPart(
    lidPivot,
    [wallThickness, lidSkirtHeight, lidDepth],
    sideMaterial,
    [lidWidth / 2 - wallThickness / 2, -lidSkirtHeight / 2 + 0.02, lidDepth / 2],
    [0, 0, 0],
    0.08,
    0.014,
  );
  addRoundedPart(
    lidPivot,
    [lidWidth - 0.42, 0.045, lidDepth - 0.42],
    linerMaterial,
    [0, -lidSkirtHeight + 0.015, lidDepth / 2],
    [0, 0, 0],
    0.14,
    0.008,
  );

  const lidPhotoMaterial = createMaterial(THREE.MeshBasicMaterial, {
    map: createLidTitleTexture(),
    transparent: true,
    opacity: 0.96,
    side: THREE.DoubleSide,
    toneMapped: false,
    alphaTest: 0.02,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  });
  const lidPhoto = track(new THREE.Mesh(
    new THREE.PlaneGeometry(lidWidth * 0.76, lidDepth * 0.42),
    lidPhotoMaterial,
  ), { receiveShadow: false });
  lidPhoto.position.set(0, lidThickness + 0.024, lidDepth * 0.58);
  lidPhoto.rotation.x = -Math.PI / 2;
  lidPivot.add(lidPhoto);

  const logoMaterial = createMaterial(THREE.MeshBasicMaterial, {
    map: loadSceneTexture(assetPath("/judhoor-logo.png")),
    transparent: true,
    opacity: 0.86,
    side: THREE.DoubleSide,
    toneMapped: false,
    alphaTest: 0.03,
  });
  const lidLogo = track(new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), logoMaterial), {
    receiveShadow: false,
  });
  lidLogo.position.set(0, lidThickness + 0.03, lidDepth * 0.29);
  lidLogo.rotation.x = -Math.PI / 2;
  lidPivot.add(lidLogo);

  [
    [lidWidth * 0.74, 0.018, 0.045, 0, lidThickness + 0.018, lidDepth * 0.36],
    [lidWidth * 0.74, 0.018, 0.045, 0, lidThickness + 0.018, lidDepth * 0.79],
    [0.045, 0.018, lidDepth * 0.42, -lidWidth * 0.38, lidThickness + 0.018, lidDepth * 0.58],
    [0.045, 0.018, lidDepth * 0.42, lidWidth * 0.38, lidThickness + 0.018, lidDepth * 0.58],
  ].forEach(([width, height, depth, x, y, z]) => {
    addRoundedPart(lidPivot, [width, height, depth], trimMaterial, [x, y, z], [0, 0, 0], 0.02, 0.005);
  });

  const trimHeight = 0.07;
  [-0.96, 0.96].forEach((x) => {
    addRoundedPart(
      boxGroup,
      [0.07, wallHeight * 0.58, trayDepth - 0.46],
      trimMaterial,
      [x, trayFloorHeight + wallHeight * 0.38, 0],
      [0, 0, 0],
      0.025,
      0.006,
    );
  });
  [-0.58, 0.58].forEach((z) => {
    addRoundedPart(
      boxGroup,
      [trayWidth - 0.52, wallHeight * 0.54, 0.07],
      trimMaterial,
      [0, trayFloorHeight + wallHeight * 0.36, z],
      [0, 0, 0],
      0.025,
      0.006,
    );
  });
  addRoundedPart(
    boxGroup,
    [outerWidth - 0.16, trimHeight, 0.1],
    trimMaterial,
    [0, trayFloorHeight + wallHeight + trimHeight / 2, trayDepth / 2 + 0.02],
    [0, 0, 0],
    0.035,
    0.006,
  );
  addRoundedPart(
    boxGroup,
    [outerWidth - 0.16, trimHeight, 0.1],
    trimMaterial,
    [0, trayFloorHeight + wallHeight + trimHeight / 2, -trayDepth / 2 - 0.02],
    [0, 0, 0],
    0.035,
    0.006,
  );

  const productGroup = new THREE.Group();
  productGroup.position.set(0, 1.28, -0.88);
  productGroup.scale.setScalar(0.8);
  productGroup.visible = false;
  group.add(productGroup);

  const frameMaterial = createMaterial(THREE.MeshStandardMaterial, {
    color: palette.glow,
    roughness: 0.92,
    metalness: 0.02,
    transparent: true,
    opacity: 0.04,
  });
  const imageDepth = track(new THREE.Mesh(
    createRoundedBoxGeometry(5.2, 3.8, 0.18, 0.16, 0.012),
    frameMaterial,
  ));
  imageDepth.position.set(0, 0, -0.12);
  productGroup.add(imageDepth);

  const primaryMaterial = createMaterial(THREE.MeshBasicMaterial, {
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
    toneMapped: false,
  });
  const primaryImage = track(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), primaryMaterial));
  primaryImage.position.set(0, 0.02, 0.03);
  productGroup.add(primaryImage);

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

  const itemGroup = new THREE.Group();
  itemGroup.position.set(0, 0.02, 0.08);
  boxGroup.add(itemGroup);
  const itemMeshes = box.items.slice(0, 7).map((item, index) => {
    const layout = itemLayouts[index] ?? itemLayouts[itemLayouts.length - 1];
    const texture = loadSceneTexture(item.sprite);
    const backingMaterial = createMaterial(THREE.MeshStandardMaterial, {
      color: palette.inside,
      map: linerPaper,
      bumpMap: linerBump,
      bumpScale: 0.008,
      roughness: 0.96,
      metalness: 0.01,
      transparent: true,
      opacity: 0,
    });
    const backing = addRoundedPart(
      itemGroup,
      [layout.size * 1.08, 0.055, layout.size * 0.86],
      backingMaterial,
      [layout.x, trayFloorHeight + 0.092, layout.z],
      [0, layout.rotation, 0],
      0.08,
      0.006,
    );
    backing.userData = {
      baseY: trayFloorHeight + 0.092,
      targetY: trayFloorHeight + 0.104 + index * 0.01,
    };
    backing.visible = false;

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(layout.size * 0.94, layout.size * 0.94),
      createMaterial(THREE.MeshBasicMaterial, {
        map: texture,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
        toneMapped: false,
        alphaTest: 0.035,
      }),
    );
    mesh.position.set(layout.x, trayFloorHeight + 0.136, layout.z);
    mesh.rotation.set(-Math.PI / 2, 0, layout.rotation);
    mesh.userData = {
      targetY: trayFloorHeight + 0.148 + index * 0.012,
      baseX: layout.x,
      baseZ: layout.z,
      backing,
      delay: index * 0.12,
    };
    mesh.visible = false;
    itemGroup.add(mesh);
    return mesh;
  });

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
        opacity: 0.2,
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

  const stageFloor = track(new THREE.Mesh(new THREE.PlaneGeometry(12, 9), softShadowMaterial), {
    castShadow: false,
    receiveShadow: true,
  });
  stageFloor.rotation.x = -Math.PI / 2;
  stageFloor.position.y = -0.012;
  group.add(stageFloor);

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
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    camera.position.set(4.4, 3.35, 8.4);
    camera.lookAt(0, 0.95, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.98;
    renderer.domElement.className = "jd-three-canvas";
    host.appendChild(renderer.domElement);

    const ambientLight = new THREE.HemisphereLight("#fff6df", "#4a3627", 1.25);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight("#fff2cf", 4.6);
    keyLight.position.set(-5.4, 7.6, 5.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -8;
    keyLight.shadow.camera.right = 8;
    keyLight.shadow.camera.top = 8;
    keyLight.shadow.camera.bottom = -8;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 20;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight("#d5a866", 1.6, 18);
    fillLight.position.set(4.8, 3.4, 2.8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight("#fff8e9", 1.8);
    rimLight.position.set(3.8, 4.2, -4.8);
    scene.add(rimLight);

    const textureLoader = new THREE.TextureLoader();
    let model = createSceneModel(box, textureLoader);
    scene.add(model.group);

    function resize() {
      const bounds = host.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.x = width < 700 ? 3.2 : 4.4;
      camera.position.z = width < 700 ? 10.8 : 8.4;
      camera.position.y = width < 700 ? 3.75 : 3.35;
      camera.lookAt(0, 0.95, 0);
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
        const backing = mesh.userData.backing;
        if (state.isOpen) {
          mesh.visible = true;
          if (backing) {
            backing.visible = true;
          }
        }
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

        if (backing) {
          const backingTargetY = state.isOpen ? backing.userData.targetY : backing.userData.baseY - 0.06;
          backing.position.y += (backingTargetY - backing.position.y) * 0.08;
          backing.material.opacity += ((state.isOpen ? 0.88 : 0) - backing.material.opacity) * 0.08;
          backing.scale.x += (targetScale - backing.scale.x) * 0.07;
          backing.scale.z += (targetScale - backing.scale.z) * 0.07;

          if (!state.isOpen && backing.material.opacity < 0.02) {
            backing.visible = false;
          }
        }

        if (!state.isOpen && mesh.material.opacity < 0.02) {
          mesh.visible = false;
        }
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
