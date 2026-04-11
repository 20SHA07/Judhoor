const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const boxCatalog = [
  {
    slug: "past-box",
    arabicName: "صندوق الماضي",
    name: "The Past Box",
    tagline: "Memory & Reflection",
    theme: "sand",
    price: 280,
    itemCount: 9,
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
      assetPath("/mockups/past-box-hero-new.png"),
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
    price: 280,
    itemCount: 9,
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
    slug: "important-box",
    arabicName: "صندوق أنت مهمة",
    name: "You Are Important Box",
    tagline: "Connection & Love",
    theme: "rose",
    price: 280,
    itemCount: 11,
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
      assetPath("/mockups/important-box-hero-new.png"),
      assetPath("/mockups/important-box-items.png"),
    ],
  },
  {
    slug: "travel-box",
    arabicName: "صندوق المغامرة",
    name: "Adventure Box",
    tagline: "Travel & Discovery",
    theme: "midnight",
    price: 280,
    itemCount: 5,
    summary:
      "A travel-inspired concept box that brings exploration, heritage, stories, and sensory discovery into a premium Judhoor experience.",
    items: [
      {
        name: "Personalized boarding pass",
        note: "A premium keepsake boarding pass with the elder's name and chosen destination to make the experience feel personal from the first moment.",
        sprite: assetPath("/mockups/travel-box-items.png"),
        position: "left top",
      },
      {
        name: "Destination postcard set",
        note: "A set of themed postcards featuring landmarks and cultural scenes designed to encourage conversation and visual discovery.",
        sprite: assetPath("/mockups/travel-box-items.png"),
        position: "left center",
      },
      {
        name: "Music QR code",
        note: "An elegant QR card linking to a curated playlist inspired by the selected country or city.",
        sprite: assetPath("/mockups/travel-box-items.png"),
        position: "right center",
      },
      {
        name: "Destination-inspired snacks",
        note: "A small selection of snacks chosen to reflect the local culture and create a more immersive experience.",
        sprite: assetPath("/mockups/travel-box-items.png"),
        position: "right top",
      },
      {
        name: "Simple recipe card",
        note: "An easy family activity card for one local drink or dish that extends the destination experience beyond the box.",
        sprite: assetPath("/mockups/travel-box-items.png"),
        position: "center bottom",
      },
    ],
    images: [
      assetPath("/mockups/travel-box-items.png"),
      assetPath("/mockups/travel-box-items.png"),
    ],
  },
];

export const conceptMoments = [
  {
    title: "Packaging that feels ceremonial",
    description:
      "The drawer-style presentation and foil details make every unboxing feel intentional and honoring.",
    image: assetPath("/mockups/past-box-hero-new.png"),
  },
  {
    title: "Objects that invite interaction",
    description:
      "Every object is tactile, accessible, and selected to create a gentle moment rather than a forced task.",
    image: assetPath("/mockups/important-box-items.png"),
  },
  {
    title: "A wider brand world",
    description:
      "The travel-themed concept set shows how the Judhoor visual identity can extend into future themed experiences.",
    image: assetPath("/mockups/travel-box-items.png"),
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
