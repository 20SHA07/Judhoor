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
  { value: "39", label: "carefully chosen items" },
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
      "Supports memory recall, nostalgia, personal storytelling, and meaningful family conversation.",
    summary:
      "A nostalgic box built around scent, sound, handwriting, and storytelling so elders can revisit meaningful parts of their lives with the people they love.",
    sampleItems: [
      "Customized photo album",
      "\"My Story\" notebook",
      "Memory question cards",
      "Vintage-style mini radio",
      "USB with curated 70s Arabic songs",
      "Bakhoor memory scent sample",
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
      "Encourages healthy routines, gentle movement, calm, and emotional comfort.",
    summary:
      "A soothing box that supports daily habits and physical ease through objects that feel familiar, safe, and quietly motivating.",
    sampleItems: [
      "Stress ball",
      "Stretching bands",
      "Customized water bottle",
      "Daily wellbeing cards",
      "Prayer beads",
      "Linen sleep mask",
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
    itemCount: 10,
    purpose:
      "Keeps minds active and hands engaged through accessible creative work and gentle cognitive exercises.",
    summary:
      "A creative toolkit for painting, puzzles, coloring, tea moments, and tactile making, all designed with comfort and accessibility in mind.",
    sampleItems: [
      "Painting kit",
      "Mini canvas",
      "Large-print Sudoku book",
      "Adult coloring book",
      "Customized puzzle",
      "Knitting starter kit",
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
    itemCount: 11,
    purpose:
      "Reduces loneliness and deepens intergenerational connection through emotionally powerful keepsakes.",
    summary:
      "The most intimate box in the range, built around voice, letters, touch, photographs, and family rituals that make an elder feel deeply seen.",
    sampleItems: [
      "Letters from grandchildren",
      "Family photo frame",
      "\"Reasons We Love You\" jar",
      "\"Open When\" letter bundle",
      "QR voice message card",
      "Shared writing journal",
    ],
    images: [
      assetPath("/mockups/important-box-hero-new.png"),
      assetPath("/mockups/important-box-items.png"),
    ],
  },
];

export const experienceSteps = [
  {
    title: "Choose the emotional need",
    description:
      "Start with reflection, wellbeing, creativity, or connection depending on what the elder needs most right now.",
  },
  {
    title: "Unbox with dignity",
    description:
      "The materials, typography, and monochromatic palettes are designed to feel premium and calming from the first moment.",
  },
  {
    title: "Use the guide gently",
    description:
      "Families and caregivers receive respectful prompts on how to encourage engagement without pressure.",
  },
  {
    title: "Create repeatable rituals",
    description:
      "The objects are meant to be revisited, turning one beautiful box into many meaningful interactions.",
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
      "The main Judhoor system built around memory, health, creativity, and connection.",
    image: assetPath("/mockups/past-box-hero-new.png"),
  },
  {
    title: "Crafted item ecosystems",
    description:
      "Every box contains premium tactile objects designed to be used, revisited, and cherished.",
    image: assetPath("/mockups/creative-box-items.png"),
  },
  {
    title: "Additional concept experience",
    description:
      "A travel-themed Judhoor box concept shown as part of the wider visual brand world.",
    image: assetPath("/mockups/travel-box-hero-new.png"),
  },
];
