import { NavLink, Route, Routes } from "react-router-dom";
import {
  companyValues,
  contactDetails,
  conceptGallery,
  experienceSteps,
  featuredMetrics,
  heroHighlights,
  productBoxes,
} from "./siteData";

function AppShell({ children }) {
  return (
    <div className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="site-header">
        <NavLink className="brand" to="/">
          <span className="brand-mark">
            <img src="/judhoor-logo.png" alt="Judhoor logo" />
          </span>
          <span className="brand-copy">
            <strong>Judhoor</strong>
            <small>Rooted care for every generation</small>
          </span>
        </NavLink>
        <nav className="site-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/product-line">Product Line</NavLink>
          <NavLink to="/experience">Experience</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink className="nav-cta" to="/contact">
            Contact
          </NavLink>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div>
          <div className="footer-brand-row">
            <img src="/judhoor-logo.png" alt="Judhoor logo" className="footer-logo" />
            <p className="footer-brand">Judhoor</p>
          </div>
          <p>
            Thoughtfully designed activity boxes that support elderly wellbeing
            through memory, health, creativity, and connection.
          </p>
        </div>
        <div>
          <p className="footer-label">Built Around Care</p>
          <p>Elegant, warm, respectful, and culturally meaningful.</p>
        </div>
        <div>
          <p className="footer-label">Reach Us</p>
          <p>{contactDetails.email}</p>
          <p>{contactDetails.phone}</p>
        </div>
      </footer>
    </div>
  );
}

function SectionIntro({ eyebrow, title, description }) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Judhoor · جذور</p>
          <h1>Beautifully crafted care experiences for the elders who shaped us.</h1>
          <p className="hero-text">
            Judhoor creates premium activity boxes for adults aged 60+, designed
            to nurture memory, wellbeing, creativity, and family connection with
            dignity and warmth.
          </p>
          <div className="hero-actions">
            <NavLink className="button button-primary" to="/product-line">
              Explore the boxes
            </NavLink>
            <NavLink className="button button-secondary" to="/about">
              Discover the story
            </NavLink>
          </div>
          <div className="highlight-row">
            {heroHighlights.map((item) => (
              <article key={item.title} className="highlight-card">
                <p>{item.title}</p>
                <span>{item.description}</span>
              </article>
            ))}
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-product-frame">
            <img
              src="/mockups/past-box-hero-new.png"
              alt="Judhoor The Past Box mockup"
              className="hero-product"
            />
          </div>
          <div className="hero-orbit">
            <span>Memory</span>
            <span>Wellbeing</span>
            <span>Creativity</span>
            <span>Connection</span>
          </div>
          <div className="hero-logo-panel">
            <img src="/judhoor-logo.png" alt="Judhoor logo" className="hero-logo" />
          </div>
          <div className="hero-quote">
            <p>
              “Our elderly are the roots of our families, and they deserve to be
              nurtured, celebrated, and kept active.”
            </p>
          </div>
        </div>
      </section>

      <section className="metrics-strip">
        {featuredMetrics.map((metric) => (
          <article key={metric.value}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <section className="content-section">
        <SectionIntro
          eyebrow="Signature Range"
          title="A four-box system designed around real emotional and practical needs."
          description="Each box brings together tactile objects, guided moments, and culturally familiar details to create respectful experiences that families actually want to share."
        />
        <div className="box-grid">
          {productBoxes.map((box, index) => (
            <article
              key={box.slug}
              className="box-card"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <p className="box-kicker">{box.arabicName}</p>
              <h3>{box.name}</h3>
              <p>{box.summary}</p>
              <img
                src={box.images[0]}
                alt={`${box.name} mockup`}
                className="box-card-image"
              />
              <ul>
                {box.sampleItems.slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="story-band">
        <div>
          <p className="eyebrow">Why It Works</p>
          <h2>Not clinical. Not childish. Designed with grace.</h2>
        </div>
        <div className="story-copy">
          <p>
            Judhoor blends premium physical design with familiar rituals,
            nostalgia, family participation, and gentle prompts that help elders
            feel respected, seen, and involved.
          </p>
          <p>
            Drawer-style presentation, gold Arabic calligraphy, matte linen
            finishes, and warm monochromatic palettes make the product feel like
            a gift of honor rather than an intervention.
          </p>
        </div>
      </section>

      <section className="content-section">
        <SectionIntro
          eyebrow="Visual Showcase"
          title="Real product mockups now anchor the brand story."
          description="The site now uses your actual mockups to show the packaging language, item quality, and emotional tone behind Judhoor."
        />
        <div className="concept-grid">
          {conceptGallery.map((item) => (
            <article key={item.title} className="concept-card">
              <img src={item.image} alt={item.title} className="concept-image" />
              <div className="concept-copy">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function ProductLinePage() {
  return (
    <section className="page-stack">
      <SectionIntro
        eyebrow="Product Line"
        title="Every Judhoor box has a different emotional center."
        description="Together, the collection supports reflection, comfort, creativity, and belonging through objects that feel elevated, intimate, and culturally grounded."
      />
      <div className="product-layout">
        {productBoxes.map((box) => (
          <article key={box.slug} className="product-panel">
            <div className="product-head">
              <p className="eyebrow">{box.arabicName}</p>
              <h2>{box.name}</h2>
              <span>{box.tagline}</span>
            </div>
            <p className="product-summary">{box.summary}</p>
            <div className="product-meta">
              <div>
                <small>Purpose</small>
                <p>{box.purpose}</p>
              </div>
              <div>
                <small>Inside the box</small>
                <p>{box.itemCount} thoughtfully selected items</p>
              </div>
            </div>
            <div className="item-cloud">
              {box.sampleItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="product-gallery">
              {box.images.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`${box.name} visual ${index + 1}`}
                  className={`product-image ${index === 0 ? "product-image-main" : ""}`}
                />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ExperiencePage() {
  return (
    <section className="page-stack">
      <SectionIntro
        eyebrow="Experience"
        title="From unboxing to family interaction, every step is designed to feel gentle."
        description="Judhoor is built for homes, caregivers, and organizations that want to support elderly people without pressure."
      />
      <div className="timeline">
        {experienceSteps.map((step, index) => (
          <article key={step.title} className="timeline-card">
            <span>{`0${index + 1}`}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
      <div className="experience-banner">
        <div>
          <p className="eyebrow">Included In Every Box</p>
          <h2>Family Guide Card</h2>
          <p>
            Each experience includes guidance on safe use, kind encouragement,
            dementia-friendly interaction, and how to create meaningful sessions
            without turning it into a task.
          </p>
        </div>
        <div className="guide-points">
          <span>Use each item safely and kindly</span>
          <span>Encourage without pressure</span>
          <span>Support memory with familiarity</span>
          <span>Create shared moments across generations</span>
        </div>
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <section className="page-stack">
      <SectionIntro
        eyebrow="About Judhoor"
        title="A brand rooted in gratitude, heritage, and dignified design."
        description="The name Judhoor means roots in Arabic. It reflects a simple belief: the elders in our lives are foundational, and the care we offer them should feel intentional, beautiful, and full of respect."
      />
      <div className="about-layout">
        <article className="about-card about-card-large">
          <h3>Our position</h3>
          <p>
            We create premium culturally meaningful boxes for elderly wellbeing,
            avoiding both sterile healthcare aesthetics and childish activity-kit
            language.
          </p>
        </article>
        {companyValues.map((value) => (
          <article key={value.title} className="about-card">
            <p className="eyebrow">{value.title}</p>
            <p>{value.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactPage() {
  return (
    <section className="page-stack">
      <SectionIntro
        eyebrow="Contact"
        title="Let’s shape a graceful care experience around your community."
        description="Whether you’re preparing for launch, presenting to partners, or selling directly to families, this page gives you a polished place to continue the conversation."
      />
      <div className="contact-layout">
        <article className="contact-card">
          <h3>Start the conversation</h3>
          <p>{contactDetails.description}</p>
          <div className="contact-list">
            <span>{contactDetails.email}</span>
            <span>{contactDetails.phone}</span>
            <span>{contactDetails.location}</span>
          </div>
        </article>
        <form className="contact-form">
          <label>
            Name
            <input type="text" placeholder="Your name" />
          </label>
          <label>
            Email
            <input type="email" placeholder="your@email.com" />
          </label>
          <label>
            Organization
            <input type="text" placeholder="Family, clinic, school, or partner" />
          </label>
          <label>
            What are you looking for?
            <textarea
              rows="5"
              placeholder="Tell us whether you need a launch site, partnership deck, retail presence, or family-focused ordering flow."
            />
          </label>
          <button className="button button-primary" type="button">
            Send inquiry
          </button>
        </form>
      </div>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section className="page-stack not-found">
      <p className="eyebrow">404</p>
      <h1>The page you’re looking for has drifted off the path.</h1>
      <NavLink className="button button-primary" to="/">
        Return home
      </NavLink>
    </section>
  );
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product-line" element={<ProductLinePage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
