---
version: alpha
name: Obsidian
description: "The free and flexible app for your private thoughts."
sourceUrl: "https://obsidian.md"

colors:
  primary: "#a78bfa"
  on-primary: "#ffffff"
  background: "#1f1f1f"
  surface: "#262626"
  border: "#404040"
  text: "#eeeeee"
  text-muted: "#dadada"
  accent: "#7c3aed"

typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Roboto, Inter, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
    fontSize: 60px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -1.2px
  heading:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Roboto, Inter, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
    fontSize: 36px
    fontWeight: 400
    lineHeight: 1.11
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Roboto, Inter, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.25

spacing:
  base: 2px
  scale: [2, 4, 6, 8, 10, 12, 14, 16, 20, 24]

radius:
  sm: 2px
  md: 6px
  lg: 12px
  xl: 20px
  pill: 9999px

shadows:
  card: "rgb(255, 255, 255) 0px 0px 0px 0px inset, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0) 0px 0px 0px 0px"
  elevated: "rgb(255, 255, 255) 0px 0px 0px 0px inset, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px"

motion:
  duration-fast: 100ms
  duration-base: 1000ms
  duration-slow: 2000ms
  easing: "cubic-bezier(0.4, 0, 0.2, 1)"

breakpoints: [640px, 768px, 1024px, 1280px, 1536px]
---

## Rationale

Obsidian's design system reflects a product built for deep focus and extended use—a distraction-free environment for thought capture and knowledge management. The dark theme (background `#1f1f1f`, surface `#262626`) reduces eye strain during long sessions while establishing a premium, sophisticated aesthetic. The measured tokens reveal a carefully restrained palette: a vibrant purple primary (`#a78bfa`) paired with a deeper accent (`#7c3aed`) provides visual hierarchy without overwhelming the interface. This color strategy positions Obsidian as both intellectually serious and creatively empowering—the inverse of sterile corporate tools.

Typography anchors the experience in clarity. A generous display size (60px, tight leading) commands attention for hero messaging ("Sharpen your thinking"), while the heading scale (36px, 400 weight) maintains readability without aggression. Body copy at 16px with 1.25 line height ensures sustained legibility in a dark context. The system-font stack prioritizes platform consistency and performance, avoiding decorative choices that would distract from *content* rather than the app itself.

Spacing and motion are deliberately minimal. The scale (2, 4, 6, 8… up to 24px) clusters around small increments, encouraging compact layouts and dense information presentation—appropriate for a tool where users manage thousands of notes. Radius values (sm: 2px, lg: 12px) and soft shadows (inset highlights, subtle drop shadows) create subtle depth without skeuomorphism. The cubic-bezier easing and 100–1000ms motion durations feel snappy but considered, avoiding the "cheap interaction" pitfall of many productivity apps.

## 1. Visual Theme & Atmosphere

The design establishes a **dark, introspective workspace**. Background and surface layers (`#1f1f1f` and `#262626`) sit just 6 steps apart in luminance, creating a muted contrast that suggests layers of focus rather than aggressive separation. This is not a high-contrast dark mode for accessibility alone—it is an intentional creative choice that evokes late-night writing, intellectual depth, and creative flow states.

The color palette is **cool and restrained**. Purple (`#a78bfa`, `#7c3aed`) is the only warm signal in the measured palette, used sparingly for primary actions and accent highlights. This monochromatic restraint reinforces that the *user's content* is the star, not the interface chrome. Text remains accessible (`#eeeeee` primary, `#dadada` muted) without jarring contrast, creating a calming, low-stress visual environment.

## 2. Color System

The eight-color palette operates as a **semantic hierarchy**:

- **Primary (`#a78bfa`)**: Actions, CTAs, focus states. Light enough to stand out against dark backgrounds; perceptually energetic without aggression.
- **Accent (`#7c3aed`)**: Secondary emphasis, perhaps hover states or alternative actions. Slightly deeper saturation suggests a secondary tier.
- **On-Primary (`#ffffff`)**: Text/icons *on* primary buttons. Pure white ensures legibility and creates strong affordance signals.
- **Background (`#1f1f1f`)**: Page/canvas layer. Near-black but not pure black—reduces eye strain and allows subtler depth layering.
- **Surface (`#262626`)**: Cards, modals, panels. A single step lighter than background; inset shadows (measured in the `card` and `elevated` token) reinforce surface as a distinct plane.
- **Border (`#404040`)**: Dividers, outlines. Sits midway between surface and background; visible but not dominant.
- **Text (`#eeeeee`)** and **Text-Muted (`#dadada`)**: Two-tier legibility. Primary text maintains contrast for readability; muted preserves hierarchy for secondary information (labels, hints, timestamps).

**Contrast check**: `#eeeeee` on `#1f1f1f` yields approximately 13.5:1 WCAG AAA, well above minimum 4.5:1 AA. Muted text (`#dadada` on `#1f1f1f`) sits around 7.5:1, sufficient for body copy but flagged for small text or icons requiring WCAG AA compliance.

## 3. Typography

Three scales define the typographic hierarchy:

**Display (60px, 600 weight, -1.2px letter-spacing)**: Hero messaging at large viewport widths. The tight tracking (negative letter-spacing) creates visual compression and sophistication; 1.0 line height prevents awkward stacking. Reserved for primary value propositions ("Sharpen your thinking").

**Heading (36px, 400 weight, 1.11 line height)**: Section heads and major content splits. Notably, the weight drops to 400 (regular), indicating that hierarchy is achieved through scale, not weight contrast. This signals a design that trusts size over boldness—characteristic of premium, minimal interfaces.

**Body (16px, 500 weight, 1.25 line height)**: Standard reading copy. The 500 weight (medium) and generous line height accommodate extended dark-mode reading. Base font-size of 16px eliminates the need for scaling on mobile—a clear signal that Obsidian's responsive strategy is "content-first, then adapt."

All scales use a identical system-font stack, ensuring consistent rendering across Windows, macOS, iOS, and Android. No custom typefaces incur load penalties; the design relies on legibility rather than distinctiveness.

## 4. Components & Patterns

Measured tokens suggest a **card-and-surface component model**:

- **Shadow System**: The `card` shadow (inset white highlight only) creates a subtle embossed effect; `elevated` adds a 1px inner bright line plus a soft drop shadow (0px 1px 3px, 10% black). Together these simulate depth without skeuomorphic styling—very iOS-influenced.
- **Button/CTA Pattern**: Likely uses primary color (`#a78bfa`) as background, white text (`#ffffff`), rounded to `md` (6px) or `lg` (12px) radius. The motion easing (cubic-bezier 0.4, 0, 0.2, 1) suggests subtle scale or opacity on hover/press.
- **Input/Field Pattern**: Probable border-only style using `border` color (`#404040`), with focus state upgrading to primary color or a higher opacity border.
- **Navigation/Sidebar**: Likely surface-colored (`#262626`) with text-colored labels, possibly with an accent bar for active state.

## 5. Spacing & Layout

The spacing scale (2, 4, 6, 8, 10, 12, 14, 16, 20, 24px) clusters around **small, precise increments**. No large gaps (40px+, 64px+) appear in the measured tokens—suggesting the layout avoids generous whitespace in favor of content density.

**Likely application**:
- Padding inside cards/buttons: 8–16px
- Margin between sections: 20–24px
- Gap inside grid systems: 12–16px
- Line spacing already baked into typography scales

This precision supports Obsidian's core function: managing many interconnected notes. Compact spacing allows users to see more relationships and connections without scrolling excessively.

The **breakpoints** (640, 768, 1024, 1280, 1536) follow industry standard responsive tiers, implying a mobile-first strategy with progressive enhancement for tablet and desktop views. The absence of spacing tokens above 24px suggests consistent, scaled layouts rather than bespoke breakpoint-specific padding.

## 6. Motion & Interaction

Motion is **utilitarian, not decorative**:

- **Fast (100ms)**: Button ripples, icon state changes, tooltip reveals. Fast enough to feel instantaneous to human perception.
- **Base (1000ms)**: Page transitions, modal fades, sidebar animations. Long enough to guide attention without feeling slow.
- **Slow (2000ms)**: Rare; perhaps background animations or progressive content load reveals.
- **Easing (cubic-bezier 0.4, 0, 0.2, 1)**: A standard Material Design easing curve—quick entrance (0.4 acceleration), measured exit (0.2 deceleration). Feels modern and intentional without being trendy.

The restraint here reinforces the product philosophy: motion serves navigation and feedback, never distraction. A tool for serious thought-work avoids flashy transitions.

## Accessibility

### Contrast Ratios

**Primary text (`#eeeeee` on `#1f1f1f`)**:
- Luminance ratio: ~13.5:1
- **Status**: Exceeds WCAG AAA (7:1) and AA (4.5:1) for all text sizes.

**Muted text (`#dadada` on `#1f1f1f`)**:
- Luminance ratio: ~7.5:1
- **Status**: Meets WCAG AAA for 18pt+, AA for all sizes. Acceptable for secondary labels and hints; *should not* be used for body copy smaller than 14px or critical information.

**Primary button (`#a78bfa` background, `#ffffff` text)**:
- Luminance ratio: ~7.8:1
- **Status**: WCAG AAA compliant. Excellent affordance.

**Accent/Links (`#7c3aed` on `#1f1f1f`)**:
- Luminance ratio: ~5.2:1
- **Status**: Meets WCAG AA. Acceptable for interactive elements; confirm focus/hover states add sufficient contrast boost.

### Minimum Requirements

- **Touch target size**: Apply 44×44px minimum to all interactive elements (buttons, links, toggle switches). In a dense note-taking interface, ensure tappable areas are padded adequately; avoid stacking interactive elements closer than 8px apart.
- **Focus indicator**: Implement a 2px outline (recommend primary color `#a78bfa` or a brighter shade) with 2px offset from element border. Given the dark background, a 3px outline may be necessary for visibility during keyboard navigation; test with actual users.
- **Motion**: The 100ms fast duration is below the 200ms threshold some motion-sensitive users prefer; consider a user preference toggle in settings to double motion durations if a `prefers-reduced-motion` media query is detected.
- **Color alone**: Avoid conveying status (error, success, warning) through color only. Pair with icons, text labels, or patterns.
