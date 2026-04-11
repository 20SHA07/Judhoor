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
      {
        name: "Family story prompt cards",
        note: "Conversation prompts that help grandchildren and caregivers invite deeper family storytelling with ease.",
        sprite: assetPath("/mockups/past-box-items.png"),
        position: "right center",
      },
      {
        name: "Memory keepsake envelope",
        note: "A special place for storing small notes, photographs, or written reflections gathered over time.",
        sprite: assetPath("/mockups/past-box-items.png"),
        position: "left bottom",
      },
      {
        name: "Family guide card",
        note: "A gentle guide that helps relatives use the box in a respectful, dementia-friendly, and meaningful way.",
        sprite: assetPath("/mockups/past-box-items.png"),
        position: "right bottom",
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
      {
        name: "Aromatherapy sachet",
        note: "A calming scent object chosen to soften the atmosphere and support restful moments.",
        sprite: assetPath("/mockups/balance-box-items.png"),
        position: "right center",
      },
      {
        name: "Comfort tea sachets",
        note: "A soothing tea pairing that supports a slower daily rhythm and a more grounded routine.",
        sprite: assetPath("/mockups/balance-box-items.png"),
        position: "left bottom",
      },
      {
        name: "Family guide card",
        note: "A supportive guide with simple suggestions for helping elders engage in calm daily wellbeing rituals.",
        sprite: assetPath("/mockups/balance-box-items.png"),
        position: "right bottom",
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
      {
        name: "Printed family photographs",
        note: "A small curated set of family photos that make the box feel immediately personal and lived-in.",
        sprite: assetPath("/mockups/important-box-items.png"),
        position: "right top",
      },
      {
        name: "Scented comfort candle",
        note: "A warm decorative candle that adds softness, atmosphere, and emotional calm to the experience.",
        sprite: assetPath("/mockups/important-box-items.png"),
        position: "center bottom",
      },
      {
        name: "Keepsake note cards",
        note: "Blank premium cards for adding more messages of love over time instead of treating the box as one-time use.",
        sprite: assetPath("/mockups/important-box-items.png"),
        position: "center center",
      },
      {
        name: "Memory envelope set",
        note: "A set of decorative envelopes for storing photographs, letters, or small sentimental notes.",
        sprite: assetPath("/mockups/important-box-items.png"),
        position: "left center",
      },
      {
        name: "Family guide card",
        note: "A guide for helping family members turn the box into a repeatable ritual of affection and reassurance.",
        sprite: assetPath("/mockups/important-box-items.png"),
        position: "center top",
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
    name: "Travel Box",
    tagline: "Travel & Discovery",
    theme: "midnight",
    price: 280,
    itemCount: 5,
    summary:
      "A discovery-led box inspired by travel, culture, and heritage, designed to bring curiosity and shared conversation into the home.",
    items: [
      {
        name: "Illustrated destination postcard set",
        note: "A curated set of destination cards that introduces landmarks, colors, and cultural scenes in a way that feels inviting rather than overwhelming.",
        sprite: assetPath("/mockups/travel-box-hero-new.png"),
        position: "left top",
      },
      {
        name: "Cultural map sheet",
        note: "A beautifully printed map that gives the box a sense of place and helps families talk through routes, cities, and stories together.",
        sprite: assetPath("/mockups/travel-box-hero-new.png"),
        position: "left center",
      },
      {
        name: "Music and story guide card",
        note: "A Judhoor guide card that links the destination to songs, stories, or spoken prompts for a more immersive cultural moment.",
        sprite: assetPath("/mockups/travel-box-hero-new.png"),
        position: "right center",
      },
      {
        name: "Destination tea and snack pairing",
        note: "A sensory pairing chosen to reflect the featured destination and add taste and aroma to the experience.",
        sprite: assetPath("/mockups/travel-box-hero-new.png"),
        position: "right top",
      },
      {
        name: "Story scroll and family guide",
        note: "A decorative story scroll with a gentle family guide so the box becomes a shared ritual of discovery rather than just a display piece.",
        sprite: assetPath("/mockups/travel-box-hero-new.png"),
        position: "center bottom",
      },
    ],
    images: [
      assetPath("/mockups/travel-box-hero-new.png"),
      assetPath("/mockups/travel-box-hero-new.png"),
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
    image: assetPath("/mockups/travel-box-hero-new.png"),
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
