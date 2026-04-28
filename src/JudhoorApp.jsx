import { useEffect, useRef, useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { boxCatalog, conceptMoments, journeySteps } from "./judhoorData";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const formatPrice = (amount) => `AED ${amount}`;
const getItemCount = (box) => box.itemCount ?? box.items?.length ?? 0;

function getCartLines(cart) {
  return boxCatalog
    .filter((box) => cart[box.slug] > 0)
    .map((box) => ({
      ...box,
      quantity: cart[box.slug],
      total: box.price * cart[box.slug],
    }));
}

function CartSummary({ subtotal, shipping, total, compact = false }) {
  return (
    <div className={`jh-order-summary ${compact ? "jh-order-summary--compact" : ""}`}>
      <div>
        <span>Subtotal</span>
        <strong>{formatPrice(subtotal)}</strong>
      </div>
      <div>
        <span>Shipping</span>
        <strong>{shipping === 0 ? "Free demo" : formatPrice(shipping)}</strong>
      </div>
      <div className="jh-order-summary__total">
        <span>Total</span>
        <strong>{formatPrice(total)}</strong>
      </div>
    </div>
  );
}

function QuantityControl({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="jh-counter">
      <button type="button" onClick={onDecrease} aria-label="Decrease quantity">
        -
      </button>
      <span>{quantity}</span>
      <button type="button" onClick={onIncrease} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}

function IntroScreen({ onFinish }) {
  useEffect(() => {
    const timer = window.setTimeout(onFinish, 4300);
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

  function handleChange(event) {
    const combo = document.querySelector("#jh-translate .goog-te-combo");
    if (!combo) {
      return;
    }

    combo.value = event.target.value;
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
      <select className="jh-language-select" defaultValue="" onChange={handleChange}>
        {languages.map((language) => (
          <option key={language.code || "original"} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
      <div id="jh-translate" />
    </div>
  );
}

function Shell({ cartCount, children, onReplayIntro }) {
  return (
    <div className="jh-app">
      <div className="jh-bg jh-bg--one" />
      <div className="jh-bg jh-bg--two" />
      <header className="jh-header">
        <NavLink to="/" className="jh-brand">
          <img src={assetPath("/judhoor-logo.png")} alt="Judhoor logo" />
          <div>
            <strong>Judhoor</strong>
            <span>Premium care boxes for cherished elders</span>
          </div>
        </NavLink>
        <nav className="jh-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/product-line">Product Line</NavLink>
          <NavLink to="/experience">Experience</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <button type="button" className="jh-replay" onClick={onReplayIntro}>
            Replay intro
          </button>
          <NavLink to="/cart" className="jh-cart-pill">
            Cart {cartCount}
          </NavLink>
        </nav>
      </header>
      <main className="jh-main">{children}</main>
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
        <TranslateWidget />
        <div className="jh-footer__meta">
          <span>Demo contact</span>
          <p>hello@judhoor.com</p>
          <p>+971 50 000 0000</p>
        </div>
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

  const usesFullImagePreview = item.previewSize === "contain";

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
          <div
            className={`jh-item-preview ${usesFullImagePreview ? "jh-item-preview--image" : ""}`}
            style={
              usesFullImagePreview
                ? undefined
                : {
                    backgroundImage: `url(${item.sprite})`,
                    backgroundPosition: item.previewPosition ?? item.position,
                    backgroundSize: item.previewSize ?? "300% 300%",
                  }
            }
          >
            {usesFullImagePreview ? <img src={item.sprite} alt={item.name} /> : null}
          </div>
          <div className="jh-modal__copy">
            <p className="jh-eyebrow">Product Detail</p>
            <h2>{item.name}</h2>
            <p>{item.note}</p>
            <span className="jh-modal__hint">
              Previewed directly from the Judhoor branded mockup set.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BoxDemoModal({ box, onClose, onAddToCart }) {
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
  const [heroImage, sideImage, detailImage] = gallery;
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
              className={`jh-demo-stage__scene ${isOpen ? "jh-demo-stage__scene--open" : ""}`}
              style={{
                transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              }}
            >
              <span className="jh-demo-stage__glow" />
              <div
                className={`jh-demo-box jh-demo-box--${box.theme} ${isOpen ? "jh-demo-box--open" : ""}`}
              >
                <div className="jh-demo-box__shadow" />
                <div className="jh-demo-box__base" />
                <div
                  className="jh-demo-box__panel jh-demo-box__panel--lid"
                  style={{ backgroundImage: `url(${heroImage})` }}
                />
                <div
                  className="jh-demo-box__panel jh-demo-box__panel--inner"
                  style={{ backgroundImage: `url(${sideImage || heroImage})` }}
                />
                <div
                  className="jh-demo-box__card jh-demo-box__card--primary"
                  style={{ backgroundImage: `url(${detailImage || sideImage || heroImage})` }}
                />
                <div
                  className="jh-demo-box__card jh-demo-box__card--secondary"
                  style={{ backgroundImage: `url(${heroImage})` }}
                />
              </div>
            </div>
            <p className="jh-demo-stage__hint">
              Drag to rotate. Use the buttons to open or reset.
            </p>
          </div>
          <div className="jh-demo-copy">
            <p className="jh-eyebrow">Interactive Demo</p>
            <h2>{box.name}</h2>
            <span>{box.tagline}</span>
            <p>{box.summary}</p>
            <div className="jh-demo-copy__meta">
              <strong>{formatPrice(box.price)}</strong>
              <span>{getItemCount(box)} curated items</span>
            </div>
            <div className="jh-chip-cloud">
              {box.items.map((item) => (
                <span key={item.name} className="jh-chip-button jh-chip-button--static">
                  {item.name}
                </span>
              ))}
            </div>
            <div className="jh-showcase-card__cta">
              <button
                type="button"
                className="jh-button jh-button--ghost"
                onClick={() => setIsOpen((current) => !current)}
              >
                {isOpen ? "Close box" : "Open box"}
              </button>
              <button
                type="button"
                className="jh-button jh-button--ghost"
                onClick={fullyResetDemo}
              >
                Reset view
              </button>
              <button
                type="button"
                className="jh-button jh-button--solid"
                onClick={() => onAddToCart(box.slug)}
              >
                Add to cart
              </button>
            </div>
            <span className="jh-modal__hint">Draggable demo view with layered motion. No WebGL required.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage({ onAddToCart }) {
  const featuredBoxes = boxCatalog.slice(0, 2);
  const calmPillars = [
    {
      kicker: "01",
      title: "Gentle to begin",
      description:
        "A calm first impression with just enough guidance to get started.",
    },
    {
      kicker: "02",
      title: "Beautifully familiar",
      description:
        "Objects, colors, and materials chosen to feel rooted and respectful.",
    },
    {
      kicker: "03",
      title: "Made to share",
      description:
        "Supports elders, families, and caregivers without pressure.",
    },
  ];

  return (
    <>
      <section className="jh-hero">
        <div className="jh-hero__copy jh-animate jh-animate--up">
          <p className="jh-eyebrow">Judhoor | جذور</p>
          <h1>Calm, dignified care in a beautifully made box.</h1>
          <p className="jh-hero__text">
            Premium activity boxes for elders, designed around memory,
            wellbeing, discovery, and connection.
          </p>
          <div className="jh-hero__actions">
            <NavLink to="/shop" className="jh-button jh-button--solid">
              View boxes
            </NavLink>
            <NavLink to="/product-line" className="jh-hero__text-link">
              Explore the full collection
            </NavLink>
          </div>
          <p className="jh-hero__note">
            Designed to feel honoring from the very first moment.
          </p>
        </div>
        <div className="jh-hero__visual jh-animate jh-animate--float">
          <div className="jh-hero__visual-shell">
            <img
              src={assetPath("/mockups/past-box-hero-new.png")}
              alt="Judhoor box presentation"
              className="jh-hero__image"
            />
          </div>
          <div className="jh-hero__frame-tag">The Past Box | Memory & Reflection</div>
        </div>
      </section>

      <section className="jh-home-promise jh-animate jh-animate--fade">
        <div className="jh-section__head">
          <p className="jh-eyebrow">Why It Feels Different</p>
          <h2>Less like a task. More like a quiet gift of care.</h2>
          <p>A softer, more welcoming way to support shared moments.</p>
        </div>
        <div className="jh-pillars__grid">
          {calmPillars.map((item) => (
            <article key={item.title} className="jh-mini-card">
              <span>{item.kicker}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="jh-section jh-animate jh-animate--up">
        <div className="jh-section__head">
          <p className="jh-eyebrow">Featured Boxes</p>
          <h2>A simple first look at the collection.</h2>
          <p>Start here, then explore the full range when you are ready.</p>
        </div>
        <div className="jh-product-grid jh-product-grid--featured">
          {featuredBoxes.map((box) => (
            <article key={box.slug} className={`jh-product-card jh-product-card--${box.theme}`}>
              <div className="jh-product-card__top">
                <p className="jh-product-card__arabic">{box.arabicName}</p>
                <h3>{box.name}</h3>
                <span>{box.tagline}</span>
              </div>
              <div className="jh-product-card__media">
                <img src={box.images[0]} alt={`${box.name} mockup`} />
              </div>
              <p className="jh-product-card__summary">{box.summary}</p>
              <div className="jh-product-card__footer">
                <strong>AED {box.price}</strong>
                <button
                  type="button"
                  className="jh-button jh-button--small"
                  onClick={() => onAddToCart(box.slug)}
                >
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="jh-home-section-link">
          <NavLink to="/product-line" className="jh-button jh-button--ghost">
            See all boxes
          </NavLink>
        </div>
      </section>

      <section className="jh-home-story jh-animate jh-animate--up">
        <div className="jh-home-story__copy">
          <p className="jh-eyebrow">Atmosphere</p>
          <h2>Quietly elegant by design.</h2>
          <p>
            Warm palettes, tactile materials, and culturally familiar details make
            the experience feel respectful, elevated, and easy on the eye.
          </p>
        </div>
        <article className="jh-scene-card jh-home-story__card">
          <figure>
            <img src={conceptMoments[0].image} alt={conceptMoments[0].title} />
          </figure>
          <div>
            <h3>{conceptMoments[0].title}</h3>
            <p>{conceptMoments[0].description}</p>
          </div>
        </article>
      </section>
    </>
  );
}

function ProductLinePage({ onAddToCart, onPreviewItem, onPreviewBoxDemo }) {
  return (
    <section className="jh-page jh-animate jh-animate--up">
      <div className="jh-section__head">
        <p className="jh-eyebrow">Product Line</p>
        <h1>Every Judhoor box has its own ritual, rhythm, and emotional purpose.</h1>
      </div>
      <div className="jh-product-showcase">
        {boxCatalog.map((box) => (
          <article key={box.slug} className="jh-showcase-card">
            <div className="jh-showcase-card__copy">
              <p className="jh-eyebrow">{box.arabicName}</p>
              <h2>{box.name}</h2>
              <span>{box.tagline}</span>
              <p>{box.summary}</p>
              <div className="jh-chip-cloud">
                {box.items.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className="jh-chip-button"
                    onClick={() => onPreviewItem(item)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="jh-showcase-card__cta">
                <strong>AED {box.price}</strong>
                <div className="jh-showcase-card__actions">
                  <button
                    type="button"
                    className="jh-button jh-button--ghost"
                    onClick={() => onPreviewBoxDemo(box)}
                  >
                    3D demo
                  </button>
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
            <div className="jh-gallery">
              {box.images.map((image, index) => (
                <figure
                  key={`${image}-${index}`}
                  className={index === 0 ? "jh-gallery__item jh-gallery__item--hero" : "jh-gallery__item"}
                >
                  <img src={image} alt={`${box.name} preview ${index + 1}`} />
                </figure>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ExperiencePage() {
  const storyPanels = [
    {
      title: "Unboxing should feel ceremonial, not clinical.",
      text:
        "The first impression matters. Judhoor boxes are designed to arrive like meaningful gifts, with premium presentation, warm materials, and an immediate sense of care.",
      image: assetPath("/mockups/important-box-hero-new.png"),
      alt: "Judhoor ceremonial unboxing presentation",
    },
    {
      title: "Objects are chosen to invite memory, touch, and conversation.",
      text:
        "Instead of abstract exercises, each item is rooted in familiarity: music, scent, handwriting, keepsakes, prayer, tea, letters, and textures that encourage emotional comfort.",
      image: assetPath("/mockups/past-box-items.png"),
      alt: "Judhoor memory and storytelling objects",
    },
    {
      title: "The experience moves between calm activity and shared presence.",
      text:
        "Some moments are reflective and solitary. Others are designed for family participation. Together they create a rhythm that feels supportive rather than demanding.",
      image: assetPath("/mockups/important-box-items.png"),
      alt: "Judhoor connection and family interaction set",
    },
    {
      title: "Every box becomes a repeatable ritual of care.",
      text:
        "The goal is not a one-time unboxing. Judhoor is designed to be revisited across days and weeks, turning beautifully made objects into ongoing moments of connection.",
      image: assetPath("/mockups/balance-box-items.png"),
      alt: "Judhoor wellbeing and routine objects",
    },
  ];

  return (
    <section className="jh-page jh-animate jh-animate--up">
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
              <img src={panel.image} alt={panel.alt} />
            </figure>
            <div className="jh-story-panel__copy">
              <p className="jh-eyebrow">{`Chapter 0${index + 1}`}</p>
              <h2>{panel.title}</h2>
              <p>{panel.text}</p>
            </div>
          </article>
        ))}
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

function ShopPage({ cart, onAddToCart, onUpdateQuantity }) {
  const cartLines = getCartLines(cart);
  const subtotal = cartLines.reduce((sum, item) => sum + item.total, 0);

  return (
    <section className="jh-page jh-animate jh-animate--up">
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
                <img src={box.images[0]} alt={box.name} />
              </figure>
              <div className="jh-shop-card__body">
                <p className="jh-eyebrow">{box.arabicName}</p>
                <h3>{box.name}</h3>
                <p>{box.summary}</p>
                <div className="jh-shop-card__badges">
                  <span>{box.tagline}</span>
                  <span>{getItemCount(box)} curated items</span>
                </div>
                <div className="jh-shop-card__row">
                  <strong>{formatPrice(box.price)}</strong>
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
                <div key={box.slug} className="jh-checkout__item">
                  <div>
                    <strong>{box.name}</strong>
                    <span>{box.quantity} x {formatPrice(box.price)}</span>
                  </div>
                  <QuantityControl
                    quantity={box.quantity}
                    onDecrease={() => onUpdateQuantity(box.slug, -1)}
                    onIncrease={() => onUpdateQuantity(box.slug, 1)}
                  />
                </div>
              ))}
            </div>
          )}
          <CartSummary subtotal={subtotal} shipping={0} total={subtotal} compact />
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

function CartPage({ cart, onUpdateQuantity }) {
  const cartLines = getCartLines(cart);
  const subtotal = cartLines.reduce((sum, item) => sum + item.total, 0);

  return (
    <section className="jh-page jh-animate jh-animate--up">
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
                  <img src={item.images[0]} alt={item.name} />
                </figure>
                <div className="jh-cart-item__copy">
                  <p className="jh-eyebrow">{item.arabicName}</p>
                  <h2>{item.name}</h2>
                  <p>{item.summary}</p>
                  <div className="jh-cart-item__meta">
                    <span>{item.tagline}</span>
                    <span>{getItemCount(item)} curated items</span>
                  </div>
                </div>
                <div className="jh-cart-item__controls">
                  <strong>{formatPrice(item.price)}</strong>
                  <QuantityControl
                    quantity={item.quantity}
                    onDecrease={() => onUpdateQuantity(item.slug, -1)}
                    onIncrease={() => onUpdateQuantity(item.slug, 1)}
                  />
                  <span className="jh-cart-item__line-total">{formatPrice(item.total)}</span>
                </div>
              </article>
            ))}
          </div>

          <aside className="jh-cart-sidebar">
            <div className="jh-checkout">
              <h2>Order summary</h2>
              <CartSummary subtotal={subtotal} shipping={0} total={subtotal} />
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

function CheckoutPage({ cart, onSubmitDemoOrder }) {
  const navigate = useNavigate();
  const cartLines = getCartLines(cart);
  const subtotal = cartLines.reduce((sum, item) => sum + item.total, 0);
  const shipping = cartLines.length > 0 ? 35 : 0;
  const total = subtotal + shipping;

  function handleSubmit(event) {
    event.preventDefault();

    if (cartLines.length === 0) {
      navigate("/shop");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const orderDetails = {
      customerName: formData.get("customerName"),
      email: formData.get("email"),
      city: formData.get("city"),
      total,
      itemCount: cartLines.reduce((sum, item) => sum + item.quantity, 0),
    };

    onSubmitDemoOrder(orderDetails);
    navigate("/checkout/success");
  }

  if (cartLines.length === 0) {
    return (
      <section className="jh-page jh-animate jh-animate--up">
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
    <section className="jh-page jh-animate jh-animate--up">
      <div className="jh-section__head">
        <p className="jh-eyebrow">Checkout Demo</p>
        <h1>A complete demo checkout experience with delivery and card details.</h1>
        <p>
          This page is for presentation only. No payment is processed, but the flow is
          designed to feel like a real purchase journey.
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

          <section className="jh-payment-card">
            <div className="jh-payment-card__head">
              <p className="jh-eyebrow">Payment</p>
              <h2>Card details</h2>
            </div>
            <div className="jh-demo-card">
              <span>Demo Visa</span>
              <strong>4242 4242 4242 4242</strong>
              <small>No real transaction will be made</small>
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
          <div className="jh-checkout">
            <h2>Your order</h2>
            <div className="jh-checkout__items">
              {cartLines.map((item) => (
                <div key={item.slug} className="jh-checkout__item">
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.quantity} x {formatPrice(item.price)}</span>
                  </div>
                  <strong>{formatPrice(item.total)}</strong>
                </div>
              ))}
            </div>
            <CartSummary subtotal={subtotal} shipping={shipping} total={total} />
            <p className="jh-demo-disclaimer">
              Demo only. Card fields are for presentation and do not charge the customer.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function CheckoutSuccessPage({ lastOrder }) {
  if (!lastOrder) {
    return (
      <section className="jh-page jh-animate jh-animate--up">
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

  return (
    <section className="jh-page jh-animate jh-animate--up">
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
          <span>{formatPrice(lastOrder.total)}</span>
        </div>
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

  const cartCount = Object.values(cart).reduce((sum, value) => sum + value, 0);

  function handleAddToCart(slug) {
    setCart((current) => ({
      ...current,
      [slug]: current[slug] + 1,
    }));
  }

  function handleUpdateQuantity(slug, delta) {
    setCart((current) => ({
      ...current,
      [slug]: Math.max(0, current[slug] + delta),
    }));
  }

  function handleSubmitDemoOrder(orderDetails) {
    setLastOrder(orderDetails);
    setCart(Object.fromEntries(boxCatalog.map((box) => [box.slug, 0])));
  }

  function replayIntro() {
    setShowIntro(false);
    window.requestAnimationFrame(() => {
      setShowIntro(true);
    });
  }

  return (
    <>
      {showIntro ? <IntroScreen onFinish={() => setShowIntro(false)} /> : null}
      <ItemPreviewModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      <BoxDemoModal
        box={selectedBoxDemo}
        onClose={() => setSelectedBoxDemo(null)}
        onAddToCart={handleAddToCart}
      />
      <Shell cartCount={cartCount} onReplayIntro={replayIntro}>
        <Routes>
          <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />} />
          <Route
            path="/product-line"
            element={
              <ProductLinePage
                onAddToCart={handleAddToCart}
                onPreviewItem={setSelectedItem}
                onPreviewBoxDemo={setSelectedBoxDemo}
              />
            }
          />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route
            path="/shop"
            element={
              <ShopPage
                cart={cart}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
              />
            }
          />
          <Route
            path="/cart"
            element={<CartPage cart={cart} onUpdateQuantity={handleUpdateQuantity} />}
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cart={cart}
                onSubmitDemoOrder={handleSubmitDemoOrder}
              />
            }
          />
          <Route
            path="/checkout/success"
            element={<CheckoutSuccessPage lastOrder={lastOrder} />}
          />
          <Route path="*" element={<HomePage onAddToCart={handleAddToCart} />} />
        </Routes>
      </Shell>
    </>
  );
}
