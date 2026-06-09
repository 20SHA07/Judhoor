import { useEffect, useRef, useState } from "react";
import { NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import BoxModelViewer from "./BoxModelViewer";
import DemoDayPage from "./DemoDayPage";
import { boxCatalog, journeySteps } from "./judhoorData";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const getItemCount = (box) => box.itemCount ?? box.items?.length ?? 0;
const DEFAULT_CURRENCY = "AED";
const currencyOptions = [
  {
    code: "AED",
    label: "AED",
    name: "UAE dirham",
    locale: "en-AE",
    rate: 1,
  },
  {
    code: "USD",
    label: "USD",
    name: "US dollar",
    locale: "en-US",
    rate: 1 / 3.6725,
  },
  {
    code: "SAR",
    label: "SAR",
    name: "Saudi riyal",
    locale: "en-SA",
    rate: 3.75 / 3.6725,
  },
  {
    code: "QAR",
    label: "QAR",
    name: "Qatari riyal",
    locale: "en-QA",
    rate: 3.64 / 3.6725,
  },
];

const redesignVisuals = {
  homeHero:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuChiYH9pyf0OhkR43JYyguO9S2T9JZ1Z-mjVw7IVyyH3YybJa5W4fKG-9dCuX0DDWIslYt72pyiJ64zKAALpXSaGWy2GtaObsyi0Ekp9GVuknR37eHegxETqpJeI3_5eoAZrmGlEQvx7IwiZ-TIoYswuFsA9v1sgubGZ2RLRgxpuM68fqTgD9oxTD58m_hXme0jemOsHuYTOxsYwFV1ejN9tZcwTG-19Wu8uI9E_kiJs37P6o3uYnJ-D9WuHEVD98lXbxQuQoxQtoU",
  homeHeroFallback: assetPath("/mockups/past-box-detail-luxury.png"),
};

function createDeckCards(folder, prefix, count, label) {
  return Array.from({ length: count }, (_, index) => {
    const cardNumber = index + 1;

    return {
      image: assetPath(
        `/decks/${folder}/${prefix}-${String(cardNumber).padStart(2, "0")}.jpg`,
      ),
      alt: `${label} ${cardNumber}`,
      label: `Card ${String(cardNumber).padStart(2, "0")}`,
    };
  });
}

const cardDecks = [
  {
    title: "Wellbeing Card Deck",
    label: "Balance Box Support",
    description:
      "Gentle wellbeing cards for daily comfort rituals, sensory cues, and calm family interaction.",
    orientation: "portrait",
    tags: ["Wellbeing", "Daily ritual", "Caregiver friendly"],
    cards: createDeckCards("wellbeing-cards", "wellbeing-card", 33, "Wellbeing card"),
  },
  {
    title: "Memory Questions Card Deck",
    label: "The Past Box Prompts",
    description:
      "Conversation prompts that help families invite stories, memories, and shared reflection naturally.",
    orientation: "landscape",
    tags: ["Memory prompts", "Family stories", "Reflection"],
    cards: createDeckCards(
      "memory-question-cards",
      "memory-card",
      31,
      "Memory question card",
    ),
  },
];

const importantCustomizationFields = [
  {
    key: "voiceNote",
    id: "importantVoiceNote",
    name: "importantVoiceNote",
    label: "Voice note",
    detail: "A recorded family message for the QR voice card.",
    accept: "audio/*",
    multiple: false,
  },
  {
    key: "letters",
    id: "importantLetters",
    name: "importantLetters",
    label: "Letters",
    detail: "Personal letters for the envelope bundle.",
    accept: ".pdf,.doc,.docx,.txt,image/*",
    multiple: true,
  },
  {
    key: "familyPhotos",
    id: "importantFamilyPhotos",
    name: "importantFamilyPhotos",
    label: "Family photos",
    detail: "Portraits or memory photos for the frame and keepsakes.",
    accept: "image/*",
    multiple: true,
  },
];

const importantRequiredUploadKeys = ["voiceNote", "letters", "familyPhotos"];
const importantRequiredPersonalizationKeys = ["recipientName", "familyName", "boxTitle"];

const importantCustomizationSteps = [
  {
    key: "personalization",
    label: "Personalize",
    detail: "Names, labels, and keepsake copy",
  },
  {
    key: "uploads",
    label: "Upload",
    detail: "Voice note, letters, and family photos",
  },
  {
    key: "preview",
    label: "Preview",
    detail: "Review the box before checkout",
  },
];

const importantPersonalizationDefaults = {
  recipientName: "Noura",
  familyName: "Al Mansoori Family",
  boxTitle: "You Are Important Box",
  photoCaption: "Family portrait",
  candleMessage: "We remember with love",
  jarLabel: "Reasons we love you",
  envelopeLabel: "Letters from home",
  notebookTitle: "Stories we share",
  dedication: "Made with love for the moments that matter.",
};

const importantPersonalizationFields = [
  {
    key: "recipientName",
    name: "importantRecipientName",
    label: "Recipient name",
    detail: "Printed on the front card and keepsake envelope.",
    placeholder: "Noura",
    maxLength: 34,
  },
  {
    key: "familyName",
    name: "importantFamilyName",
    label: "Family name",
    detail: "Used across the photo frame and QR message card.",
    placeholder: "Al Mansoori Family",
    maxLength: 42,
  },
  {
    key: "boxTitle",
    name: "importantBoxTitle",
    label: "Box title",
    detail: "Customize the title printed on the lid preview.",
    placeholder: "You Are Important Box",
    maxLength: 38,
  },
  {
    key: "photoCaption",
    name: "importantPhotoCaption",
    label: "Photo caption",
    detail: "Caption shown below the framed family photo.",
    placeholder: "Family portrait",
    maxLength: 44,
  },
  {
    key: "candleMessage",
    name: "importantCandleMessage",
    label: "Candle message",
    detail: "Short line for the candle label.",
    placeholder: "We remember with love",
    maxLength: 46,
  },
  {
    key: "jarLabel",
    name: "importantJarLabel",
    label: "Memory jar label",
    detail: "Text for the small memory jar.",
    placeholder: "Reasons we love you",
    maxLength: 42,
  },
  {
    key: "envelopeLabel",
    name: "importantEnvelopeLabel",
    label: "Envelope bundle",
    detail: "Text for the letters and notes bundle.",
    placeholder: "Letters from home",
    maxLength: 42,
  },
  {
    key: "notebookTitle",
    name: "importantNotebookTitle",
    label: "Notebook title",
    detail: "Title on the writing booklet.",
    placeholder: "Stories we share",
    maxLength: 42,
  },
  {
    key: "dedication",
    name: "importantDedication",
    label: "Dedication line",
    detail: "A personal line shown in the preview card.",
    placeholder: "Made with love for the moments that matter.",
    maxLength: 120,
    multiline: true,
  },
];

const boxQuizQuestions = [
  {
    id: "careNeed",
    prompt: "What would feel most supportive for your loved one right now?",
    options: [
      {
        id: "memory",
        label: "Remembering stories, places, and family moments",
        scores: { "past-box": 3, "travel-box": 1 },
      },
      {
        id: "wellbeing",
        label: "Calm routines, comfort, and gentle daily wellbeing",
        scores: { "balance-box": 3, "important-box": 1 },
      },
      {
        id: "connection",
        label: "Feeling loved, noticed, and emotionally close to family",
        scores: { "important-box": 3, "past-box": 1 },
      },
      {
        id: "discovery",
        label: "Curiosity, culture, and a sense of travel from home",
        scores: { "travel-box": 3, "past-box": 1 },
      },
    ],
  },
  {
    id: "ritualStyle",
    prompt: "What kind of ritual would they naturally enjoy?",
    options: [
      {
        id: "conversation",
        label: "Slow conversation over familiar objects",
        scores: { "past-box": 3, "important-box": 1 },
      },
      {
        id: "quietCare",
        label: "Quiet self-care with soft, soothing items",
        scores: { "balance-box": 3 },
      },
      {
        id: "lettersPhotos",
        label: "Letters, photos, and messages from family",
        scores: { "important-box": 3 },
      },
      {
        id: "guidedExploration",
        label: "A guided mini-adventure with cultural keepsakes",
        scores: { "travel-box": 3 },
      },
    ],
  },
  {
    id: "sensoryCue",
    prompt: "Which sensory cue would mean the most?",
    options: [
      {
        id: "soundScent",
        label: "Old songs, scent, coffee, and handwriting",
        scores: { "past-box": 3 },
      },
      {
        id: "movementRest",
        label: "Rest, touch, hydration, and gentle movement",
        scores: { "balance-box": 3 },
      },
      {
        id: "voiceAffection",
        label: "A family voice note and personal keepsakes",
        scores: { "important-box": 3 },
      },
      {
        id: "objectsPlaces",
        label: "Objects that bring places and heritage to life",
        scores: { "travel-box": 3 },
      },
    ],
  },
  {
    id: "familyRole",
    prompt: "How involved should the family be?",
    options: [
      {
        id: "storyListening",
        label: "Sitting together and listening to stories",
        scores: { "past-box": 2, "important-box": 1 },
      },
      {
        id: "supportiveCheckins",
        label: "Gentle check-ins around everyday comfort",
        scores: { "balance-box": 3 },
      },
      {
        id: "customMessages",
        label: "Uploading photos, letters, and voice messages",
        scores: { "important-box": 4 },
      },
      {
        id: "sharedLearning",
        label: "Exploring cultural prompts together",
        scores: { "travel-box": 3 },
      },
    ],
  },
];

const boxQuizResultCopy = {
  "past-box":
    "Best for memory, reflection, scent, sound, and family storytelling.",
  "balance-box":
    "Best for calm routines, comfort, wellbeing, and daily grounding.",
  "important-box":
    "Best for deep connection through photos, letters, voice notes, and love.",
  "travel-box":
    "Best for heritage discovery, curiosity, and a travel ritual from home.",
};

function getBoxQuizResult(answers) {
  const scores = Object.fromEntries(boxCatalog.map((box) => [box.slug, 0]));

  boxQuizQuestions.forEach((question) => {
    const option = question.options.find((item) => item.id === answers[question.id]);

    if (!option) {
      return;
    }

    Object.entries(option.scores).forEach(([slug, value]) => {
      scores[slug] = (scores[slug] ?? 0) + value;
    });
  });

  const rankedBoxes = boxCatalog
    .map((box) => ({ box, score: scores[box.slug] ?? 0 }))
    .sort((left, right) => right.score - left.score);

  return rankedBoxes[0]?.box ?? boxCatalog[0];
}

const getCurrency = (currencyCode) =>
  currencyOptions.find((currency) => currency.code === currencyCode) ?? currencyOptions[0];

function formatPrice(amount, currencyCode = DEFAULT_CURRENCY, options = {}) {
  const currency = getCurrency(currencyCode);
  const convertedAmount = amount * currency.rate;
  const fractionDigits = options.precise ? 2 : 0;

  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: options.precise ? 2 : 0,
  }).format(convertedAmount);
}

const createEmptyImportantUploads = () =>
  Object.fromEntries(importantCustomizationFields.map((field) => [field.key, []]));

const getSelectedFileNames = (files) =>
  Array.from(files ?? [])
    .filter((file) => file && typeof file === "object" && "name" in file && file.name)
    .map((file) => file.name);

function Dropdown({
  options,
  value,
  onChange,
  label,
  compact = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption =
    options.find((option) => (option.value ?? option.code) === value) ?? options[0];
  const selectedValue = selectedOption.value ?? selectedOption.code;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleSelect(nextValue) {
    onChange(nextValue);
    setIsOpen(false);
  }

  return (
    <div
      ref={dropdownRef}
      className={[
        "jh-dropdown",
        compact ? "jh-dropdown--compact" : "",
        isOpen ? "jh-dropdown--open" : "",
        className,
      ].filter(Boolean).join(" ")}
    >
      <span className="jh-dropdown__label">{label}</span>
      <button
        type="button"
        className="jh-dropdown__button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{selectedOption.label}</span>
        <span className="jh-dropdown__chevron" aria-hidden="true" />
      </button>
      {isOpen ? (
        <div className="jh-dropdown__menu" role="listbox" aria-label={label}>
          {options.map((option) => {
            const optionValue = option.value ?? option.code;
            const isSelected = optionValue === selectedValue;

            return (
              <button
                key={optionValue || "original"}
                type="button"
                className={`jh-dropdown__option ${isSelected ? "jh-dropdown__option--selected" : ""}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(optionValue)}
              >
                <span>{option.label}</span>
                {option.name ? <small>{option.name}</small> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function RouteScrollReset() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) {
      return undefined;
    }

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (typeof window.scrollTo === "function") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname]);

  return null;
}

function CurrencySelector({ currencyCode, onCurrencyChange, compact = false }) {
  const selectedCurrency = getCurrency(currencyCode);

  return (
    <Dropdown
      className={`jh-currency-select ${compact ? "jh-currency-select--compact" : ""}`}
      compact={compact}
      label={compact ? "Currency" : "Display currency"}
      options={currencyOptions}
      value={selectedCurrency.code}
      onChange={onCurrencyChange}
    />
  );
}

function CurrencyConverter({ currencyCode, onCurrencyChange }) {
  const [amount, setAmount] = useState("280");
  const numericAmount = Number(amount) || 0;
  const selectedCurrency = getCurrency(currencyCode);
  const convertedAmount = formatPrice(numericAmount, selectedCurrency.code, { precise: true });

  function handleAmountChange(event) {
    const nextValue = event.target.value;
    if (/^\d{0,5}(\.\d{0,2})?$/.test(nextValue)) {
      setAmount(nextValue);
    }
  }

  return (
    <aside className="jh-currency-card" aria-label="Currency converter">
      <div className="jh-currency-card__head">
        <p className="jh-eyebrow">Currency Converter</p>
        <h2>View prices your way.</h2>
      </div>
      <div className="jh-currency-card__controls">
        <CurrencySelector
          currencyCode={currencyCode}
          onCurrencyChange={onCurrencyChange}
        />
        <label className="jh-currency-input">
          <span>AED amount</span>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            aria-label="AED amount to convert"
          />
        </label>
      </div>
      <div className="jh-currency-card__result">
        <span>{formatPrice(numericAmount, DEFAULT_CURRENCY)}</span>
        <strong>{convertedAmount}</strong>
      </div>
      <small>
        Estimates use AED as the base price. The checkout remains a demo flow.
      </small>
    </aside>
  );
}

function getCartLines(cart) {
  return boxCatalog
    .filter((box) => cart[box.slug] > 0)
    .map((box) => ({
      ...box,
      quantity: cart[box.slug],
      total: box.price * cart[box.slug],
    }));
}

function CartSummary({
  subtotal,
  shipping,
  total,
  currencyCode = DEFAULT_CURRENCY,
  compact = false,
}) {
  return (
    <div className={`jh-order-summary ${compact ? "jh-order-summary--compact" : ""}`}>
      <div>
        <span>Subtotal</span>
        <strong>{formatPrice(subtotal, currencyCode)}</strong>
      </div>
      <div>
        <span>Shipping</span>
        <strong>{shipping === 0 ? "Free demo" : formatPrice(shipping, currencyCode)}</strong>
      </div>
      <div className="jh-order-summary__total">
        <span>Total</span>
        <strong>{formatPrice(total, currencyCode)}</strong>
      </div>
    </div>
  );
}

function QuantityControl({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="jh-counter" aria-label="Quantity control">
      <button type="button" onClick={onDecrease} aria-label="Decrease quantity">
        -
      </button>
      <span aria-live="polite">{quantity}</span>
      <button type="button" onClick={onIncrease} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}

function getPreviewInitials(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "J";
}

function ImportantBoxCustomizationPreview({ values, photoPreviewUrl, uploadLabels }) {
  const initials = getPreviewInitials(values.familyName || values.recipientName);
  const recipientLine = values.recipientName ? `For ${values.recipientName}` : "For someone loved";

  return (
    <aside className="jh-important-preview" aria-label="You Are Important Box customization preview">
      <div className="jh-important-preview__head">
        <span>Live preview</span>
        <strong>{values.boxTitle || importantPersonalizationDefaults.boxTitle}</strong>
      </div>
      <div className="jh-important-preview__box">
        <div className="jh-important-preview__lid">
          <img src={assetPath("/judhoor-logo.png")} alt="" />
          <span>{values.boxTitle || importantPersonalizationDefaults.boxTitle}</span>
          <strong>{recipientLine}</strong>
        </div>
        <div className="jh-important-preview__tray">
          <div className="jh-preview-tile jh-preview-tile--photo">
            <div className="jh-preview-photo">
              {photoPreviewUrl ? (
                <img
                  src={photoPreviewUrl}
                  alt={`${values.familyName || "Family"} uploaded preview`}
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <small>{values.photoCaption || importantPersonalizationDefaults.photoCaption}</small>
          </div>

          <div className="jh-preview-tile jh-preview-tile--candle">
            <span className="jh-preview-flame" aria-hidden="true" />
            <strong>{values.candleMessage || importantPersonalizationDefaults.candleMessage}</strong>
          </div>

          <div className="jh-preview-tile jh-preview-tile--jar">
            <span className="jh-preview-jar" aria-hidden="true" />
            <strong>{values.jarLabel || importantPersonalizationDefaults.jarLabel}</strong>
          </div>

          <div className="jh-preview-tile jh-preview-tile--letters">
            <span>{values.envelopeLabel || importantPersonalizationDefaults.envelopeLabel}</span>
            <small>{uploadLabels.letters}</small>
          </div>

          <div className="jh-preview-tile jh-preview-tile--qr">
            <span className="jh-preview-qr" aria-hidden="true" />
            <strong>{uploadLabels.voiceNote}</strong>
          </div>

          <div className="jh-preview-tile jh-preview-tile--book">
            <strong>{values.notebookTitle || importantPersonalizationDefaults.notebookTitle}</strong>
            <small>{values.dedication || importantPersonalizationDefaults.dedication}</small>
          </div>
        </div>
      </div>
      <div className="jh-important-preview__uploads" aria-label="Selected customization files">
        <span>
          <strong>Voice</strong>
          {uploadLabels.voiceNote}
        </span>
        <span>
          <strong>Letters</strong>
          {uploadLabels.letters}
        </span>
        <span>
          <strong>Photos</strong>
          {uploadLabels.familyPhotos}
        </span>
      </div>
      <p>{values.familyName || importantPersonalizationDefaults.familyName}</p>
    </aside>
  );
}

function IntroScreen({ onFinish }) {
  useEffect(() => {
    const timer = window.setTimeout(onFinish, 4700);
    return () => window.clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="jh-intro" aria-hidden="true">
      <div className="jh-intro__veil" />
      <div className="jh-intro__stage">
        <div className="jh-intro__halo" />
        <div className="jh-intro__box">
          <div className="jh-intro__ribbon jh-intro__ribbon--vertical" />
          <div className="jh-intro__ribbon jh-intro__ribbon--horizontal" />
          <div className="jh-intro__bow">
            <span className="jh-intro__bow-loop jh-intro__bow-loop--left" />
            <span className="jh-intro__bow-knot" />
            <span className="jh-intro__bow-loop jh-intro__bow-loop--right" />
          </div>
          <div className="jh-intro__lid jh-intro__lid--left" />
          <div className="jh-intro__lid jh-intro__lid--right" />
          <div className="jh-intro__site-glow" />
          <div className="jh-intro__base">
            <img src={assetPath("/judhoor-logo.png")} alt="" className="jh-intro__logo" />
            <span className="jh-intro__shine" />
            <span className="jh-intro__dust jh-intro__dust--one" />
            <span className="jh-intro__dust jh-intro__dust--two" />
            <span className="jh-intro__dust jh-intro__dust--three" />
          </div>
        </div>
        <p className="jh-intro__label">Judhoor | جذور</p>
        <h1 className="jh-intro__title">Untying care. Opening memory.</h1>
      </div>
    </div>
  );
}

function TranslateWidget() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const languages = [
    { code: "", label: "Original" },
    { code: "ar", label: "العربية" },
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "es", label: "Español" },
    { code: "de", label: "Deutsch" },
    { code: "it", label: "Italiano" },
    { code: "tr", label: "Türkçe" },
    { code: "ru", label: "Русский" },
    { code: "zh-CN", label: "简体中文" },
    { code: "ja", label: "日本語" },
    { code: "ko", label: "한국어" },
    { code: "hi", label: "हिन्दी" },
  ];

  function handleChange(value) {
    setSelectedLanguage(value);
    const combo = document.querySelector("#jh-translate .goog-te-combo");
    if (!combo) {
      return;
    }

    combo.value = value;
    combo.dispatchEvent(new Event("change"));
  }

  useEffect(() => {
    const existing = document.querySelector("script[data-judhoor-translate='true']");

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) {
        return;
      }

      const container = document.getElementById("jh-translate");
      if (!container || container.dataset.ready === "true") {
        return;
      }

      container.dataset.ready = "true";
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        "jh-translate",
      );
    };

    if (window.google?.translate) {
      window.googleTranslateElementInit();
      return undefined;
    }

    if (!existing) {
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.dataset.judhoorTranslate = "true";
      document.body.appendChild(script);
    }

    return () => {
      window.googleTranslateElementInit = undefined;
    };
  }, []);

  return (
    <div className="jh-translate-card">
      <span>Translate the site</span>
      <Dropdown
        className="jh-language-dropdown"
        label="Site language"
        options={languages.map((language) => ({
          value: language.code,
          label: language.label,
        }))}
        value={selectedLanguage}
        onChange={handleChange}
      />
      <div id="jh-translate" aria-hidden="true" />
    </div>
  );
}

function Shell({ cartCount, children, currencyCode, onCurrencyChange, onReplayIntro }) {
  const [isHeaderCondensed, setIsHeaderCondensed] = useState(false);
  const [isCompactNavOpen, setIsCompactNavOpen] = useState(false);
  const headerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    function syncHeaderState() {
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const shouldCondense = scrollTop > 140;

      if (!shouldCondense) {
        setIsCompactNavOpen(false);
      }

      setIsHeaderCondensed((current) =>
        current === shouldCondense ? current : shouldCondense,
      );
    }

    syncHeaderState();
    const syncIntervalId = window.setInterval(syncHeaderState, 200);
    window.addEventListener("scroll", syncHeaderState, { passive: true });
    window.addEventListener("resize", syncHeaderState);

    return () => {
      window.clearInterval(syncIntervalId);
      window.removeEventListener("scroll", syncHeaderState);
      window.removeEventListener("resize", syncHeaderState);
    };
  }, []);

  useEffect(() => {
    setIsCompactNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isCompactNavOpen || !isHeaderCondensed) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (!headerRef.current?.contains(event.target)) {
        setIsCompactNavOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsCompactNavOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCompactNavOpen, isHeaderCondensed]);

  const closeCompactNav = () => {
    setIsCompactNavOpen(false);
  };

  const handleReplayIntro = () => {
    closeCompactNav();
    onReplayIntro();
  };

  return (
    <div className="jh-app">
      <a className="jh-skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="jh-bg jh-bg--one" />
      <div className="jh-bg jh-bg--two" />
      <header
        ref={headerRef}
        className={[
          "jh-header",
          isHeaderCondensed ? "jh-header--condensed" : "",
          isHeaderCondensed && isCompactNavOpen ? "jh-header--compact-open" : "",
          cartCount > 0 ? "jh-header--has-cart" : "",
        ].filter(Boolean).join(" ")}
      >
        <NavLink to="/" className="jh-brand" onClick={closeCompactNav}>
          <img src={assetPath("/judhoor-logo.png")} alt="Judhoor logo" />
          <div>
            <strong>Judhoor</strong>
            <span>Premium care boxes for cherished elders</span>
          </div>
        </NavLink>
        <button
          type="button"
          className="jh-nav-toggle"
          aria-controls="jh-primary-nav"
          aria-expanded={isCompactNavOpen}
          aria-label={isCompactNavOpen ? "Close navigation" : "Open navigation"}
          title={isCompactNavOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setIsCompactNavOpen((current) => !current)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <nav
          id="jh-primary-nav"
          className="jh-nav"
          aria-label="Primary navigation"
          aria-hidden={isHeaderCondensed && !isCompactNavOpen ? "true" : undefined}
          onClick={(event) => {
            if (event.target instanceof Element && event.target.closest("a")) {
              closeCompactNav();
            }
          }}
        >
          <NavLink to="/">Home</NavLink>
          <NavLink to="/product-line">Product Line</NavLink>
          <NavLink to="/experience">Experience</NavLink>
          <NavLink to="/demo-day">Demo Day</NavLink>
          <NavLink to="/model-viewer">3D Box</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <CurrencySelector
            currencyCode={currencyCode}
            onCurrencyChange={onCurrencyChange}
            compact
          />
          <button type="button" className="jh-replay" onClick={handleReplayIntro}>
            Replay intro
          </button>
          {cartCount > 0 ? (
            <NavLink to="/cart" className="jh-cart-pill">
              Cart {cartCount}
            </NavLink>
          ) : null}
        </nav>
      </header>
      <main id="main-content" className="jh-main" tabIndex={-1}>{children}</main>
      <footer className="jh-footer">
        <div className="jh-footer__brand">
          <img src={assetPath("/judhoor-logo.png")} alt="Judhoor logo" />
          <div>
            <strong>Judhoor</strong>
            <p>
              Thoughtfully crafted boxes that support memory, wellbeing,
              discovery, and connection.
            </p>
          </div>
        </div>
        <div className="jh-footer__links">
          <span>Navigation</span>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/product-line">Product Line</NavLink>
          <NavLink to="/experience">Experience</NavLink>
          <NavLink to="/demo-day">Demo Day</NavLink>
          <NavLink to="/model-viewer">3D Box</NavLink>
          <NavLink to="/shop">Shop</NavLink>
        </div>
        <div className="jh-footer__links">
          <span>Client Care</span>
          <a href="mailto:hello@judhoor.com">Contact</a>
          <NavLink to="/cart">Cart</NavLink>
          <NavLink to="/checkout">Checkout</NavLink>
        </div>
        <div className="jh-footer__meta">
          <span>Demo contact</span>
          <p>hello@judhoor.com</p>
          <p>+971 50 000 0000</p>
        </div>
        <TranslateWidget />
      </footer>
    </div>
  );
}

function ItemPreviewModal({ item, onClose }) {
  useEffect(() => {
    if (!item) {
      return undefined;
    }

    function onKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  return (
    <div className="jh-modal" onClick={onClose} role="presentation">
      <div
        className="jh-modal__card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
      >
        <button type="button" className="jh-modal__close" onClick={onClose}>
          Close
        </button>
        <div className="jh-modal__layout">
          <div className="jh-item-preview jh-item-preview--image">
            <img src={item.sprite} alt={item.name} decoding="async" />
          </div>
          <div className="jh-modal__copy">
            <p className="jh-eyebrow">Product Detail</p>
            <h2>{item.name}</h2>
            <p>{item.note}</p>
            <span className="jh-modal__hint">
              This is one of the items included inside the selected Judhoor box.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BoxDemoModal({ box, currencyCode, onClose, onAddToCart }) {
  const [tilt, setTilt] = useState({ rotateX: -8, rotateY: 10 });
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef(null);

  useEffect(() => {
    if (!box) {
      return undefined;
    }

    function onKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [box, onClose]);

  useEffect(() => {
    if (box) {
      setTilt({ rotateX: -8, rotateY: 10 });
      setIsOpen(false);
      setIsDragging(false);
      dragStateRef.current = null;
    }
  }, [box]);

  if (!box) {
    return null;
  }

  const gallery = box.images.length > 0 ? box.images : [assetPath("/judhoor-logo.png")];
  const [heroImage] = gallery;
  const demoItems = box.items.slice(0, 6);
  const itemCount = getItemCount(box);
  const clampTilt = (value, min, max) => Math.max(min, Math.min(max, value));

  function handlePointerMove(event) {
    if (dragStateRef.current) {
      event.preventDefault();
      const deltaX = event.clientX - dragStateRef.current.startX;
      const deltaY = event.clientY - dragStateRef.current.startY;
      setTilt({
        rotateX: clampTilt(dragStateRef.current.baseX - deltaY * 0.1, -22, 18),
        rotateY: clampTilt(dragStateRef.current.baseY + deltaX * 0.12, -26, 26),
      });
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    setTilt({
      rotateX: clampTilt((0.5 - y) * 14, -10, 10),
      rotateY: clampTilt((x - 0.5) * 18, -14, 14),
    });
  }

  function handlePointerDown(event) {
    if (event.button !== 0 && event.pointerType === "mouse") {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      baseX: tilt.rotateX,
      baseY: tilt.rotateY,
    };
    setIsDragging(true);
  }

  function handlePointerUp(event) {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStateRef.current = null;
    setIsDragging(false);
    setTilt((current) => ({
      rotateX: current.rotateX * 0.7,
      rotateY: current.rotateY * 0.7,
    }));
  }

  function resetTilt() {
    if (dragStateRef.current) {
      return;
    }

    dragStateRef.current = null;
    setIsDragging(false);
    setTilt((current) => ({
      rotateX: current.rotateX * 0.55,
      rotateY: current.rotateY * 0.55,
    }));
  }

  function fullyResetDemo() {
    dragStateRef.current = null;
    setIsDragging(false);
    setIsOpen(false);
    setTilt({ rotateX: -8, rotateY: 10 });
  }

  return (
    <div className="jh-modal" onClick={onClose} role="presentation">
      <div
        className="jh-modal__card jh-modal__card--demo"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${box.name} 3D demo`}
      >
        <button type="button" className="jh-modal__close" onClick={onClose}>
          Close
        </button>
        <div className="jh-demo-modal">
          <div
            className={`jh-demo-stage ${isDragging ? "jh-demo-stage--dragging" : ""}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={resetTilt}
            onDoubleClick={() => setIsOpen((current) => !current)}
            role="img"
            aria-label={`Draggable 3D preview of ${box.name}`}
          >
            <div
              className="jh-demo-toolbar"
              aria-label="3D demo controls"
              onPointerDown={(event) => event.stopPropagation()}
              onDoubleClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className={`jh-demo-tool ${isOpen ? "jh-demo-tool--active" : ""}`}
                aria-pressed={isOpen}
                onClick={() => setIsOpen((current) => !current)}
              >
                {isOpen ? "Close" : "Open"}
              </button>
              <button type="button" className="jh-demo-tool" onClick={fullyResetDemo}>
                Reset
              </button>
            </div>
            <div
              className={`jh-demo-stage__scene ${isOpen ? "jh-demo-stage__scene--open" : ""}`}
              style={{
                transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              }}
            >
              <span className="jh-demo-stage__glow" />
              <div className={`jh-demo-orbit jh-demo-orbit--${box.theme}`}>
                <span className="jh-demo-orbit__ring" />
                <div className={`jh-demo-orbit__box-3d jh-demo-orbit__box-3d--${box.theme}`}>
                  <span className="jh-demo-orbit__box-face jh-demo-orbit__box-face--back" aria-hidden="true" />
                  <img
                    className="jh-demo-orbit__box"
                    src={heroImage}
                    alt={`${box.name} product mockup`}
                    draggable="false"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="jh-demo-orbit__box-side jh-demo-orbit__box-side--right" aria-hidden="true" />
                  <span className="jh-demo-orbit__box-side jh-demo-orbit__box-side--bottom" aria-hidden="true" />
                  <span className="jh-demo-orbit__box-lid" aria-hidden="true" />
                </div>
                <div className="jh-demo-orbit__items" aria-hidden={!isOpen}>
                  {demoItems.map((item, index) => (
                    <figure
                      key={item.name}
                      className="jh-demo-orbit__item"
                      style={{ "--jh-demo-index": index }}
                    >
                      <span className="jh-demo-orbit__item-art">
                        <img src={item.sprite} alt="" draggable="false" loading="lazy" decoding="async" />
                      </span>
                      <figcaption>{item.name}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
            <p className="jh-demo-stage__hint">
              {isOpen ? "Contents view" : "Closed view"}
            </p>
          </div>
          <div className="jh-demo-copy">
            <p className="jh-eyebrow">Box Preview</p>
            <h2>{box.name}</h2>
            <span>{box.tagline}</span>
            <p>{box.summary}</p>
            <div className="jh-demo-copy__meta">
              <div>
                <small>Price</small>
                <strong>{formatPrice(box.price, currencyCode)}</strong>
              </div>
              <div>
                <small>Includes</small>
                <strong>{itemCount} items</strong>
              </div>
            </div>
            <div className="jh-demo-copy__items" aria-label={`Items in ${box.name}`}>
              {box.items.map((item) => (
                <span key={item.name} className="jh-chip-button jh-chip-button--static">
                  {item.name}
                </span>
              ))}
            </div>
            <div className="jh-demo-actions">
              <button
                type="button"
                className="jh-button jh-button--solid"
                onClick={() => onAddToCart(box.slug)}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage({ currencyCode, onAddToCart }) {
  const featuredBoxes = boxCatalog.map((box) => {
    const homeDetails = {
      "past-box": {
        label: "Memory Care",
        summary: "A nostalgic journey through scents and sounds designed to spark vivid recollections.",
        image: assetPath("/mockups/past-box-hero-new.png"),
      },
      "balance-box": {
        summary: "Gentle physical activities and mindfulness tools for daily equilibrium.",
        image: assetPath("/mockups/balance-box-detail.png"),
      },
      "important-box": {
        displayName: "You Are Important",
        summary: "A gratitude-focused kit featuring guided reflection and legacy journaling.",
        image: assetPath("/mockups/important-box-final-2026.jpeg"),
      },
      "travel-box": {
        summary: "Bringing the world to the home through scents, textures, and maps from distant lands.",
        image: assetPath("/mockups/travel-box-hero-transparent.png"),
      },
    };

    return {
      ...box,
      home: homeDetails[box.slug] ?? {},
    };
  });

  return (
    <>
      <section className="jh-home-drop-banner jh-animate jh-animate--up" aria-label="Father's Day Box coming soon">
        <span>Father&apos;s Day Drop</span>
        <strong>Father&apos;s Day Box Coming Soon</strong>
        <a href="mailto:hello@judhoor.com?subject=Father's%20Day%20Box%20waitlist">
          Notify Me
        </a>
      </section>

      <section className="jh-hero">
        <div className="jh-hero__copy jh-animate jh-animate--up">
          <p className="jh-eyebrow">Nurturing Legacy</p>
          <h1>
            Care that feels like
            <br className="jh-hero__desktop-break" /> a{" "}
            <span>quiet gift.</span>
          </h1>
          <p className="jh-hero__text">
            Premium activity boxes for elders, designed to nourish the mind and
            celebrate the stories that define us.
          </p>
          <div className="jh-hero__actions">
            <NavLink to="/product-line" className="jh-button jh-button--solid">
              Explore the Collection
            </NavLink>
            <NavLink to="/experience" className="jh-button jh-button--ghost">
              Our Story
            </NavLink>
            <NavLink to="/model-viewer" className="jh-button jh-button--ghost">
              View 3D Box
            </NavLink>
          </div>
        </div>
        <div className="jh-hero__visual">
          <div className="jh-hero__visual-shell">
            <img
              src={redesignVisuals.homeHero}
              data-fallback-src={redesignVisuals.homeHeroFallback}
              alt="Soft lifestyle detail of elder care, linen texture, and warm light"
              className="jh-hero__image"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="jh-home-collection jh-animate jh-animate--up">
        <div className="jh-home-collection__head">
          <div>
            <p className="jh-eyebrow">Curated Experiences</p>
            <h2>Discover the Collection</h2>
          </div>
          <NavLink to="/product-line" className="jh-home-collection__link">
            View all products
          </NavLink>
        </div>
        <div className="jh-home-collection__grid">
          {featuredBoxes.map((box) => (
            <article key={box.slug} className={`jh-home-product-card jh-home-product-card--${box.theme}`}>
              <figure className="jh-home-product-card__media">
                <img src={box.home.image ?? box.images[0]} alt={`${box.name} mockup`} decoding="async" />
                {box.home.label ? <span>{box.home.label}</span> : null}
              </figure>
              <div className="jh-home-product-card__body">
                <p className="jh-home-product-card__arabic">{box.arabicName}</p>
                <h3>{box.home.displayName ?? box.name}</h3>
                <p>{box.home.summary ?? box.summary}</p>
              </div>
              <div className="jh-home-product-card__footer">
                <strong>{box.home.displayPrice ?? formatPrice(box.price, currencyCode)}</strong>
                <button
                  type="button"
                  className="jh-home-product-card__cart"
                  aria-label={`Add ${box.name} to cart`}
                  onClick={() => onAddToCart(box.slug)}
                >
                  <span className="jh-home-product-card__cart-icon" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="jh-testimonial jh-animate jh-animate--fade">
        <span aria-hidden="true">"</span>
        <p>
          We believe that elder care isn&apos;t just about utility; it&apos;s about
          honoring the depth of a lifetime. Every box is a bridge between generations.
        </p>
        <small>Judhoor care philosophy</small>
      </section>
    </>
  );
}

function ProductLinePage({
  currencyCode,
  onAddToCart,
  onPreviewItem,
  onPreviewBoxDemo,
}) {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const activeQuizQuestion = boxQuizQuestions[quizStep];
  const selectedQuizOption = activeQuizQuestion
    ? quizAnswers[activeQuizQuestion.id]
    : null;
  const quizResult = getBoxQuizResult(quizAnswers);

  function startQuiz() {
    setIsQuizOpen(true);
    setIsQuizComplete(false);
    setQuizStep(0);
    setQuizAnswers({});
  }

  function selectQuizOption(questionId, optionId) {
    setQuizAnswers((current) => ({
      ...current,
      [questionId]: optionId,
    }));
  }

  function goToNextQuizStep() {
    if (quizStep < boxQuizQuestions.length - 1) {
      setQuizStep((current) => current + 1);
      return;
    }

    setIsQuizComplete(true);
  }

  function goToPreviousQuizStep() {
    if (quizStep > 0) {
      setQuizStep((current) => current - 1);
      return;
    }

    setIsQuizOpen(false);
  }

  return (
    <section className="jh-page jh-product-line-page jh-animate jh-animate--up">
      <div className="jh-product-line-hero">
        <p className="jh-eyebrow">Our Collection</p>
        <h1>Ritual, rhythm, and emotional purpose.</h1>
        <p>
          Each box is a curated bridge between generations, crafted with
          artisanal care and designed to nurture the legacy of those we cherish.
        </p>
      </div>

      <div className="jh-product-line-list">
        {boxCatalog.map((box, index) => {
          return (
            <article
              key={box.slug}
              className={`jh-product-row jh-product-row--${box.theme} ${index % 2 === 1 ? "jh-product-row--reverse" : ""}`}
              style={{
                "--jh-row-index": index,
                "--jh-row-sheen-delay": `${900 + index * 420}ms`,
                animationDelay: `${index * 120}ms`,
              }}
            >
              <figure className="jh-product-row__media">
                <img src={box.images[0]} alt={`${box.name} presentation`} decoding="async" />
              </figure>
              <div className="jh-product-row__copy">
                <p className="jh-product-row__arabic">{box.arabicName}</p>
                <h2>{box.name}</h2>
                <p>{box.summary}</p>
                <div className="jh-product-row__tags" aria-label={`All items in ${box.name}`}>
                  {box.items.map((item, itemIndex) => (
                    <button
                      key={item.name}
                      type="button"
                      className="jh-product-row__tag"
                      style={{ animationDelay: `${index * 120 + itemIndex * 28}ms` }}
                      onClick={() => onPreviewItem(item)}
                    >
                      <img src={item.sprite} alt="" loading="lazy" decoding="async" />
                      {item.name}
                    </button>
                  ))}
                </div>
                <div className="jh-product-row__purchase">
                  <div className="jh-product-row__price">
                    <strong>{formatPrice(box.price, currencyCode)}</strong>
                    <span>{box.tagline}</span>
                  </div>
                  <div className="jh-product-row__actions">
                    <button
                      type="button"
                      className="jh-product-row__cart"
                      onClick={() => onAddToCart(box.slug)}
                    >
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      className="jh-product-row__demo"
                      aria-label={`Open ${box.name} 3D demo`}
                      onClick={() => onPreviewBoxDemo(box)}
                    >
                      3D
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <aside
        className={`jh-product-line-advisor ${isQuizOpen ? "is-open" : ""}`}
        aria-label="Box selection help"
      >
        <h2>Can't decide?</h2>
        <p>
          Take our heritage quiz to find the perfect ritual for your loved one
          or schedule a consultation with our curation experts.
        </p>
        {!isQuizOpen ? (
          <div className="jh-product-line-advisor__actions">
            <button
              type="button"
              className="jh-product-line-advisor__button jh-product-line-advisor__button--light"
              onClick={startQuiz}
            >
              Start the Quiz
            </button>
            <a
              className="jh-product-line-advisor__button"
              href="mailto:hello@judhoor.com?subject=Judhoor%20consultation"
            >
              Book Consultation
            </a>
          </div>
        ) : (
          <div className="jh-box-quiz">
            {!isQuizComplete ? (
              <>
                <div className="jh-box-quiz__top">
                  <span>
                    Question {quizStep + 1} of {boxQuizQuestions.length}
                  </span>
                  <strong>{activeQuizQuestion.prompt}</strong>
                </div>
                <div className="jh-box-quiz__meter" aria-hidden="true">
                  <span
                    style={{
                      width: `${((quizStep + 1) / boxQuizQuestions.length) * 100}%`,
                    }}
                  />
                </div>
                <div className="jh-box-quiz__options">
                  {activeQuizQuestion.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`jh-box-quiz__option ${
                        selectedQuizOption === option.id ? "is-selected" : ""
                      }`}
                      onClick={() => selectQuizOption(activeQuizQuestion.id, option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="jh-box-quiz__actions">
                  <button type="button" onClick={goToPreviousQuizStep}>
                    {quizStep === 0 ? "Close" : "Back"}
                  </button>
                  <button
                    type="button"
                    className="jh-product-line-advisor__button jh-product-line-advisor__button--light"
                    disabled={!selectedQuizOption}
                    onClick={goToNextQuizStep}
                  >
                    {quizStep === boxQuizQuestions.length - 1 ? "See My Box" : "Next"}
                  </button>
                </div>
              </>
            ) : (
              <div className="jh-box-quiz__result">
                <figure>
                  <img src={quizResult.images[0]} alt={`${quizResult.name} recommendation`} />
                </figure>
                <div>
                  <span>Your best match</span>
                  <strong>{quizResult.name}</strong>
                  <p>{boxQuizResultCopy[quizResult.slug] ?? quizResult.summary}</p>
                  <small>{quizResult.tagline}</small>
                  <div className="jh-box-quiz__result-actions">
                    <button
                      type="button"
                      className="jh-product-line-advisor__button jh-product-line-advisor__button--light"
                      onClick={() => onAddToCart(quizResult.slug)}
                    >
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      className="jh-product-line-advisor__button"
                      onClick={() => onPreviewBoxDemo(quizResult)}
                    >
                      Preview 3D
                    </button>
                    <button type="button" onClick={startQuiz}>
                      Retake Quiz
                    </button>
                  </div>
                </div>
              </div>
            )}
            <a
              className="jh-product-line-advisor__button jh-product-line-advisor__button--light jh-box-quiz__consult"
              href="mailto:hello@judhoor.com?subject=Judhoor%20consultation"
            >
              Book Consultation
            </a>
          </div>
        )}
      </aside>
    </section>
  );
}

function ExperiencePage() {
  const storyPanels = [
    {
      title: "Unboxing should feel ceremonial, not clinical.",
      text:
        "The first impression matters. Judhoor boxes are designed to arrive like meaningful gifts, with premium presentation, warm materials, and an immediate sense of care.",
      image: assetPath("/mockups/past-box-hero-new.png"),
      alt: "The Past Box ceremonial box presentation",
    },
    {
      title: "Objects are chosen to invite memory, touch, and conversation.",
      text:
        "Instead of abstract exercises, each item is rooted in familiarity: music, scent, handwriting, keepsakes, prayer, tea, letters, and textures that encourage emotional comfort.",
      image: assetPath("/mockups/important-box-final-2026.jpeg"),
      alt: "You Are Important Box presentation",
    },
    {
      title: "The experience moves between calm activity and shared presence.",
      text:
        "Some moments are reflective and solitary. Others are designed for family participation. Together they create a rhythm that feels supportive rather than demanding.",
      image: assetPath("/mockups/balance-box-detail.png"),
      alt: "Balance Box presentation",
    },
    {
      title: "Every box becomes a repeatable ritual of care.",
      text:
        "The goal is not a one-time unboxing. Judhoor is designed to be revisited across days and weeks, turning beautifully made objects into ongoing moments of connection.",
      image: assetPath("/mockups/travel-box-hero-transparent.png"),
      alt: "Travel Box presentation",
    },
  ];

  return (
    <section className="jh-page jh-experience-page jh-animate jh-animate--up">
      <div className="jh-section__head">
        <p className="jh-eyebrow">Experience Design</p>
        <h1>Designed to feel calm, intuitive, and emotionally safe from unboxing onward.</h1>
      </div>
      <div className="jh-storyline">
        {storyPanels.map((panel, index) => (
          <article
            key={panel.title}
            className={`jh-story-panel ${index % 2 === 1 ? "jh-story-panel--reverse" : ""}`}
          >
            <figure className="jh-story-panel__media">
              <img src={panel.image} alt={panel.alt} decoding="async" />
            </figure>
            <div className="jh-story-panel__copy">
              <p className="jh-eyebrow">{`Chapter 0${index + 1}`}</p>
              <h2>{panel.title}</h2>
              <p>{panel.text}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="jh-card-decks" aria-labelledby="card-decks-heading">
        <div className="jh-section__head jh-section__head--split">
          <div>
            <p className="jh-eyebrow">Card Decks</p>
            <h2 id="card-decks-heading">Individual cards that support the box experience.</h2>
          </div>
          <p>
            These decks bring the Judhoor rituals into everyday conversations,
            making the physical objects easier to revisit with family members
            and caregivers.
          </p>
        </div>
        <div className="jh-card-deck-grid">
          {cardDecks.map((deck) => (
            <article
              key={deck.title}
              className={`jh-card-deck jh-card-deck--${deck.orientation}`}
            >
              <div className="jh-card-deck__copy">
                <p className="jh-eyebrow">{deck.label}</p>
                <h3>{deck.title}</h3>
                <p>{deck.description}</p>
                <div className="jh-card-deck__tags" aria-label={`${deck.title} themes`}>
                  <span>{deck.cards.length} individual cards</span>
                  {deck.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="jh-card-deck__cards" aria-label={`${deck.title} individual cards`}>
                {deck.cards.map((card, index) => (
                  <figure key={card.image} className="jh-deck-card">
                    <img
                      src={card.image}
                      alt={card.alt}
                      loading={index < 2 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    <figcaption>{card.label}</figcaption>
                  </figure>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="jh-step-grid">
        {journeySteps.map((step, index) => (
          <article key={step.title} className="jh-step-card">
            <span>{`0${index + 1}`}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
      <div className="jh-guidance">
        <div>
          <p className="jh-eyebrow">Included In Every Box</p>
          <h2>Family guide cards encourage care without pressure.</h2>
          <p>
            Each box includes thoughtful guidance on dementia-friendly
            interaction, safe item use, gentle encouragement, and how to create
            repeatable rituals of connection.
          </p>
        </div>
        <div className="jh-guidance__list">
          <span>Kind prompts for families and caregivers</span>
          <span>Safe object use and comfort cues</span>
          <span>Encouragement without infantilization</span>
          <span>Repeatable shared moments across generations</span>
        </div>
      </div>
    </section>
  );
}

function ShopPage({ cart, currencyCode, onAddToCart, onUpdateQuantity }) {
  const cartLines = getCartLines(cart);
  const subtotal = cartLines.reduce((sum, item) => sum + item.total, 0);

  return (
    <section className="jh-page jh-shop-page jh-animate jh-animate--up">
      <div className="jh-section__head">
        <p className="jh-eyebrow">Shop</p>
        <h1>Choose the boxes you want, then continue through a polished demo checkout.</h1>
        <p>
          Browse the Judhoor collection, add boxes to the cart, and move
          through a complete demo purchase journey.
        </p>
      </div>
      <div className="jh-shop-layout">
        <div className="jh-shop-grid">
          {boxCatalog.map((box) => (
            <article key={box.slug} className="jh-shop-card">
              <figure>
                <img src={box.images[0]} alt={box.name} loading="lazy" decoding="async" />
              </figure>
              <div className="jh-shop-card__body">
                <p className="jh-eyebrow">{box.arabicName}</p>
                <h3>{box.name}</h3>
                <p>{box.summary}</p>
                <div className="jh-shop-card__badges">
                  <span>{box.tagline}</span>
                  <span>{getItemCount(box)} curated items</span>
                  {box.slug === "important-box" ? <span>Live customization in checkout</span> : null}
                </div>
                <div className="jh-shop-card__row">
                  <strong>{formatPrice(box.price, currencyCode)}</strong>
                  <button
                    type="button"
                    className="jh-button jh-button--small"
                    onClick={() => onAddToCart(box.slug)}
                  >
                    Add to cart
                  </button>
                </div>
                {cart[box.slug] > 0 ? (
                  <div className="jh-shop-card__inline-cart">
                    <span>In cart</span>
                    <QuantityControl
                      quantity={cart[box.slug]}
                      onDecrease={() => onUpdateQuantity(box.slug, -1)}
                      onIncrease={() => onUpdateQuantity(box.slug, 1)}
                    />
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        <aside className="jh-checkout">
          <h2>Your cart</h2>
          {cartLines.length === 0 ? (
            <p className="jh-checkout__empty">
              Add a box to start the demo checkout flow.
            </p>
          ) : (
            <div className="jh-checkout__items">
              {cartLines.map((box) => (
                <div key={box.slug} className="jh-checkout__item jh-checkout__item--editable">
                  <div className="jh-checkout__item-copy">
                    <strong>{box.name}</strong>
                    <span>{box.quantity} x {formatPrice(box.price, currencyCode)}</span>
                  </div>
                  <div className="jh-cart-line-actions jh-cart-line-actions--end">
                    <QuantityControl
                      quantity={box.quantity}
                      onDecrease={() => onUpdateQuantity(box.slug, -1)}
                      onIncrease={() => onUpdateQuantity(box.slug, 1)}
                    />
                    <button
                      type="button"
                      className="jh-remove-line"
                      onClick={() => onUpdateQuantity(box.slug, -box.quantity)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <CartSummary
            subtotal={subtotal}
            shipping={0}
            total={subtotal}
            currencyCode={currencyCode}
            compact
          />
          <div className="jh-checkout__actions">
            <NavLink to="/cart" className="jh-button jh-button--ghost jh-button--full">
              Review cart
            </NavLink>
            <NavLink
              to={cartLines.length === 0 ? "/shop" : "/checkout"}
              className="jh-button jh-button--solid jh-button--full"
            >
              Go to checkout
            </NavLink>
          </div>
        </aside>
      </div>
    </section>
  );
}

function CartPage({ cart, currencyCode, onUpdateQuantity }) {
  const cartLines = getCartLines(cart);
  const subtotal = cartLines.reduce((sum, item) => sum + item.total, 0);
  const hasImportantBox = cartLines.some((item) => item.slug === "important-box");

  return (
    <section className="jh-page jh-cart-page jh-animate jh-animate--up">
      <div className="jh-section__head">
        <p className="jh-eyebrow">Cart</p>
        <h1>Review your cart before heading to checkout.</h1>
        <p>Adjust quantities, keep browsing, or move straight to the demo payment page.</p>
      </div>

      {cartLines.length === 0 ? (
        <div className="jh-empty-state">
          <h2>Your cart is empty.</h2>
          <p>Start with a Judhoor box and come back here when you are ready to check out.</p>
          <NavLink to="/shop" className="jh-button jh-button--solid">
            Browse the shop
          </NavLink>
        </div>
      ) : (
        <div className="jh-cart-layout">
          <div className="jh-cart-list">
            {cartLines.map((item) => (
              <article key={item.slug} className="jh-cart-item">
                <figure className="jh-cart-item__media">
                  <img src={item.images[0]} alt={item.name} loading="lazy" decoding="async" />
                </figure>
                <div className="jh-cart-item__copy">
                  <p className="jh-eyebrow">{item.arabicName}</p>
                  <h2>{item.name}</h2>
                  <p>{item.summary}</p>
                  <div className="jh-cart-item__meta">
                    <span>{item.tagline}</span>
                    <span>{getItemCount(item)} curated items</span>
                    {item.slug === "important-box" ? <span>Customization required</span> : null}
                  </div>
                  {item.slug === "important-box" ? (
                    <NavLink to="/checkout" className="jh-cart-customize-link">
                      Customize in checkout
                    </NavLink>
                  ) : null}
                </div>
                <div className="jh-cart-item__controls">
                  <strong>{formatPrice(item.price, currencyCode)}</strong>
                  <div className="jh-cart-line-actions jh-cart-line-actions--end">
                    <QuantityControl
                      quantity={item.quantity}
                      onDecrease={() => onUpdateQuantity(item.slug, -1)}
                      onIncrease={() => onUpdateQuantity(item.slug, 1)}
                    />
                    <button
                      type="button"
                      className="jh-remove-line"
                      onClick={() => onUpdateQuantity(item.slug, -item.quantity)}
                    >
                      Remove
                    </button>
                  </div>
                  <span className="jh-cart-item__line-total">
                    {formatPrice(item.total, currencyCode)}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <aside className="jh-cart-sidebar">
            <div className="jh-checkout">
              <h2>Order summary</h2>
              <CartSummary
                subtotal={subtotal}
                shipping={0}
                total={subtotal}
                currencyCode={currencyCode}
              />
              {hasImportantBox ? (
                <p className="jh-checkout__order-note jh-checkout__order-note--custom">
                  Your You Are Important Box will ask for a voice note, letters, and
                  family photos before the demo order is placed.
                </p>
              ) : null}
              <div className="jh-checkout__actions">
                <NavLink to="/shop" className="jh-button jh-button--ghost jh-button--full">
                  Keep shopping
                </NavLink>
                <NavLink to="/checkout" className="jh-button jh-button--solid jh-button--full">
                  Continue to checkout
                </NavLink>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function CheckoutPage({ cart, currencyCode, onUpdateQuantity, onSubmitDemoOrder }) {
  const navigate = useNavigate();
  const cartLines = getCartLines(cart);
  const subtotal = cartLines.reduce((sum, item) => sum + item.total, 0);
  const shipping = cartLines.length > 0 ? 35 : 0;
  const total = subtotal + shipping;
  const hasImportantBox = cartLines.some((item) => item.slug === "important-box");
  const importantCustomizerRef = useRef(null);
  const [importantUploads, setImportantUploads] = useState(createEmptyImportantUploads);
  const [importantUploadInputVersions, setImportantUploadInputVersions] = useState(() =>
    Object.fromEntries(importantCustomizationFields.map((field) => [field.key, 0])),
  );
  const [importantPersonalization, setImportantPersonalization] = useState(
    importantPersonalizationDefaults,
  );
  const [importantPersonalMessage, setImportantPersonalMessage] = useState("");
  const [importantCustomizationError, setImportantCustomizationError] = useState("");
  const [importantPhotoPreviewUrl, setImportantPhotoPreviewUrl] = useState("");
  const selectedFamilyPhoto =
    importantUploads.familyPhotos.find((file) => file.type?.startsWith("image/")) ?? null;
  const completedImportantUploadCount = importantRequiredUploadKeys.filter(
    (key) => (importantUploads[key] ?? []).length > 0,
  ).length;
  const isImportantUploadReady = completedImportantUploadCount === importantRequiredUploadKeys.length;
  const isImportantPersonalizationReady = importantRequiredPersonalizationKeys.every((key) =>
    importantPersonalization[key]?.trim(),
  );
  const isImportantCustomizationReady =
    isImportantPersonalizationReady && isImportantUploadReady;

  useEffect(() => {
    if (!selectedFamilyPhoto || typeof URL === "undefined") {
      setImportantPhotoPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFamilyPhoto);
    setImportantPhotoPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFamilyPhoto]);

  function handleImportantUploadChange(key, files) {
    const nextFiles = Array.from(files ?? []);

    setImportantUploads((current) => ({
      ...current,
      [key]: nextFiles,
    }));

    if (nextFiles.length > 0) {
      setImportantCustomizationError("");
    }
  }

  function resetImportantUploadInput(key) {
    setImportantUploadInputVersions((current) => ({
      ...current,
      [key]: (current[key] ?? 0) + 1,
    }));
  }

  function handleRemoveImportantUpload(key, fileIndex) {
    setImportantUploads((current) => ({
      ...current,
      [key]: (current[key] ?? []).filter((_, index) => index !== fileIndex),
    }));
    resetImportantUploadInput(key);
  }

  function handleClearImportantUpload(key) {
    setImportantUploads((current) => ({
      ...current,
      [key]: [],
    }));
    resetImportantUploadInput(key);
  }

  function handleResetImportantCustomization() {
    setImportantUploads(createEmptyImportantUploads());
    setImportantPersonalization(importantPersonalizationDefaults);
    setImportantPersonalMessage("");
    setImportantCustomizationError("");
    setImportantUploadInputVersions((current) =>
      Object.fromEntries(
        importantCustomizationFields.map((field) => [field.key, (current[field.key] ?? 0) + 1]),
      ),
    );
  }

  function handleImportantPersonalizationChange(key, value) {
    setImportantPersonalization((current) => ({
      ...current,
      [key]: value,
    }));

    if (importantRequiredPersonalizationKeys.includes(key) && value.trim()) {
      setImportantCustomizationError("");
    }
  }

  function getImportantUploadLabel(key) {
    const files = importantUploads[key] ?? [];

    if (files.length === 0) {
      return "No file selected";
    }

    if (files.length === 1) {
      return files[0].name;
    }

    return `${files.length} files selected`;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (cartLines.length === 0) {
      navigate("/shop");
      return;
    }

    if (hasImportantBox && !isImportantCustomizationReady) {
      const missingTextFields = importantPersonalizationFields
        .filter(
          (field) =>
            importantRequiredPersonalizationKeys.includes(field.key) &&
            !importantPersonalization[field.key]?.trim(),
        )
        .map((field) => field.label.toLowerCase());
      const missingUploads = importantCustomizationFields
        .filter(
          (field) =>
            importantRequiredUploadKeys.includes(field.key) &&
            (importantUploads[field.key] ?? []).length === 0,
        )
        .map((field) => field.label.toLowerCase());
      const requirements = [...missingTextFields, ...missingUploads].join(", ");

      setImportantCustomizationError(
        requirements
          ? `Please complete the You Are Important customization: ${requirements}.`
          : "Please complete the You Are Important customization before placing the demo order.",
      );
      importantCustomizerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const orderDetails = {
      customerName: formData.get("customerName"),
      email: formData.get("email"),
      city: formData.get("city"),
      total,
      itemCount: cartLines.reduce((sum, item) => sum + item.quantity, 0),
      importantBoxCustomization: hasImportantBox
        ? {
            voiceNote: getSelectedFileNames(importantUploads.voiceNote),
            letters: getSelectedFileNames(importantUploads.letters),
            familyPhotos: getSelectedFileNames(importantUploads.familyPhotos),
            personalization: importantPersonalizationFields.reduce(
              (details, field) => ({
                ...details,
                [field.key]:
                  formData.get(field.name) ||
                  importantPersonalization[field.key] ||
                  importantPersonalizationDefaults[field.key],
              }),
              {},
            ),
            note: importantPersonalMessage,
          }
        : null,
    };

    onSubmitDemoOrder(orderDetails);
    navigate("/checkout/success");
  }

  if (cartLines.length === 0) {
    return (
      <section className="jh-page jh-checkout-route jh-animate jh-animate--up">
        <div className="jh-empty-state">
          <h1>There’s nothing to check out yet.</h1>
          <p>Add a box to your cart first, then return here for the demo payment flow.</p>
          <NavLink to="/shop" className="jh-button jh-button--solid">
            Go to shop
          </NavLink>
        </div>
      </section>
    );
  }

  return (
    <section className="jh-page jh-checkout-route jh-animate jh-animate--up">
      <div className="jh-section__head">
        <p className="jh-eyebrow">Checkout Demo</p>
        <h1>Enter delivery details and complete the demo checkout.</h1>
        <p>
          Fill in the required fields below. This checkout is for demonstration only,
          so no payment will be processed.
        </p>
      </div>

      <div className="jh-checkout-page">
        <form className="jh-payment-form" onSubmit={handleSubmit}>
          <section className="jh-payment-card">
            <div className="jh-payment-card__head">
              <p className="jh-eyebrow">Contact</p>
              <h2>Customer details</h2>
            </div>
            <div className="jh-form-grid">
              <label>
                Full name
                <input
                  name="customerName"
                  type="text"
                  placeholder="Omar Al Mansoori"
                  autoComplete="name"
                  maxLength="50"
                  required
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  placeholder="omar@example.com"
                  autoComplete="email"
                  maxLength="80"
                  required
                />
              </label>
              <label>
                Phone
                <input
                  name="phone"
                  type="tel"
                  placeholder="+971 50 000 0000"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength="18"
                  required
                />
              </label>
              <label>
                City
                <input
                  name="city"
                  type="text"
                  placeholder="Dubai"
                  autoComplete="address-level2"
                  maxLength="40"
                  required
                />
              </label>
            </div>
          </section>

          <section className="jh-payment-card">
            <div className="jh-payment-card__head">
              <p className="jh-eyebrow">Delivery</p>
              <h2>Shipping information</h2>
            </div>
            <div className="jh-form-grid">
              <label className="jh-form-grid__full">
                Address line
                <input
                  name="address"
                  type="text"
                  placeholder="Villa 12, Jumeirah 1"
                  autoComplete="street-address"
                  maxLength="120"
                  required
                />
              </label>
              <label>
                Emirate / Region
                <input
                  name="region"
                  type="text"
                  placeholder="Dubai"
                  autoComplete="address-level1"
                  maxLength="40"
                  required
                />
              </label>
              <label>
                Postal code
                <input
                  name="postalCode"
                  type="text"
                  placeholder="00000"
                  inputMode="numeric"
                  maxLength="10"
                />
              </label>
              <label className="jh-form-grid__full">
                Delivery notes
                <textarea
                  name="notes"
                  rows="4"
                  placeholder="Add any gift note, family message, or delivery instruction."
                  maxLength="300"
                />
              </label>
            </div>
          </section>

          {hasImportantBox ? (
            <section
              className="jh-payment-card jh-important-customizer"
              ref={importantCustomizerRef}
            >
              <div className="jh-payment-card__head">
                <p className="jh-eyebrow">You Are Important Box</p>
                <h2>Customize the keepsakes.</h2>
              </div>
              <div className="jh-important-customizer__intro">
                <img
                  src={assetPath("/mockups/important-box-final-2026.jpeg")}
                  alt="You Are Important Box updated presentation"
                  loading="lazy"
                  decoding="async"
                />
                <p>
                  Add the family materials that make this box personal before
                  completing the demo order.
                </p>
              </div>
              <div className="jh-customization-steps" aria-label="Customization progress">
                {importantCustomizationSteps.map((step, index) => {
                  const isComplete =
                    step.key === "personalization"
                      ? isImportantPersonalizationReady
                      : step.key === "uploads"
                        ? isImportantUploadReady
                        : isImportantCustomizationReady;

                  return (
                    <div
                      key={step.key}
                      className={`jh-customization-step ${isComplete ? "is-complete" : ""}`}
                    >
                      <span>{index + 1}</span>
                      <div>
                        <strong>{step.label}</strong>
                        <small>{step.detail}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div
                className={`jh-customization-status ${
                  isImportantCustomizationReady ? "is-ready" : ""
                }`}
                aria-live="polite"
              >
                <div>
                  <strong>
                    {isImportantCustomizationReady
                      ? "Customization ready"
                      : `${completedImportantUploadCount}/${importantRequiredUploadKeys.length} required uploads added`}
                  </strong>
                  <span>
                    {isImportantCustomizationReady
                      ? "The preview is ready for the demo order."
                      : "Add a voice note, letters, and family photos to complete this box."}
                  </span>
                </div>
                <button
                  type="button"
                  className="jh-customization-reset"
                  onClick={handleResetImportantCustomization}
                >
                  Reset
                </button>
              </div>
              {importantCustomizationError ? (
                <p className="jh-customization-error" role="alert">
                  {importantCustomizationError}
                </p>
              ) : null}
              <div className="jh-customization-workspace">
                <div className="jh-customization-editor">
                  <div className="jh-form-grid jh-personalization-grid">
                    {importantPersonalizationFields.map((field) => (
                      <label
                        key={field.key}
                        className={`jh-custom-text-field ${field.multiline ? "jh-custom-text-field--full" : ""}`}
                      >
                        <span className="jh-custom-text-field__label">{field.label}</span>
                        <span className="jh-custom-text-field__detail">{field.detail}</span>
                        {field.multiline ? (
                          <textarea
                            name={field.name}
                            rows="3"
                            value={importantPersonalization[field.key]}
                            placeholder={field.placeholder}
                            maxLength={field.maxLength}
                            onChange={(event) =>
                              handleImportantPersonalizationChange(field.key, event.target.value)
                            }
                          />
                        ) : (
                          <input
                            name={field.name}
                            type="text"
                            value={importantPersonalization[field.key]}
                            placeholder={field.placeholder}
                            maxLength={field.maxLength}
                            onChange={(event) =>
                              handleImportantPersonalizationChange(field.key, event.target.value)
                            }
                          />
                        )}
                      </label>
                    ))}
                  </div>
                  <div className="jh-upload-grid">
                    {importantCustomizationFields.map((field) => {
                      const files = importantUploads[field.key] ?? [];
                      const isComplete = files.length > 0;

                      return (
                        <div
                          key={field.key}
                          className={`jh-upload-field ${isComplete ? "is-complete" : ""}`}
                        >
                          <div className="jh-upload-field__top">
                            <div>
                              <label className="jh-upload-field__label" htmlFor={field.id}>
                                {field.label}
                              </label>
                              <span className="jh-upload-field__detail">{field.detail}</span>
                            </div>
                            <strong className="jh-upload-field__state">
                              {isComplete ? "Ready" : "Required"}
                            </strong>
                          </div>
                          <input
                            key={`${field.key}-${importantUploadInputVersions[field.key]}`}
                            id={field.id}
                            name={field.name}
                            type="file"
                            accept={field.accept}
                            multiple={field.multiple}
                            aria-describedby={`${field.id}Status`}
                            aria-invalid={
                              importantCustomizationError && !isComplete ? "true" : undefined
                            }
                            onChange={(event) =>
                              handleImportantUploadChange(field.key, event.target.files)
                            }
                          />
                          <span
                            className="jh-upload-field__selected"
                            id={`${field.id}Status`}
                          >
                            {getImportantUploadLabel(field.key)}
                          </span>
                          {files.length > 0 ? (
                            <ul className="jh-upload-field__files">
                              {files.map((file, index) => (
                                <li key={`${file.name}-${file.lastModified}-${index}`}>
                                  <span>{file.name}</span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveImportantUpload(field.key, index)
                                    }
                                  >
                                    Remove
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="jh-upload-field__empty">Waiting for upload</span>
                          )}
                          {files.length > 1 ? (
                            <button
                              type="button"
                              className="jh-upload-field__clear"
                              onClick={() => handleClearImportantUpload(field.key)}
                            >
                              Clear all
                            </button>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                  <label className="jh-form-grid__full jh-customization-note">
                    Personal message for the box
                    <textarea
                      name="importantPersonalMessage"
                      rows="4"
                      placeholder="Add names, dates, or any message that should guide the customized keepsakes."
                      maxLength="420"
                      value={importantPersonalMessage}
                      onChange={(event) => setImportantPersonalMessage(event.target.value)}
                    />
                  </label>
                </div>
                <ImportantBoxCustomizationPreview
                  values={importantPersonalization}
                  photoPreviewUrl={importantPhotoPreviewUrl}
                  uploadLabels={{
                    voiceNote: getImportantUploadLabel("voiceNote"),
                    letters: getImportantUploadLabel("letters"),
                    familyPhotos: getImportantUploadLabel("familyPhotos"),
                  }}
                />
              </div>
            </section>
          ) : null}

          <section className="jh-payment-card">
            <div className="jh-payment-card__head">
              <p className="jh-eyebrow">Payment</p>
              <h2>Card details</h2>
            </div>
            <div className="jh-demo-card">
              <span>Demo Visa</span>
              <strong>4242 4242 4242 4242</strong>
              <small>Use the sample card details below. No payment will be processed.</small>
            </div>
            <div className="jh-form-grid">
              <label className="jh-form-grid__full">
                Card number
                <input
                  name="cardNumber"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="4242 4242 4242 4242"
                  maxLength="19"
                  pattern="[0-9 ]{13,19}"
                  required
                />
              </label>
              <label>
                Name on card
                <input
                  name="cardName"
                  type="text"
                  autoComplete="cc-name"
                  placeholder="Omar Al Mansoori"
                  maxLength="50"
                  required
                />
              </label>
              <label>
                Expiry
                <input
                  name="expiry"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="08/29"
                  maxLength="5"
                  pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
                  required
                />
              </label>
              <label>
                CVV
                <input
                  name="cvv"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  maxLength="4"
                  pattern="[0-9]{3,4}"
                  required
                />
              </label>
            </div>
          </section>

          <button type="submit" className="jh-button jh-button--solid jh-button--full">
            Place demo order
          </button>
        </form>

        <aside className="jh-cart-sidebar">
          <div className="jh-checkout jh-checkout--order">
            <div className="jh-checkout__header">
              <div>
                <p className="jh-eyebrow">Summary</p>
                <h2>Your order</h2>
              </div>
              <NavLink to="/cart" className="jh-checkout__edit-link">
                Edit cart
              </NavLink>
            </div>
            <div className="jh-checkout__items">
              {cartLines.map((item) => (
                <div key={item.slug} className="jh-checkout__item jh-checkout__item--editable">
                  <div className="jh-checkout__item-copy">
                    <strong>{item.name}</strong>
                    <span>{item.quantity} x {formatPrice(item.price, currencyCode)}</span>
                    {item.slug === "important-box" ? (
                      <span className="jh-checkout__custom-line">
                        {isImportantCustomizationReady
                          ? "Customization ready"
                          : "Customization required"}
                      </span>
                    ) : null}
                  </div>
                  <div className="jh-checkout__item-side">
                    <strong>{formatPrice(item.total, currencyCode)}</strong>
                    <div className="jh-cart-line-actions jh-cart-line-actions--end">
                      <QuantityControl
                        quantity={item.quantity}
                        onDecrease={() => onUpdateQuantity(item.slug, -1)}
                        onIncrease={() => onUpdateQuantity(item.slug, 1)}
                      />
                      <button
                        type="button"
                        className="jh-remove-line"
                        onClick={() => onUpdateQuantity(item.slug, -item.quantity)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="jh-checkout__order-note">
              You can adjust quantities or remove boxes before placing the demo order.
            </p>
            {hasImportantBox ? (
              <p
                className={`jh-checkout__order-note jh-checkout__order-note--custom ${
                  isImportantCustomizationReady ? "is-ready" : ""
                }`}
              >
                {isImportantCustomizationReady
                  ? "Your You Are Important Box customization is ready for the demo order."
                  : "Complete the You Are Important Box customization before placing the demo order."}
              </p>
            ) : null}
            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              currencyCode={currencyCode}
            />
            <p className="jh-demo-disclaimer">
              Demo checkout only. Review your order, complete the required fields, and
              submit to see the confirmation page.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function CheckoutSuccessPage({ lastOrder, currencyCode }) {
  if (!lastOrder) {
    return (
      <section className="jh-page jh-success-page jh-animate jh-animate--up">
        <div className="jh-empty-state">
          <h1>No recent demo order found.</h1>
          <p>
            Complete the checkout flow from your cart first, and we will show the full
            confirmation here.
          </p>
          <div className="jh-success-card__actions">
            <NavLink to="/shop" className="jh-button jh-button--ghost">
              Browse boxes
            </NavLink>
            <NavLink to="/cart" className="jh-button jh-button--solid">
              Go to cart
            </NavLink>
          </div>
        </div>
      </section>
    );
  }

  const customization = lastOrder.importantBoxCustomization;
  const personalization = customization?.personalization;
  const formatCustomizationFiles = (files) =>
    files?.length ? files.join(", ") : "No file selected";

  return (
    <section className="jh-page jh-success-page jh-animate jh-animate--up">
      <div className="jh-success-card">
        <p className="jh-eyebrow">Order complete</p>
        <h1>Your demo order has been placed.</h1>
        <p>
          A confirmation experience has been prepared for {lastOrder.customerName}.
        </p>
        <div className="jh-success-card__details">
          <span>{lastOrder.email}</span>
          <span>{lastOrder.city}</span>
          <span>{lastOrder.itemCount} item{lastOrder.itemCount === 1 ? "" : "s"}</span>
          <span>{formatPrice(lastOrder.total, currencyCode)}</span>
        </div>
        {customization ? (
          <div className="jh-success-customization">
            <strong>You Are Important customization received</strong>
            {personalization ? (
              <div className="jh-success-customization__grid">
                <span>Recipient: {personalization.recipientName}</span>
                <span>Family: {personalization.familyName}</span>
                <span>Lid title: {personalization.boxTitle}</span>
                <span>Photo: {personalization.photoCaption}</span>
                <span>Candle: {personalization.candleMessage}</span>
                <span>Jar: {personalization.jarLabel}</span>
                <span>Envelope: {personalization.envelopeLabel}</span>
                <span>Notebook: {personalization.notebookTitle}</span>
                <span>Dedication: {personalization.dedication}</span>
              </div>
            ) : null}
            <span>Voice note: {formatCustomizationFiles(customization.voiceNote)}</span>
            <span>Letters: {formatCustomizationFiles(customization.letters)}</span>
            <span>Family photos: {formatCustomizationFiles(customization.familyPhotos)}</span>
            {customization.note ? <p>{customization.note}</p> : null}
          </div>
        ) : null}
        <div className="jh-success-card__actions">
          <NavLink to="/shop" className="jh-button jh-button--ghost">
            Continue shopping
          </NavLink>
          <NavLink to="/" className="jh-button jh-button--solid">
            Return home
          </NavLink>
        </div>
      </div>
    </section>
  );
}

export default function JudhoorApp() {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedBoxDemo, setSelectedBoxDemo] = useState(null);
  const [currencyCode, setCurrencyCode] = useState(DEFAULT_CURRENCY);
  const [lastOrder, setLastOrder] = useState(null);
  const [cart, setCart] = useState(() =>
    Object.fromEntries(boxCatalog.map((box) => [box.slug, 0])),
  );

  useEffect(() => {
    document.body.classList.toggle("jh-no-scroll", showIntro);
    return () => {
      document.body.classList.remove("jh-no-scroll");
    };
  }, [showIntro]);

  useEffect(() => {
    const defaultFallback = assetPath("/judhoor-logo.png");

    function recoverBrokenImage(event) {
      const image = event.target;

      if (!(image instanceof HTMLImageElement) || image.dataset.fallbackApplied === "true") {
        return;
      }

      image.dataset.fallbackApplied = "true";
      image.src = image.dataset.fallbackSrc || defaultFallback;
    }

    document.addEventListener("error", recoverBrokenImage, true);

    return () => {
      document.removeEventListener("error", recoverBrokenImage, true);
    };
  }, []);

  const cartCount = Object.values(cart).reduce((sum, value) => sum + value, 0);

  function handleAddToCart(slug) {
    setCart((current) => ({
      ...current,
      [slug]: (current[slug] ?? 0) + 1,
    }));
  }

  function handleUpdateQuantity(slug, delta) {
    setCart((current) => ({
      ...current,
      [slug]: Math.max(0, (current[slug] ?? 0) + delta),
    }));
  }

  function handleSubmitDemoOrder(orderDetails) {
    setLastOrder(orderDetails);
    setCart(Object.fromEntries(boxCatalog.map((box) => [box.slug, 0])));
  }

  function replayIntro() {
    setShowIntro(false);
    const restartIntro = () => {
      setShowIntro(true);
    };

    if (typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(restartIntro);
      return;
    }

    window.setTimeout(restartIntro, 0);
  }

  return (
    <>
      <RouteScrollReset />
      {showIntro ? <IntroScreen onFinish={() => setShowIntro(false)} /> : null}
      <ItemPreviewModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      <BoxDemoModal
        box={selectedBoxDemo}
        currencyCode={currencyCode}
        onClose={() => setSelectedBoxDemo(null)}
        onAddToCart={handleAddToCart}
      />
      <Shell
        cartCount={cartCount}
        currencyCode={currencyCode}
        onCurrencyChange={setCurrencyCode}
        onReplayIntro={replayIntro}
      >
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                currencyCode={currencyCode}
                onAddToCart={handleAddToCart}
              />
            }
          />
          <Route
            path="/product-line"
            element={
              <ProductLinePage
                currencyCode={currencyCode}
                onCurrencyChange={setCurrencyCode}
                onAddToCart={handleAddToCart}
                onPreviewItem={setSelectedItem}
                onPreviewBoxDemo={setSelectedBoxDemo}
              />
            }
          />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route
            path="/demo-day"
            element={
              <DemoDayPage
                currencyCode={currencyCode}
                onAddToCart={handleAddToCart}
              />
            }
          />
          <Route path="/model-viewer" element={<BoxModelViewer />} />
          <Route
            path="/shop"
            element={
              <ShopPage
                cart={cart}
                currencyCode={currencyCode}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                currencyCode={currencyCode}
                onUpdateQuantity={handleUpdateQuantity}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cart={cart}
                currencyCode={currencyCode}
                onUpdateQuantity={handleUpdateQuantity}
                onSubmitDemoOrder={handleSubmitDemoOrder}
              />
            }
          />
          <Route
            path="/checkout/success"
            element={
              <CheckoutSuccessPage
                lastOrder={lastOrder}
                currencyCode={currencyCode}
              />
            }
          />
          <Route
            path="*"
            element={
              <HomePage
                currencyCode={currencyCode}
                onAddToCart={handleAddToCart}
              />
            }
          />
        </Routes>
      </Shell>
    </>
  );
}
