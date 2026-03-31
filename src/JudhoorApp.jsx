import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { boxCatalog, conceptMoments, journeySteps } from "./judhoorData";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

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
          <NavLink to="/shop" className="jh-cart-pill">
            Basket {cartCount}
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
              creativity, and connection.
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
            className="jh-item-preview"
            style={{
              backgroundImage: `url(${item.sprite})`,
              backgroundPosition: item.position,
            }}
          />
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

function HomePage({ onAddToCart }) {
  const featuredBoxes = boxCatalog.slice(0, 2);
  const calmPillars = [
    {
      kicker: "01",
      title: "Thoughtful, not overwhelming",
      description:
        "Every box is designed to feel calm at first glance, with just enough guidance to invite a gentle start.",
    },
    {
      kicker: "02",
      title: "Beautifully familiar",
      description:
        "Materials, colors, and objects are chosen to feel respectful, rooted, and easy to welcome into the home.",
    },
    {
      kicker: "03",
      title: "Made for shared moments",
      description:
        "The experience supports elders, families, and caregivers with rituals that feel warm rather than demanding.",
    },
  ];

  return (
    <>
      <section className="jh-hero">
        <div className="jh-hero__copy jh-animate jh-animate--up">
          <p className="jh-eyebrow">Judhoor | جذور</p>
          <h1>Beautiful care experiences designed to feel calm, warm, and dignified.</h1>
          <p className="jh-hero__text">
            Judhoor creates premium activity boxes for elders that support memory,
            wellbeing, creativity, and connection through tactile objects and
            culturally meaningful rituals.
          </p>
          <div className="jh-hero__actions">
            <NavLink to="/product-line" className="jh-button jh-button--ghost">
              Explore collection
            </NavLink>
            <NavLink to="/shop" className="jh-button jh-button--solid">
              View boxes
            </NavLink>
          </div>
          <p className="jh-hero__note">
            Designed for families, caregivers, and communities who want support
            that feels honoring from the very first moment.
          </p>
        </div>
        <div className="jh-hero__visual jh-animate jh-animate--float">
          <div className="jh-hero__visual-shell">
            <img
              src={assetPath("/mockups/past-box-hero.png")}
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
          <h2>Less like a task. More like a gift of care.</h2>
          <p>
            Judhoor is designed to reduce pressure, soften the visual experience,
            and make it easy for families to begin with warmth and confidence.
          </p>
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
          <h2>A quieter first look at the collection.</h2>
          <p>
            Start with two signature experiences, then explore the full range
            when you are ready.
          </p>
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
                  Add to demo basket
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
          <h2>Not clinical. Not childish. Quietly elegant.</h2>
          <p>
            Linen textures, Arabic calligraphy, warm monochromatic palettes,
            botanical linework, and culturally familiar objects turn the product
            into something emotionally elegant.
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

function ProductLinePage({ onAddToCart, onPreviewItem }) {
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
                <button
                  type="button"
                  className="jh-button jh-button--solid"
                  onClick={() => onAddToCart(box.slug)}
                >
                  Add to demo basket
                </button>
              </div>
            </div>
            <div className="jh-gallery">
              {box.images.map((image, index) => (
                <figure
                  key={image}
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
      image: assetPath("/mockups/important-box-hero.png"),
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
      image: assetPath("/mockups/creative-box-items.png"),
      alt: "Judhoor creative and calming activity set",
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

function ShopPage({ cart, onAddToCart, onUpdateQuantity, subtotal }) {
  const filledCart = boxCatalog.filter((box) => cart[box.slug] > 0);

  return (
    <section className="jh-page jh-animate jh-animate--up">
      <div className="jh-section__head">
        <p className="jh-eyebrow">Demo Purchase Flow</p>
        <h1>A polished sample checkout experience for the Judhoor boxes.</h1>
        <p>
          This is a demo storefront layout showing how families or partners
          could review boxes, adjust quantities, and request a guided order.
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
                <div className="jh-shop-card__row">
                  <strong>AED {box.price}</strong>
                  <button
                    type="button"
                    className="jh-button jh-button--small"
                    onClick={() => onAddToCart(box.slug)}
                  >
                    Add box
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="jh-checkout">
          <h2>Your demo basket</h2>
          {filledCart.length === 0 ? (
            <p className="jh-checkout__empty">
              Add a box to preview the purchase experience.
            </p>
          ) : (
            <div className="jh-checkout__items">
              {filledCart.map((box) => (
                <div key={box.slug} className="jh-checkout__item">
                  <div>
                    <strong>{box.name}</strong>
                    <span>AED {box.price}</span>
                  </div>
                  <div className="jh-counter">
                    <button type="button" onClick={() => onUpdateQuantity(box.slug, -1)}>
                      -
                    </button>
                    <span>{cart[box.slug]}</span>
                    <button type="button" onClick={() => onUpdateQuantity(box.slug, 1)}>
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="jh-checkout__summary">
            <div>
              <span>Subtotal</span>
              <strong>AED {subtotal}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>Demo</strong>
            </div>
          </div>
          <form className="jh-form">
            <label>
              Name
              <input type="text" placeholder="Family or organization name" />
            </label>
            <label>
              Email
              <input type="email" placeholder="hello@example.com" />
            </label>
            <label>
              Notes
              <textarea
                rows="4"
                placeholder="Tell us whether this order is for home use, gifting, clinics, or partnerships."
              />
            </label>
            <button type="button" className="jh-button jh-button--solid jh-button--full">
              Submit demo order
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
}

export default function JudhoorApp() {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
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
  const subtotal = Object.entries(cart).reduce((sum, [slug, quantity]) => {
    const box = boxCatalog.find((entry) => entry.slug === slug);
    return sum + (box ? box.price * quantity : 0);
  }, 0);

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
      <Shell cartCount={cartCount} onReplayIntro={replayIntro}>
        <Routes>
          <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />} />
          <Route
            path="/product-line"
            element={
              <ProductLinePage
                onAddToCart={handleAddToCart}
                onPreviewItem={setSelectedItem}
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
                subtotal={subtotal}
              />
            }
          />
          <Route path="*" element={<HomePage onAddToCart={handleAddToCart} />} />
        </Routes>
      </Shell>
    </>
  );
}
