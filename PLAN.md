# MinJee Hahm Website Redesign — Plan

---

## 1. Research Summary

### Current Role & Title
- **Product Designer at Meta** (2020 — Present)
- Designing product experiences across Meta's family of apps (Instagram, Facebook, WhatsApp), reaching billions of users worldwide
- Location: Bay Area, California
- Exact team/products cannot be confirmed publicly — likely under NDA. The site will reference "Meta's family of apps" without fabricating specifics.

### Career Timeline

| Years | Company | Role | Scope |
|-------|---------|------|-------|
| 2020–Present | **Meta** | Product Designer | Product experiences across Meta's family of apps at global scale |
| 2018–2020 | **Grab** | Product Designer | Southeast Asia's leading superapp — ride-hailing, food delivery, payments across 8 countries |
| 2015–2018 | **Cashtree** | Head of Design | Full rebrand of Indonesia's leading reward/advertising app. Built design team, gamification strategy, style guides |
| 2014–2015 | **SK Planet (VOLO)** | Lead UI/UX Designer | Travel journal/sharing service. End-to-end UX, interactive prototypes, iOS + web |
| 2012–2014 | **NAVER Corp (BAND)** | UI/UX Designer | Core UX designer for top-grossing mobile community platform. Shipped iOS, Android, Web |
| 2011–2012 | **NAVER Corp (Me2day)** | UI/UX Designer | Korea's first social network. Branding renewal, UX specification |
| 2010–2011 | **Grafolio** | UI Designer | Creative community platform. UI, motion graphics, sound design |

### Online Presence (Verified Links)
- **Website**: [minjeehahm.com](https://minjeehahm.com)
- **LinkedIn**: [linkedin.com/in/minjeehahm](https://www.linkedin.com/in/minjeehahm)
- **Behance**: [behance.net/VeronicaHaha](https://www.behance.net/VeronicaHaha) — 2,517 followers, 6,525 appreciations, ~85K views
- **Email**: minjeehahm@gmail.com (from current site)
- **Dribbble**: Not found — omit from redesign unless provided

### Design Philosophy
Derived from career arc and current site copy:
- "Making complex products feel effortless" — her stated tagline
- "The best design disappears into the experience" — from About section
- Experiential, user-centered. Driven by the belief that products should feel natural and intuitive regardless of cultural context.
- Career arc demonstrates a focus on **cross-cultural product design at scale** — Korea → Indonesia → Singapore → Bay Area.

### Key Facts That Inform Copy
- **14+ years** of professional design experience
- Worked across **4 countries** (South Korea, Indonesia, Singapore, United States)
- Products she's designed have reached **billions of users** (Meta) and **millions of daily users** (Grab, BAND)
- She has both **IC and leadership** experience (Head of Design at Cashtree, building/coaching teams)
- Multi-disciplinary roots: UI, UX, motion graphics, sound design, branding, frontend development
- Bilingual: Korean + English

### Skills — What's Current vs. Outdated
The old site (pre-redesign) listed: Sketch, Invision, Framer, Cinema 4D, Logic Pro X, Studio One 3

**Current (keep/highlight):**
- Product Design, Design Systems, UX Strategy, Prototyping, User Research
- Motion Design, Visual Design, Design Leadership, Brand & Art Direction
- Frontend Development (HTML/CSS/JS — she literally built this site)

**Outdated (remove):**
- Sketch → replaced by Figma at Meta
- Invision → deprecated industry-wide
- Cinema 4D, Logic Pro X, Studio One 3 → not relevant to current Product Design role
- Do NOT list specific tools — list disciplines instead. Tool logos feel junior.

---

## 2. Current Site Audit

### What Already Exists (Current index.html — Already Partially Redesigned)
The current `index.html` in the repo has already been partially modernized from the original 2015 site. It includes:
- Clean semantic HTML5 with ARIA labels
- Fixed sticky nav with hamburger mobile menu
- Hero with "MinJee Hahm" name, "Product Designer at Meta" subtitle
- Work section with 5 project entries (Meta, Grab, Cashtree, BAND, VOLO) as a stacked list
- About section with first-person bio paragraphs + skills list
- Contact section with email, LinkedIn, Behance links
- Footer with credit line
- `css/style.css` with CSS custom properties design system ("Quiet Precision" direction)
- `js/main.js` with IntersectionObserver fade-ins, sticky nav, mobile toggle

### Content Gaps — What's Missing vs. the New Brief
1. **No editorial project cards** — current design uses a text-only stacked list, not the magazine-style image cards from amylalai.com
2. **No company credential badges** — Meta, Grab, NAVER are just text; needs visual badge/logo treatment like michellegore.com
3. **No hero role animation** — no cycling text like michellegore.com's "PRODUCT DESIGNER / VISUAL & UX DESIGNER"
4. **No project images/mockups** — existing work items are entirely text-based; no thumbnails, no device mockups
5. **Still has Keats quote** — `"Nothing ever becomes real till it is experienced."` persists in the About section
6. **No "View Work ↓" CTA** in hero — hero ends abruptly with no scroll prompt
7. **No company logo row** in About section — no visual credibility markers (Meta, Grab, NAVER, SK Planet logos)
8. **No "Download Resume" link** anywhere
9. **Footer is minimal** — no 3-column structure (Navigation / Let's Chat / Find Me) inspired by amylalai.com
10. **No Grafolio or Me2day** in work section — earlier career projects missing
11. **Missing Dribbble link** — only Email, LinkedIn, Behance currently present

### Design Gaps vs. Reference Sites
1. **Typography lacks editorial punch** — Instrument Serif + DM Sans is solid, but headings need to be larger and more confident (amylalai.com uses massive display type)
2. **No visual richness** — the page is all text; needs project imagery, device mockups, or at minimum colored card backgrounds
3. **No hover interactivity on cards** — current hover is just a background color change; needs image scale effects (transform: scale(1.02))
4. **Color palette is subdued** — warm terracotta accent works, but the page needs more visual energy through card backgrounds or accent usage
5. **No alternating card layouts** — all work items are identical in size; needs wide + two-column variation

### Files in the Repository
```
/index.html                    — Main page (to be redesigned)
/css/style.css                 — Custom stylesheet (to be rewritten)
/css/main.css                  — Legacy CSS (unused by current index.html)
/css/animate.css               — Legacy animation CSS
/css/normalize.css             — Legacy normalize
/css/reset.css                 — Legacy reset
/css/screen.min.*.css          — Legacy minified CSS
/js/main.js                    — Current vanilla JS (to be updated)
/dist/wow.js, wow.min.js       — Legacy WOW.js animation library (unused)
/dist/html5shiv.js             — Legacy IE polyfill (unused)
/fonts/codropsicons/           — Legacy icon font
/fonts/feathericons/           — Legacy icon font
/img/                          — Project images and icons (preserve all)
  - cashtree.png, grafolio.jpg, ico_band.png, ico_volo.png, etc.
  - minjeehahm_background.png, minjeehahm_bg.png
  - Various social/skill icons (ico_fb.png, ico_linkedin.png, etc.)
/CNAME                         — minjeehahm.com domain config
/404.html                      — Error page
/favicon.ico                   — Favicon
```

---

## 3. Design Direction

### Reference Site Synthesis

#### From amylalai.com — Patterns to Adopt
- **Hero**: Large, confident first-person statement in display type. Personal, specific, memorable.
- **Project Cards**: Full-bleed magazine-style cards with layered device mockups. Project title below in light sans-serif. Category tags in all-caps small text (e.g., "PRODUCT DESIGN, PROTOTYPING").
- **Card Layout**: Rounded corners (16px border-radius), subtle shadow (box-shadow), clean white card backgrounds.
- **Footer**: Column-based structure — NAVIGATION, LET'S CHAT, SOCIALS — no clutter.
- **Typography**: Large confident headings; small all-caps labels for categories/metadata. Multiple weights for hierarchy.
- **Background**: Warm off-white (#fffefc). Restrained palette with brown/tan text tones.
- **Overall**: Editorial, modern, confident, minimal chrome. Content breathes.

#### From michellegore.com — Patterns to Adopt
- **Hero Animation**: Text cycling through role variations (PRODUCT DESIGNER / VISUAL & UX DESIGNER) with a strong name lockup.
- **Company Badges**: Branded SVG tags for each employer (Apple tag, Airbnb tag) — makes brand names visually present, not just text.
- **Case Study Cards**: Role title in all-caps → one-line description → longer design contribution sentence → "VIEW PROJECT ➞" CTA.
- **Hover Effects**: Image scales to 1.15 on hover with purple overlay (we'll adapt colors). 0.2s transition.
- **Video/Motion**: Background video loops for thumbnails — conveys motion design skills wordlessly.
- **Footer CTA**: Warm, human closing ("Thanks for stopping by, let's chat!") with email and LinkedIn.
- **Overall**: Premium, motion-fluent, big-company credibility signaling. Dark sections for contrast.

#### Synthesized Direction for MinJee
Combine both references:
- Amy's editorial card layout, warm off-white palette, and column footer structure
- Michelle's role-cycling hero animation and company-badge credibility signaling
- Remove the Keats quote; replace with direct, first-person personal statement
- Surface Meta, Grab, NAVER as credential badges immediately visible below the hero
- Use project image cards with device mockups (using existing `/img/` assets where available)
- Add subtle scroll-triggered fade-in animations for project cards
- Project grid with alternating layouts (wide card / two-column split)

### Typography Choices

**Display/Headlines**: `Instrument Serif` (already loaded) — warm, elegant editorial serif. Used for hero name, section headings, and the closing CTA.

**Body/UI**: `DM Sans` (already loaded) — clean geometric sans-serif with personality. Multiple weights for hierarchy.

**Monospace accent**: `JetBrains Mono` (already loaded) — for tags, metadata labels, dates. Technical credibility.

**Type Scale** (updated for more editorial punch):
```
--text-hero:  clamp(3.5rem, 9vw, 7rem)     /* Hero name — bigger */
--text-5xl:   3.75rem                        /* Section headings */
--text-4xl:   3rem                           /* Project names (desktop) */
--text-3xl:   2.25rem                        /* Project names (tablet) */
--text-2xl:   1.875rem                       /* Sub-headings, About quote */
--text-xl:    1.5rem                         /* Hero subtitle */
--text-lg:    1.25rem                        /* Contact links */
--text-md:    1.125rem                       /* Body emphasis */
--text-base:  1rem                           /* Body text */
--text-sm:    0.875rem                       /* Nav links, tags */
--text-xs:    0.75rem                        /* Monospace labels */
```

### Color Palette
Retain the existing warm "Quiet Precision" palette — it already aligns with amylalai.com's warm off-white direction:

```css
:root {
  --color-bg:          #faf8f5;    /* warm off-white, paper-like */
  --color-text:        #1a1a1a;    /* near black */
  --color-text-light:  #4a4a4a;    /* secondary text */
  --color-muted:       #b8a99a;    /* muted clay for labels */
  --color-accent:      #c45d3e;    /* warm terracotta */
  --color-accent-hover:#a8492e;    /* darker accent on hover */
  --color-accent-soft: #f0e6e0;    /* accent tint for card hovers */
  --color-border:      #e8e4df;    /* subtle dividers */
  --color-deep:        #2c2420;    /* dark sections (contact/footer) */
  --color-deep-light:  #3d3530;    /* footer border */
  --color-card:        #ffffff;    /* card backgrounds */
}
```

### Animation Plan
- **Hero entrance**: Name fades in (0.8s, ease-out, 0.1s delay) → subtitle (0.35s delay) → tagline (0.55s delay). Already implemented; keep.
- **Role-cycling text**: CSS `@keyframes` with `opacity` crossfade. Cycle through 3 phrases: "Product Designer" → "Design Leader" → "Experience Architect". 3s per phrase. Pure CSS, no JS.
- **Scroll fade-in**: IntersectionObserver triggers `.is-visible` class. `opacity 0→1`, `translateY(20px→0)`, `0.6s ease-out`. Already implemented; keep.
- **Staggered children**: Work items animate in sequence with 80ms delay between each. Already implemented; keep.
- **Card hover**: Image area scales to `1.02` with `0.4s ease-out`. Card title shifts color to accent. Already partially implemented.
- **Link underlines**: Expand from left on hover via `width: 0→100%`. Already implemented; keep.
- **No heavy libraries** — all vanilla CSS/JS.

---

## 4. Section-by-Section Plan

### 4.1 — Navigation
**What changes:**
- Wordmark changes from "MJ" to "MinJee Hahm" (full name, more confident, like michellegore.com)
- Links stay: `Work`, `About`, `Contact`
- Add subtle text-transform: uppercase and letter-spacing: 0.08em to nav links
- On scroll: backdrop-filter blur + thin bottom border (already implemented, keep)
- Mobile: hamburger collapse (already implemented, keep)

**What stays:** Sticky position, fixed top, blur on scroll, hamburger mobile menu. All working well.

### 4.2 — Hero Section
**What changes:**
- **Remove** the current single-line subtitle structure
- **Add** small label above name: cycling role text (all-caps, muted) — "PRODUCT DESIGNER" → "DESIGN LEADER" → "EXPERIENCE ARCHITECT"
- **Keep** "MinJee Hahm" as the large display name
- **Replace** subtitle with a confident personal statement headline:
  - Option A: `Designing products that move billions of people.`
  - Option B: `Making complex products feel effortless for billions.`
  - Option C: `Shaping how billions experience technology, one interaction at a time.`
  - **Recommended: Option A** — most concise and confident
- **Add** credential line below headline: `Currently at Meta · Previously Grab, NAVER, SK Planet`
- **Add** `View Work ↓` CTA link that smooth-scrolls to #work section
- **Background**: Clean warm off-white (--color-bg). No image, no pattern. Confident emptiness.

**Copy:**
```
[cycling label] PRODUCT DESIGNER

MinJee Hahm

Designing products that move billions of people.

Currently at Meta · Previously Grab, NAVER, SK Planet

View Work ↓
```

### 4.3 — Company Credential Badges (NEW — below hero)
**New section** inspired by michellegore.com's branded company tags:
- Horizontal row of monochrome company logos/wordmarks: **Meta**, **Grab**, **NAVER**, **SK Planet**, **Cashtree**
- Styled as subtle, muted, evenly spaced — like a "trusted by" strip
- Implementation: SVG text wordmarks (no actual logo files needed — use styled text as placeholders, with `<!-- TODO: Replace with official SVG logos if available -->`)
- Separated from hero by a subtle divider line
- Fade-in on scroll

### 4.4 — Selected Work Section
**What changes — Layout:**
- **Replace** the text-only stacked list with editorial image cards (inspired by amylalai.com)
- Card layout: alternating between **full-width** (wide) and **two-column** (side-by-side) cards
- Each card: image/mockup area (top) + text content area (bottom)
- Image areas use existing `/img/` assets where available; colored placeholder backgrounds where not
- Rounded corners (12px border-radius), subtle box-shadow on hover
- On hover: image area scales up (transform: scale(1.02)), title color shifts to accent

**What changes — Content:**
- Add **Meta** as first project (no public image — use a gradient/colored card background with text overlay + "Case study available on request")
- Add **Grab** as second project (colored card background + descriptive text)
- Keep **BAND** (NAVER) — use `img/ico_band.png` if suitable, or colored background
- Keep **VOLO** (SK Planet) — link to Behance project page
- Keep **Cashtree** — use `img/cashtree.png` as card image; link to Behance
- **Add** Grafolio and Me2day as smaller cards in two-column layout (earlier career)

**Card structure per project:**
```html
<article class="project-card project-card--wide">
  <div class="project-card-image" style="background-color: #...">
    <img src="img/..." alt="..." />  <!-- or gradient placeholder -->
  </div>
  <div class="project-card-content">
    <span class="project-card-label">PRODUCT DESIGN · 2020–PRESENT</span>
    <h3 class="project-card-title">Meta</h3>
    <p class="project-card-desc">Designing product experiences across Meta's family of apps, reaching billions of users worldwide.</p>
    <a href="#" class="project-card-cta">View Project ➞</a>
  </div>
</article>
```

**Project order (by seniority/recency):**
1. **Meta** (wide card) — "Case study available on request" CTA
2. **Grab** (wide card) — external link or "Case study available on request"
3. **BAND / NAVER** (half-width) — with link to Behance if available
4. **Cashtree** (half-width) — with `img/cashtree.png`, link to Behance
5. **VOLO / SK Planet** (half-width) — link to Behance
6. **Grafolio** (half-width) — with `img/grafolio.jpg`, smaller card

### 4.5 — About Section
**What changes:**
- **Remove** the Keats quote entirely (`"Nothing ever becomes real till it is experienced."`)
- **Keep** the three existing bio paragraphs — they are well-written and first-person
- **Replace** skills-grid list with a more refined presentation:
  - Remove the bulleted list format
  - Use a simple inline list or comma-separated disciplines with subtle styling
- **Add** a row of monochrome company logos below the bio (Meta, Grab, NAVER, SK Planet) — consistent sizing, muted opacity
- **Add** a `Download Resume` link (placeholder href for now)

**Copy stays (from current site):**
> I'm MinJee — a product designer with 14+ years of experience building digital products used by millions. I've designed social networks at NAVER, led the rebrand of Indonesia's top reward app, shaped ride-hailing experiences at Grab, and now design for Meta's global platforms.
>
> I'm drawn to the challenge of making complex systems feel simple and human. Whether it's a social feed, a payment flow, or a driver dispatch screen — I believe the best design disappears into the experience.
>
> Originally from South Korea, I've worked across Seoul, Jakarta, Singapore, and now the Bay Area — each place shaping how I think about design for diverse, global audiences.

### 4.6 — Contact / Footer
**What changes:**
- **Restructure** footer into 3-column layout (inspired by amylalai.com):
  - **Column 1 — NAVIGATION**: Work, About, Resume
  - **Column 2 — LET'S CHAT**: Email (minjeehahm@gmail.com), LinkedIn (linkedin.com/in/minjeehahm)
  - **Column 3 — FIND ME**: Behance (behance.net/VeronicaHaha)
- **Add** warm closing line above columns: `Let's build something great together.`
- **Keep** dark background treatment (--color-deep)
- **Bottom bar**: `© 2026 MinJee Hahm · Designed & developed by MinJee Hahm`
- **Remove** separate Contact section — merge into footer (cleaner, less repetitive)

---

## 5. Implementation Sequence

### Phase 1 — CSS Foundation
1. Update CSS custom properties (larger hero type scale, card styles)
2. Add new component classes: `.project-card`, `.project-card--wide`, `.project-card--half`, `.project-card-image`, `.project-card-content`, etc.
3. Add role-cycling animation keyframes
4. Add company badges row styles
5. Add 3-column footer layout styles
6. Update responsive breakpoints for new card grid

### Phase 2 — HTML Structure
7. Update hero: add cycling role label, new headline copy, credential line, View Work CTA
8. Add company badges section below hero
9. Replace work-list with project-card grid (alternating wide/half layouts)
10. Update About: remove Keats quote, add company logo row, add Resume link
11. Restructure footer into 3-column layout with closing line
12. Remove separate Contact section (merged into footer)

### Phase 3 — JavaScript
13. Add role-cycling logic (CSS-only if possible, minimal JS fallback)
14. Update IntersectionObserver to handle new card elements
15. Add smooth-scroll for "View Work ↓" CTA
16. Update footer year logic (already works)

### Phase 4 — Polish
17. Responsive testing at 375px, 768px, 1440px
18. Hover state refinement on project cards
19. Accessibility audit (contrast, focus states, screen reader)
20. Final content review — ensure no outdated content remains

---

## 6. Case Study: Instagram Creator Marketplace (COMPLETED)

### Files
- `case-study-meta.html` — Full case study page
- `css/case-study.css` — Case study stylesheet

### Section Structure
1. **Hero** — Label, title, subtitle, key results (3 metrics with Instagram gradient + scroll animation), prototype video, meta labels (Role, Company, Duration, Feature Launch link)
2. **Challenge** — "From Directory to Matchmaker" with data points (77% no-match rate, 1.5-month sourcing time). Interactive problem cards (Limited UX / Manual Creator Sourcing) that swap the image below with fade+scale transition.
3. **Strategy & Role** — "The Strategic Pivot" with bubble visualization of responsibilities and caption describing specific contributions
4. **Process** — "From Brainstorm to Signal" combining brainstorming (FigJam) and ML signal identification into one section. 6 signal cards: Ad Conversion History, Partnership Track Record, Mentioned or Tagged Brand, Worked with Similar Brands, Affiliate Content, Audience Engagement
5. **Design** — "Creator Card Explorations" showing design iterations
6. **Solution** — "From Manual Search to Intelligent Matching" with 3 design principles + Before/After comparison (UX-focused bullet points)
7. **Impact** — "Generating New Revenue Streams & Partnerships" with metric-driven cards (+30%, +25%, +20%), brand logos (TEMU, SHEIN, Amazon), and Alpha test quote (100% of partners validated the product)
8. **Reflections** — "What I Learned" with 3 cards: Recommendations Alone Aren't Enough, Ad Performance ≠ Content Quality, Defining Strategy Is a Design Skill
9. **Back to Top** — Floating button appears when Reflections or Footer enters viewport

### Design Decisions
- Instagram gradient: `linear-gradient(45deg, #FF5C00 0%, #FF0169 30%, #D300C5 70%)` — used on metric numbers and problem icons
- All content left-aligned, consistent container gutters
- Section padding standardized to `var(--space-2xl)` (3rem)
- Fonts: Cormorant Garamond (headings) + DM Sans (body)
- Dark sections: Strategy & Role, Impact (dark purple background)
- Alt sections: Challenge, Design (light gray #f7f7f8 background)
- Interactive challenge cards with image swap, fade+scale transition (350ms)
- Scroll-triggered metric animation with staggered delays
- Signal cards: white background, 16px border-radius, reduced padding
- Impact cards: no card styling (removed bg/border/shadow)
- Brand logos: 16x16px, 40px border-radius (circular), inline with labels
- Reflection cards: concise text (max ~6 lines)

### Key Content
- Role: "Product Strategy + MVP Execution"
- Duration: Aug 2023 — Jan 2024
- Feature Launch: https://about.fb.com/news/2024/02/creator-marketplace-for-brands-and-creators-to-collaborate-on-instagram/
- Key Results: +30% Brand-Creator Matches, +25% Engagement Rates, +20% User Satisfaction
- Challenge data: 77% searches = no match, 1.5 months agency sourcing time
- Alpha test: 10 brands, 100% said recommendations would increase value

---

## 7. Open Questions (Resolved)

1. **Meta project details** — Resolved: Case study is specific to Instagram Creator Marketplace
2. **Case study pages** — Resolved: `case-study-meta.html` created and linked from homepage
3. **Hero headline** — Resolved: "Defining new ways to express and connect — for billions of people."
4. **Accent color** — Uses Instagram gradient for case study accents
5. **Resume PDF** — Still placeholder
6. **Photo** — Not added yet
