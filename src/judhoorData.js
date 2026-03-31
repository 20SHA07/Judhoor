const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const boxCatalog = [
  {
    slug: "past-box",
    arabicName: "صندوق الماضي",
    name: "The Past Box",
    tagline: "Memory & Reflection",
    theme: "sand",
    price: 420,
    summary:
      "A nostalgic box built around scent, sound, handwriting, and personal storytelling so elders can revisit meaningful parts of their lives with family.",
    items: [
      {
        name: "Customized photo album",
        note: "A keepsake album personalized for the elder, designed to spark memory recall through familiar faces and moments.",
        sprite: assetPath("/mockups/past-box-items.png"),
        position: "left top",
      },
      {
        name: "\"My Story\" notebook",
        note: "A premium notebook for life stories, reflections, and handwritten memories.",
        sprite: assetPath("/mockups/past-box-items.png"),
        position: "center top",
      },
      {
        name: "Memory question cards",
        note: "Open-ended conversation prompts designed to bring stories forward naturally.",
        sprite: assetPath("/mockups/past-box-items.png"),
        position: "right top",
      },
      {
        name: "Vintage-style mini radio",
        note: "A tactile nostalgic object that brings familiar sound and comfort into the experience.",
        sprite: assetPath("/mockups/past-box-items.png"),
        position: "left center",
      },
      {
        name: "Curated Arabic songs",
        note: "A Judhoor-branded music piece that connects memory to emotion and era.",
        sprite: assetPath("/mockups/past-box-items.png"),
        position: "center center",
      },
      {
        name: "Bakhoor scent trigger",
        note: "A scent-based memory prompt that taps into familiarity and atmosphere.",
        sprite: assetPath("/mockups/past-box-items.png"),
        position: "center bottom",
      },
    ],
    images: [
      assetPath("/mockups/past-box-hero.png"),
      assetPath("/mockups/past-box-items.png"),
      assetPath("/mockups/past-box-detail.png"),
    ],
  },
  {
    slug: "balance-box",
    arabicName: "صندوق التوازن",
    name: "Balance Box",
    tagline: "Health & Wellbeing",
    theme: "sage",
    price: 390,
    summary:
      "A soothing box that encourages healthy daily habits, gentle movement, hydration, comfort, and emotional calm through familiar premium objects.",
    items: [
      {
        name: "Stress ball",
        note: "A soft branded stress ball that supports hand mobility and calm tactile release.",
        sprite: assetPath("/mockups/balance-box-items.png"),
        position: "left top",
      },
      {
        name: "Customized water bottle",
        note: "A premium hydration object designed to feel elegant enough to keep nearby every day.",
        sprite: assetPath("/mockups/balance-box-items.png"),
        position: "center top",
      },
      {
        name: "Stretching band",
        note: "A gentle movement tool for seated or standing routines with accessible daily use.",
        sprite: assetPath("/mockups/balance-box-items.png"),
        position: "right top",
      },
      {
        name: "Prayer beads",
        note: "A culturally familiar grounding object that adds comfort, rhythm, and spiritual calm.",
        sprite: assetPath("/mockups/balance-box-items.png"),
        position: "left center",
      },
      {
        name: "Linen sleep mask",
        note: "A soft comfort piece for rest and relaxation in the Judhoor palette.",
        sprite: assetPath("/mockups/balance-box-items.png"),
        position: "center center",
      },
      {
        name: "Wellbeing reminder cards",
        note: "Gentle visual cues for hydration, rest, and simple habits that support daily wellbeing.",
        sprite: assetPath("/mockups/balance-box-items.png"),
        position: "center bottom",
      },
    ],
    images: [
      assetPath("/mockups/balance-box-hero.png"),
      assetPath("/mockups/balance-box-items.png"),
      assetPath("/mockups/balance-box-detail.png"),
    ],
  },
  {
    slug: "my-kit-box",
    arabicName: "صندوق أدواتي",
    name: "My Kit Box",
    tagline: "Creative Activities",
    theme: "terracotta",
    price: 450,
    summary:
      "A creative toolkit for painting, puzzles, coloring, tea moments, and tactile making, all designed for comfortable elderly use.",
    items: [
      {
        name: "Painting kit",
        note: "A calm, elegant watercolor set that invites gentle making and visual expression.",
        sprite: assetPath("/mockups/creative-box-items.png"),
        position: "left top",
      },
      {
        name: "Mini canvas",
        note: "A small ready-to-use canvas for a first creative win without overwhelm.",
        sprite: assetPath("/mockups/creative-box-items.png"),
        position: "center top",
      },
      {
        name: "Calming tea box",
        note: "A tea ritual detail that slows the pace and softens the creative session.",
        sprite: assetPath("/mockups/creative-box-items.png"),
        position: "right top",
      },
      {
        name: "Adult coloring book",
        note: "Decorative pages designed for focus, calm, and light hand movement.",
        sprite: assetPath("/mockups/creative-box-items.png"),
        position: "left center",
      },
      {
        name: "Large-print Sudoku",
        note: "A familiar cognitive activity adapted for clarity and comfortable use.",
        sprite: assetPath("/mockups/creative-box-items.png"),
        position: "center center",
      },
      {
        name: "Knitting starter set",
        note: "A tactile starter activity that keeps the hands engaged with a warm handcrafted feel.",
        sprite: assetPath("/mockups/creative-box-items.png"),
        position: "left bottom",
      },
      {
        name: "Customized puzzle",
        note: "A slow shared activity built around nostalgic imagery and comfortable piece count.",
        sprite: assetPath("/mockups/creative-box-items.png"),
        position: "center bottom",
      },
    ],
    images: [
      assetPath("/mockups/creative-box-hero.png"),
      assetPath("/mockups/creative-box-items.png"),
    ],
  },
  {
    slug: "important-box",
    arabicName: "صندوق أنت مهمة",
    name: "You Are Important Box",
    tagline: "Connection & Love",
    theme: "rose",
    price: 480,
    summary:
      "An emotionally rich box built around letters, photographs, voice messages, keepsakes, and shared writing to deepen intergenerational love.",
    items: [
      {
        name: "Letters from grandchildren",
        note: "Handwritten letters that give the box its most intimate emotional weight.",
        sprite: assetPath("/mockups/important-box-items.png"),
        position: "left top",
      },
      {
        name: "Family photo frame",
        note: "A bedside keepsake designed to hold a loved family portrait at the center of the room.",
        sprite: assetPath("/mockups/important-box-items.png"),
        position: "center top",
      },
      {
        name: "Reasons We Love You jar",
        note: "Rolled notes of affection that can be opened one by one across many days.",
        sprite: assetPath("/mockups/important-box-items.png"),
        position: "center center",
      },
      {
        name: "\"Open When\" letter bundle",
        note: "A set of lovingly timed letters for loneliness, missing family, or wanting comfort.",
        sprite: assetPath("/mockups/important-box-items.png"),
        position: "right center",
      },
      {
        name: "QR voice message card",
        note: "A premium printed card that links directly to a recorded family message.",
        sprite: assetPath("/mockups/important-box-items.png"),
        position: "left bottom",
      },
      {
        name: "Shared journal",
        note: "A collaborative writing object that lets generations answer one another over time.",
        sprite: assetPath("/mockups/important-box-items.png"),
        position: "right bottom",
      },
    ],
    images: [
      assetPath("/mockups/important-box-hero.png"),
      assetPath("/mockups/important-box-items.png"),
    ],
  },
  {
    slug: "travel-box",
    arabicName: "صندوق المغامرة",
    name: "Adventure Box",
    tagline: "Discovery & Culture",
    theme: "midnight",
    price: 520,
    summary:
      "A travel-inspired concept box that brings exploration, heritage, stories, and sensory discovery into a premium Judhoor experience.",
    items: [
      {
        name: "Illustrated destination cards",
        note: "A set of visual story cards that introduce places, architecture, and atmosphere through a collectible format.",
        sprite: assetPath("/mockups/travel-box-items.png"),
        position: "left top",
      },
      {
        name: "Cultural map",
        note: "A printed destination map that turns the experience into something tactile, educational, and visually rich.",
        sprite: assetPath("/mockups/travel-box-items.png"),
        position: "left center",
      },
      {
        name: "Voice guide card",
        note: "A scannable audio companion that adds spoken storytelling to the box experience.",
        sprite: assetPath("/mockups/travel-box-items.png"),
        position: "right center",
      },
      {
        name: "Tea and snack pairing",
        note: "A sensory tasting component that deepens the place-based experience with familiar ritual.",
        sprite: assetPath("/mockups/travel-box-items.png"),
        position: "right top",
      },
      {
        name: "Story scroll",
        note: "A premium scroll element that frames the box as a guided cultural journey rather than a simple kit.",
        sprite: assetPath("/mockups/travel-box-items.png"),
        position: "right top",
      },
      {
        name: "Discovery guide",
        note: "A printed overview that ties the objects together into one coherent themed moment.",
        sprite: assetPath("/mockups/travel-box-items.png"),
        position: "center bottom",
      },
    ],
    images: [
      assetPath("/mockups/travel-box-hero.png"),
      assetPath("/mockups/travel-box-items.png"),
    ],
  },
];

export const conceptMoments = [
  {
    title: "Packaging that feels ceremonial",
    description:
      "The drawer-style presentation and foil details make every unboxing feel intentional and honoring.",
    image: assetPath("/mockups/past-box-hero.png"),
  },
  {
    title: "Objects that invite interaction",
    description:
      "Every object is tactile, accessible, and selected to create a gentle moment rather than a forced task.",
    image: assetPath("/mockups/creative-box-items.png"),
  },
  {
    title: "A wider brand world",
    description:
      "The travel-themed concept set shows how the Judhoor visual identity can extend into future themed experiences.",
    image: assetPath("/mockups/travel-box-hero.png"),
  },
];

export const journeySteps = [
  {
    kicker: "01",
    title: "Choose the emotional need",
    description:
      "Start with reflection, wellbeing, creativity, or connection depending on what the elder needs most.",
  },
  {
    kicker: "02",
    title: "Unbox with dignity",
    description:
      "The visual language is soft, premium, and familiar so the experience feels honoring from the first glance.",
  },
  {
    kicker: "03",
    title: "Use the family guide",
    description:
      "Caregivers and relatives are gently guided toward supportive interaction without pressure or infantilization.",
  },
  {
    kicker: "04",
    title: "Repeat the ritual",
    description:
      "The boxes are designed to be revisited, creating a rhythm of care rather than a one-time activity.",
  },
];
