const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const boxCatalog = [
  {
    slug: "past-box",
    arabicName: "صندوق الماضي",
    name: "The Past Box",
    tagline: "Memory & Reflection",
    theme: "sand",
    price: 280,
    itemCount: 7,
    summary:
      "A nostalgic wooden box built around scent, sound, coffee rituals, handwriting, and personal storytelling so elders can revisit meaningful parts of their lives with family.",
    items: [
      {
        name: "Vintage-style mini radio",
        note: "A tactile nostalgic object that brings familiar sound and comfort into the experience.",
        sprite: assetPath("/mockups/past-items/vintage-mini-radio.png"),
        position: "center",
        previewSize: "contain",
      },
      {
        name: "\"My Story\" notebook",
        note: "A premium notebook for life stories, reflections, and handwritten memories.",
        sprite: assetPath("/mockups/past-items/my-story-notebook.png"),
        position: "center",
        previewSize: "contain",
      },
      {
        name: "Memory question cards",
        note: "Open-ended conversation prompts designed to bring stories forward naturally.",
        sprite: assetPath("/mockups/past-items/memory-question-cards.png"),
        position: "center",
        previewSize: "contain",
      },
      {
        name: "Perfume memory bottle",
        note: "A scent-based memory prompt that taps into familiarity, atmosphere, and personal ritual.",
        sprite: assetPath("/mockups/past-items/perfume-memory-bottle.png"),
        position: "center",
        previewSize: "contain",
      },
      {
        name: "Arabic coffee cup",
        note: "A familiar coffee ritual object that makes the experience feel warm, social, and culturally grounded.",
        sprite: assetPath("/mockups/past-items/arabic-coffee-cup.png"),
        position: "center",
        previewSize: "contain",
      },
      {
        name: "QR audio story card",
        note: "A printed audio card that connects the box to songs, spoken memories, or family-recorded stories.",
        sprite: assetPath("/mockups/past-items/qr-audio-story-card.png"),
        position: "center",
        previewSize: "contain",
      },
      {
        name: "Family portrait frame",
        note: "A keepsake frame that anchors the ritual around familiar faces and family presence.",
        sprite: assetPath("/mockups/past-items/family-portrait-frame.png"),
        position: "center",
        previewSize: "contain",
      },
    ],
    images: [
      assetPath("/mockups/past-box-hero-new.png"),
      assetPath("/mockups/past-box-items-luxury.png"),
      assetPath("/mockups/past-box-detail-luxury.png"),
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
        sprite: assetPath("/mockups/important-items/letters-from-grandchildren.png"),
        position: "left top",
        previewSize: "contain",
      },
      {
        name: "Family photo frame",
        note: "A bedside keepsake designed to hold a loved family portrait at the center of the room.",
        sprite: assetPath("/mockups/important-items/family-photo-frame.png"),
        position: "center top",
        previewSize: "contain",
      },
      {
        name: "Reasons We Love You jar",
        note: "Rolled notes of affection that can be opened one by one across many days.",
        sprite: assetPath("/mockups/important-items/reasons-love-jar.png"),
        position: "center center",
        previewSize: "contain",
      },
      {
        name: "\"Open When\" letter bundle",
        note: "A set of lovingly timed letters for loneliness, missing family, or wanting comfort.",
        sprite: assetPath("/mockups/important-items/open-when-letter-bundle.png"),
        position: "right center",
        previewSize: "contain",
      },
      {
        name: "QR voice message card",
        note: "A premium printed card that links directly to a recorded family message.",
        sprite: assetPath("/mockups/important-items/qr-voice-message-card.png"),
        position: "left bottom",
        previewSize: "contain",
      },
      {
        name: "Shared journal",
        note: "A collaborative writing object that lets generations answer one another over time.",
        sprite: assetPath("/mockups/important-items/shared-journal.png"),
        position: "right bottom",
        previewSize: "contain",
      },
      {
        name: "Family calendar",
        note: "A family-themed desk calendar that keeps familiar faces and shared dates visible every day.",
        sprite: assetPath("/mockups/important-items/family-calendar.png"),
        position: "right top",
        previewSize: "contain",
      },
      {
        name: "Scented comfort candle",
        note: "A warm decorative candle that adds softness, atmosphere, and emotional calm to the experience.",
        sprite: assetPath("/mockups/important-items/scented-comfort-candle.png"),
        position: "center bottom",
        previewSize: "contain",
      },
      {
        name: "Keepsake handprint card",
        note: "A handprint keepsake card that turns family presence into a tangible memory.",
        sprite: assetPath("/mockups/important-items/keepsake-note-cards.png"),
        position: "center center",
        previewSize: "contain",
      },
      {
        name: "Memory envelope set",
        note: "A set of decorative envelopes for storing photographs, letters, or small sentimental notes.",
        sprite: assetPath("/mockups/important-items/memory-envelope-set.png"),
        position: "left center",
        previewSize: "contain",
      },
      {
        name: "Comfort prayer beads",
        note: "A familiar tactile keepsake that adds calm, rhythm, and emotional grounding to the box.",
        sprite: assetPath("/mockups/important-items/comfort-prayer-beads.png"),
        position: "center top",
        previewSize: "contain",
      },
    ],
    images: [
      assetPath("/mockups/important-box-hero-new.png"),
      assetPath("/mockups/important-box-items.png"),
      assetPath("/mockups/important-box-detail.png"),
    ],
  },
  {
    slug: "travel-box",
    arabicName: "صندوق السفر",
    name: "Travel Box",
    tagline: "Travel & Discovery",
    theme: "midnight",
    price: 280,
    itemCount: 11,
    summary:
      "An Egypt-inspired discovery box built around heritage, ancient games, scent, story cards, and keepsake objects that bring travel into the home.",
    items: [
      {
        name: "Nile flooding story cards",
        note: "A tied deck of cultural cards introducing Nile flooding, agriculture, and heritage prompts for family conversation.",
        sprite: assetPath("/mockups/travel-items/nile-story-cards.png"),
        position: "center",
        previewSize: "contain",
      },
      {
        name: "Mini felucca boat",
        note: "A small Nile sailboat model that gives the box a tactile travel object and a clear visual sense of place.",
        sprite: assetPath("/mockups/travel-items/mini-felucca-boat.png"),
        position: "center",
        previewSize: "contain",
      },
      {
        name: "Sphinx heritage figurine",
        note: "A sculptural keepsake inspired by ancient Egyptian heritage, chosen as a strong memory and storytelling anchor.",
        sprite: assetPath("/mockups/travel-items/sphinx-figurine.png"),
        position: "center",
        previewSize: "contain",
      },
      {
        name: "Ancient stone tablet",
        note: "A textured tablet-style object that adds a tactile archaeological feeling to the travel ritual.",
        sprite: assetPath("/mockups/travel-items/ancient-stone-tablet.png"),
        position: "center",
        previewSize: "contain",
      },
      {
        name: "Canopic jar miniature set",
        note: "A set of small Egyptian-inspired jars that encourage curiosity, naming, sorting, and shared cultural discussion.",
        sprite: assetPath("/mockups/travel-items/canopic-jar-set.png"),
        position: "center",
        previewSize: "contain",
      },
      {
        name: "Engraved Egyptian pen",
        note: "A premium writing object for notes, reflections, or answering the included story prompts.",
        sprite: assetPath("/mockups/travel-items/engraved-egyptian-pen.png"),
        position: "center",
        previewSize: "contain",
      },
      {
        name: "Hieroglyphic leather journal",
        note: "A leather-style travel journal for writing memories, imagined journeys, and family reflections.",
        sprite: assetPath("/mockups/travel-items/hieroglyphic-leather-journal.png"),
        position: "center",
        previewSize: "contain",
      },
      {
        name: "Ancient board game",
        note: "A heritage-inspired game board with pieces, designed to invite gentle play and interaction.",
        sprite: assetPath("/mockups/travel-items/ancient-board-game.png"),
        position: "center",
        previewSize: "contain",
      },
      {
        name: "Egyptian musk bottle",
        note: "A small scent bottle that brings aroma into the travel experience and creates a sensory memory cue.",
        sprite: assetPath("/mockups/travel-items/egyptian-musk-bottle.png"),
        position: "center",
        previewSize: "contain",
      },
      {
        name: "Nile water keepsake jar",
        note: "A labeled keepsake jar that adds a playful, museum-like discovery moment to the package.",
        sprite: assetPath("/mockups/travel-items/nile-water-jar.png"),
        position: "center",
        previewSize: "contain",
      },
      {
        name: "Frankincense and myrrh pouch",
        note: "A scented pouch that adds warmth, texture, and a heritage-inspired fragrance ritual.",
        sprite: assetPath("/mockups/travel-items/frankincense-myrrh-pouch.png"),
        position: "center",
        previewSize: "contain",
      },
    ],
    images: [
      assetPath("/mockups/travel-box-hero-transparent.png"),
      assetPath("/mockups/travel-box-items.png"),
      assetPath("/mockups/travel-box-detail.png"),
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
      "The Travel Box extends Judhoor into heritage-led discovery through tactile Egyptian-inspired objects.",
    image: assetPath("/mockups/travel-box-items.png"),
  },
];

export const journeySteps = [
  {
    kicker: "01",
    title: "Choose the emotional need",
    description:
      "Start with reflection, wellbeing, discovery, or connection depending on what the elder needs most.",
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
