const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const heroHighlights = [
  {
    title: "Premium physical boxes",
    description: "Drawer-style presentation with linen textures and gold Arabic details.",
  },
  {
    title: "Adults aged 60+",
    description: "Designed specifically for elders with dignity, accessibility, and warmth.",
  },
  {
    title: "Family-centered interaction",
    description: "Every box encourages shared moments, not isolated activities.",
  },
];

export const featuredMetrics = [
  { value: "4", label: "signature boxes" },
  { value: "34", label: "carefully chosen items" },
  { value: "60+", label: "intended age group" },
  { value: "1", label: "cohesive respectful brand world" },
];

export const productBoxes = [
  {
    slug: "past-box",
    arabicName: "صندوق الماضي",
    name: "The Past Box",
    tagline: "Memory & Reflection",
    itemCount: 9,
    purpose:
      "Helps elders reflect on their life, spark meaningful family conversations, and support memory recall through nostalgia and personal storytelling.",
    summary:
      "A nostalgic box built around scent, sound, handwriting, and personal storytelling so elders can revisit meaningful parts of their lives with family.",
    sampleItems: [
      "Customized photo album",
      "\"My Story\" notebook",
      "Memory question cards",
      "Vintage-style mini radio",
      "Curated Arabic songs",
      "Bakhoor scent trigger",
      "Family story prompt cards",
      "Memory keepsake envelope",
      "Family guide card",
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
    itemCount: 9,
    purpose:
      "Supports physical and emotional wellbeing, gentle daily habits, and greater comfort in the body and emotions.",
    summary:
      "A soothing box that encourages healthy daily habits, gentle movement, hydration, comfort, and emotional calm through familiar premium objects.",
    sampleItems: [
      "Stress ball",
      "Stretching band",
      "Customized water bottle",
      "Wellbeing reminder cards",
      "Prayer beads",
      "Linen sleep mask",
      "Aromatherapy sachet",
      "Comfort tea sachets",
      "Family guide card",
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
    itemCount: 11,
    purpose:
      "Reduces loneliness, strengthens family bonds, and helps elders feel seen, celebrated, and deeply loved.",
    summary:
      "An emotionally rich box built around letters, photographs, voice messages, keepsakes, and shared writing to deepen intergenerational love.",
    sampleItems: [
      "Letters from grandchildren",
      "Family photo frame",
      "Printed family photographs",
      "Scented comfort candle",
      "\"Reasons We Love You\" jar",
      "QR voice message card",
      "\"Open When\" letter bundle",
      "Shared journal",
      "Keepsake note cards",
      "Memory envelope set",
      "Family guide card",
    ],
    images: [
      assetPath("/mockups/important-box-hero-new.png"),
      assetPath("/mockups/important-box-items.png"),
    ],
  },
  {
    slug: "travel-box",
    arabicName: "صندوق السفر",
    name: "Travel Box",
    tagline: "Travel & Discovery",
    itemCount: 11,
    purpose:
      "Helps elders experience the feeling of travel from home, spark curiosity, and encourage cultural discovery through tactile Egyptian-inspired items.",
    summary:
      "An Egypt-inspired discovery box built around heritage, ancient games, scent, story cards, and keepsake objects that bring travel into the home.",
    sampleItems: [
      "Nile flooding story cards",
      "Mini felucca boat",
      "Sphinx heritage figurine",
      "Ancient stone tablet",
      "Canopic jar miniature set",
      "Engraved Egyptian pen",
      "Hieroglyphic leather journal",
      "Ancient board game",
      "Egyptian musk bottle",
      "Nile water keepsake jar",
      "Frankincense and myrrh pouch",
    ],
    images: [
      assetPath("/mockups/travel-box-hero-transparent.png"),
      assetPath("/mockups/travel-box-items.png"),
    ],
  },
];

export const experienceSteps = [
  {
    title: "Choose the emotional need",
    description:
      "Start with memory, wellbeing, connection, or discovery depending on what the elder needs most right now.",
  },
  {
    title: "Unbox with dignity",
    description:
      "Drawer-style presentation, gold Arabic details, and warm monochromatic palettes make the experience feel honoring from the first moment.",
  },
  {
    title: "Use the guide gently",
    description:
      "Every box includes a family guide card with respectful prompts, safe use notes, and dementia-friendly encouragement.",
  },
  {
    title: "Create repeatable rituals",
    description:
      "The objects are meant to be revisited, turning one beautifully designed box into many meaningful interactions.",
  },
];

export const companyValues = [
  {
    title: "Respectful",
    description:
      "Every object is designed to honor the elder rather than infantilize them.",
  },
  {
    title: "Nostalgic",
    description:
      "Judhoor uses memory triggers like scent, handwriting, music, and keepsakes to open conversation naturally.",
  },
  {
    title: "Warm",
    description:
      "Soft tones, tactile materials, and intimate details create a sense of emotional ease.",
  },
  {
    title: "Culturally Meaningful",
    description:
      "Arabic language, Gulf references, and familiar rituals keep the experience rooted rather than generic.",
  },
];

export const contactDetails = {
  email: "hello@judhoor.com",
  phone: "+971 50 000 0000",
  location: "UAE / GCC",
  description:
    "Use this page as the launch point for retail inquiries, strategic partnerships, elder care collaborations, or family-focused custom orders.",
};

export const conceptGallery = [
  {
    title: "Four-box elderly wellbeing line",
    description:
      "The current Judhoor line is built around memory, health, connection, and travel discovery.",
    image: assetPath("/mockups/past-box-hero-new.png"),
  },
  {
    title: "Emotionally rich item ecosystems",
    description:
      "Every box contains premium tactile objects designed to be used, revisited, and cherished.",
    image: assetPath("/mockups/important-box-items.png"),
  },
  {
    title: "Travel-led expansion",
    description:
      "The Travel Box extends the brand into heritage-led discovery, sensory prompts, and joyful family interaction.",
    image: assetPath("/mockups/travel-box-items.png"),
  },
];
