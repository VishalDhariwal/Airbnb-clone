# DESIGN_SYSTEM.md — the visual contract

> **Read this before writing a single line of CSS.** Every colour, radius, font size and
> spacing value in this project comes from this file. If you need a value that isn't here,
> stop and ask — don't invent one.
>
> This was derived from Airbnb's live site (airbnb.co.in, Sept 2026) plus the reference
> screenshots in `/references`. Where this file and a screenshot disagree, **the screenshot wins** —
> tell the human so this file can be corrected.

---

## 1. Why we have this file

Ten different agents styling ten different components will produce ten slightly different
greys, five different border radii and a shadow soup. The result reads as "generic listings
app", which is exactly the failure mode the assignment calls out. A single token file means
the pages look like they were built by one person on one day.

Airbnb's own system is unusually disciplined and that discipline is the thing we're copying:
**one accent colour, one shadow, one font family, near-black instead of black, everything rounded.**
About 90% of any Airbnb page is white + `#222222` text. The coral is rare and it always means
"this is the primary action."

---

## 2. Colour tokens

| Token | Hex | Where it's used |
|---|---|---|
| `--rausch` | `#FF385C` | THE brand colour. Search orb, Reserve/Continue buttons, filled heart, logo. **Nothing else.** |
| `--rausch-active` | `#E00B41` | Pressed state of a Rausch button only |
| `--rausch-disabled` | `#FFD1DA` | Disabled primary CTA fill (white text stays) |
| `--ink` | `#222222` | Almost all text: headings, body, nav labels, **star rating numbers and the star glyph** |
| `--body-text` | `#3F3F3F` | Long-form running copy (listing description, review bodies) where ink is too heavy |
| `--muted` | `#6A6A6A` | Card meta lines, sub-labels, inactive nav tabs, "View all" links |
| `--muted-soft` | `#929292` | Disabled text. Rare. |
| `--hairline` | `#DDDDDD` | The default 1px border: search bar dividers, card borders, footer splitters |
| `--hairline-soft` | `#EBEBEB` | Lighter divider for long section separators on the listing page |
| `--border-strong` | `#C1C1C1` | Heavier stroke: outline buttons, input outlines |
| `--canvas` | `#FFFFFF` | Page background. Everywhere. There is no dark mode on Airbnb web. |
| `--surface-soft` | `#F7F7F7` | Disabled fields, hover backgrounds, date-range lozenge fill |
| `--surface-strong` | `#F2F2F2` | Circular icon-button background (back arrow, share/save buttons) |
| `--error` | `#C13515` | Inline form validation text. Note: this is **not** Rausch. |
| `--error-hover` | `#B32505` | Error link hover |
| `--on-primary` | `#FFFFFF` | Text on a Rausch fill |
| `--scrim` | `rgba(0,0,0,0.5)` | Modal backdrop (login modal, photo gallery, filters) |

**Two rules that will be checked in review:**
1. Stars and rating numbers render in `--ink`, **never gold/yellow**. This is deliberate on
   Airbnb's part and it's one of the most recognisable details. Getting this wrong instantly
   reads as "not Airbnb."
2. Text is `#222222`, never `#000000`.

Do **not** use `#460479` (Luxe purple) or `#92174D` (Plus magenta). They exist in Airbnb's
system but only inside sub-brands we aren't building.

---

## 3. Typography

Airbnb licenses **Airbnb Cereal VF**. We can't use it. Use **Inter** (variable, via
`next/font/google`) as the substitute — it's the closest open-source match. Set the stack:

```css
--font-sans: 'Inter', -apple-system, system-ui, Roboto, 'Helvetica Neue', sans-serif;
```

One family for everything. No serif, no display face, no monospace.

| Role | Size | Weight | Line-height | Letter-spacing | Used for |
|---|---|---|---|---|---|
| `rating-display` | 64px | 700 | 1.1 | -1px | The huge "4.81" on the listing detail page |
| `display-xl` | 28px | 700 | 1.43 | 0 | Homepage carousel section heads ("Popular homes in Noida") |
| `display-lg` | 22px | 500 | 1.18 | -0.44px | Listing detail page `h1` |
| `display-md` | 21px | 700 | 1.43 | 0 | Listing detail section heads ("What this place offers") |
| `display-sm` | 20px | 600 | 1.2 | -0.18px | Sub-section titles ("Things to know") |
| `title-md` | 16px | 600 | 1.25 | 0 | Card titles ("Flat in Sector 63"), city block titles |
| `title-sm` | 16px | 500 | 1.25 | 0 | Footer column headings |
| `body-md` | 16px | 400 | 1.5 | 0 | Listing description, review body |
| `body-sm` | 14px | 400 | 1.43 | 0 | Card meta line, prices, dates, distances |
| `caption` | 14px | 500 | 1.29 | 0 | Search bar segment labels ("Where", "When", "Who") |
| `caption-sm` | 13px | 400 | 1.23 | 0 | Footer legal line |
| `badge` | 11px | 600 | 1.18 | 0 | "Guest favourite" pill |
| `micro-label` | 12px | 700 | 1.33 | 0 | Tiny card labels |
| `button-md` | 16px | 500 | 1.25 | 0 | Primary CTA labels |
| `button-sm` | 14px | 500 | 1.29 | 0 | Pill / filter button labels |
| `nav-link` | 16px | 600 | 1.25 | 0 | Top nav product tabs |

**The counter-intuitive bit:** display type is *small*. The homepage section head is 28px.
The listing page `h1` is 22px at weight **500** — lighter than you'd expect. Airbnb lets
photography carry the visual weight, not type. If a heading looks big and bold, it's wrong.

The single loud typographic moment in the whole product is the 64px rating number on the
listing page. That's it. Don't add a second one.

---

## 4. Radius

| Token | Value | Applied to |
|---|---|---|
| `--r-xs` | 4px | Tiny chips |
| `--r-sm` | 8px | Buttons, text inputs, modals' inner elements |
| `--r-md` | 14px | **Property card photos**, host card, reservation card, modals |
| `--r-lg` | 20px | Larger surfaces |
| `--r-xl` | 32px | Category strip container |
| `--r-full` | 9999px | Search bar, search orb, heart button, "Guest favourite" pill, date-picker day cells, filter pills |

There is effectively **no square corner** in this UI except the page grid itself.

---

## 5. Spacing

4px base, 2px micro-step.

`2 · 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`

- Gap between cards in a grid or carousel: **16px** horizontal, **24px** vertical
- Card meta block internal gap: **4px** between lines, **12px** below the photo
- Padding inside host card / reservation card: **24px**
- Major vertical section spacing on homepage: **48–64px**
- Page horizontal padding: **80px** desktop, **40px** tablet, **24px** mobile

The homepage feels "open hero, dense grid below." Big breathing room between sections,
tight gaps between cards. Don't spread the cards out.

---

## 6. Elevation — there is exactly ONE shadow

```css
--shadow-card:
  rgba(0,0,0,0.02) 0 0 0 1px,
  rgba(0,0,0,0.04) 0 2px 6px 0,
  rgba(0,0,0,0.10) 0 4px 8px 0;
```

Used on: the expanded search bar, dropdown menus (account menu, language picker),
the "Guest favourite" badge floating over a photo, the reservation card, modals,
and cards on hover.

**Everything else is flat.** No `shadow-sm/md/lg/xl` ladder. If you find yourself adding a
second shadow value, you're drifting from the design.

Depth in this UI comes from photography, rounded-corner clipping and white-on-white
surface separation — not from layered shadows.

---

## 7. Component specs

These are the components the whole app is built from. Build each one **once**, in
`components/ui/` or `components/listing/`, and import it everywhere.

### 7.1 `<TopNav>` — height 80px, white, 1px bottom hairline

Three zones:
- **Left:** Airbnb wordmark in Rausch (logo mark + "airbnb" text). Links to `/`.
- **Centre:** four product tabs — **All · Homes · Experiences · Services**. Each is a
  32px illustrated icon above/beside a `nav-link` label. Active tab gets a **2px `--ink`
  underline** below the icon+label pair. Inactive labels are `--ink` too (not muted) in the
  live site, with the underline being the only active signal.
- **Right:** "Become a host" text link → globe icon in a circular hover target → hamburger
  in a 40px circle with `--surface-strong` background.

For the icons: Airbnb uses hand-illustrated 3D renders. **Do not attempt to copy their
artwork.** Use `lucide-react` glyphs (`Globe`, `House`, `Sparkles`, `ConciergeBell`) at 24–32px,
or simple emoji if the human approves. Note this substitution in the README.

**Scroll behaviour (see `/references/02-home-scrolled-compact-search.png`):**
On the homepage, when `scrollY > ~50px`, the big search bar collapses into a small pill that
sits **inside the navbar centre**, replacing the product tabs. The compact pill shows
`Anywhere | Anytime | Add guests` + a small Rausch orb. Clicking it re-expands the full bar.
Implement with a scroll listener + a CSS transition on height/opacity.

### 7.2 `<SearchBar>` — the signature element

Expanded state: white pill, `--r-full`, **64px tall**, `--shadow-card`, 1px hairline border.
Max width around 850px, centred.

Divided by vertical 1px hairlines into segments. Each segment has a `caption` label above a
`body-sm` muted placeholder, padded `14px 24px`:

| Tab | Segments |
|---|---|
| Homes / All | `Where — Search destinations` · `When — Add dates` · `Who — Add guests` |
| Services | `Where — Search destinations` · `When — Add dates` · `Type of service — Add service` |

Terminated by a **48×48px circular Rausch orb** with a white magnifying glass. On the live
site the orb widens into a pill with the word "Search" when a segment is active — implement
that if time allows, it's a nice detail.

**Behaviour:** clicking a segment gives it a white raised background (the rest of the bar
goes `--surface-soft`) and opens a dropdown panel below:
- **Where** → destination suggestion list with small thumbnail icons
- **When** → 2-month side-by-side calendar
- **Who** → guest steppers (Adults / Children / Infants / Pets) with `−` and `+` circular buttons

### 7.3 `<PropertyCard>` — get this exactly right, it appears ~50 times per page

Read `/references/01-home-desktop-hero.png` closely.

```
┌─────────────────────────┐
│ [Guest favourite]    ♡  │  ← badge top-left, heart top-right, both over photo
│                         │
│      photo, 1:1         │  ← --r-md corner clipping
│                         │
│           • • ○ •       │  ← carousel dots, bottom-centre, only on hover
└─────────────────────────┘
  Flat in Sector 63              ← title-md, --ink, truncate to 1 line
  ₹7,400 for 2 nights · ★ 5.0    ← body-sm, --muted for price, ★ + number in --ink
```

Critical details people get wrong:
- Photo is **1:1 square**, not 4:3 or 16:9.
- **No card border, no card shadow, no card background.** The card is just a photo on white
  with text underneath. Adding a bordered box is the single most common tell of a fake clone.
- The price is a **trip total for the selected date range** — "₹7,400 for 2 nights" — not
  "₹3,700/night". When no dates are selected, default to a 2-night total. Show a small
  "Prices include all fees" tooltip pill (see reference screenshot 1) somewhere on the grid.
- Star glyph is a small filled `★` in `--ink`, immediately followed by the number with no
  space before it, separated from the price by ` · `.
- The heart is a white-outlined heart with a semi-transparent dark fill when unsaved;
  solid Rausch when saved. 32px circular hit target.
- "Guest favourite" is a **white pill** with `--shadow-card`, 11px/600, sitting `12px` from
  the top-left of the photo. Only shown when the listing has the flag.
- Hover: photo scales very slightly / the shadow appears. Keep it subtle.

### 7.4 `<Carousel>` — homepage row

Section head in `display-xl` with a small circular `→` button right after the text.
Prev/next circular arrow buttons float at the **top-right** of the row, aligned with the
heading baseline. Prev is disabled (greyed) at position 0. Horizontal scroll with
`scroll-snap-type: x mandatory`. Six cards visible at 1440px.

### 7.5 Buttons

| Variant | Fill | Text | Border | Radius | Padding | Height |
|---|---|---|---|---|---|---|
| Primary | `--rausch` | white | none | `--r-sm` | 14px 24px | 48px |
| Primary (pressed) | `--rausch-active` | white | none | — | — | — |
| Primary (disabled) | `--rausch-disabled` | white | none | — | — | `cursor: not-allowed` |
| Secondary | white | `--ink` | 1px `--ink` | `--r-sm` | 13px 23px | 48px |
| Tertiary | transparent | `--ink` | none | — | — | underline on hover |
| Pill | `--rausch` | white | none | `--r-full` | 10px 20px | — |
| Icon circle | `--surface-strong` | `--ink` | none | `--r-full` | — | 32–40px |

The big "Reserve" button on the listing page uses Primary at **full width** of the
reservation card.

### 7.6 `<DatePicker>`

Two months side by side, desktop. Day cells are **40×40px circles**, `body-sm`.
- Default: transparent fill, `--ink` text
- Unavailable: `--muted-soft` text with a strikethrough line, not clickable
- Selected endpoints: `--ink` fill, white text, full circle
- Range between endpoints: `--surface-soft` lozenge connecting them
- Hover on a valid day while selecting: 1px `--ink` ring

Month header shows "September 2026" with `‹ ›` arrows. Weekday initials row above.

### 7.7 `<Modal>`

Centred white card, `--r-md`, `--shadow-card`, backdrop `--scrim`.
Header row: `✕` close button (circular, 32px, left-aligned on Airbnb's login modal) with a
centred title in `title-md`, then a 1px hairline below.
Body scrolls; the header stays pinned.

Login modal specifically (see `/references/07-login-modal.png`): ~570px wide, Airbnb logo
mark centred, "Log in or sign up" heading, one text input, full-width Rausch "Continue",
an `or` divider with hairlines either side, then Google/Apple square outline buttons.

### 7.8 `<Toast>`

Bottom-left on desktop, `--ink` fill, white text, `--r-sm`, auto-dismiss ~4s. Used for
"Saved to wishlist", "Listing published", "Booking confirmed", "Listing deleted".
Use `sonner` or `react-hot-toast` styled to match — don't build one from scratch.

### 7.9 Account menu dropdown

See `/references/08-hamburger-menu.png`. White panel, `--r-md`, `--shadow-card`, ~320px wide,
anchored under the hamburger. Rows at 16px, `--ink`, hover `--surface-soft`. Hairline
dividers between groups. Our version:
`Help Centre` — divider — `Become a host` (with sub-line) — divider — `My trips`, `Wishlists` — divider — `Log in or sign up` / `Log out`.

---

## 8. Breakpoints

| Name | Width | Property card columns | Notes |
|---|---|---|---|
| Mobile | < 744px | 1 | Nav → logo + hamburger. Search bar → single tappable pill opening a full-screen overlay. Reservation card → sticky bottom bar. |
| Tablet | 744–1128px | 2–3 | Product tabs stay, search bar narrows |
| Desktop | 1128–1440px | 4 (grid) / 6 (carousel) | Full layout |
| Wide | > 1440px | 4–6 | Content caps at 1440px, gutters absorb the rest |

Grids **reduce column count** at each breakpoint — they never reflow into a different
layout shape.

---

## 9. Copy voice

Sentence case everywhere. No ALL-CAPS labels except the tiny "NEW" badge.
Buttons say what happens: "Reserve", "Confirm and pay", "Save", "Publish listing".
The action keeps its name through the flow — the button that says "Publish listing" produces
a toast that says "Listing published."

Empty states are invitations, not apologies: "No trips yet — time to dust off your bags"
with a "Start searching" button, matching Airbnb's own tone.

---

## 10. Tailwind config starter

```js
// tailwind.config.ts — theme.extend
colors: {
  rausch: { DEFAULT: '#FF385C', active: '#E00B41', disabled: '#FFD1DA' },
  ink: '#222222',
  bodytext: '#3F3F3F',
  muted: { DEFAULT: '#6A6A6A', soft: '#929292' },
  hairline: { DEFAULT: '#DDDDDD', soft: '#EBEBEB', strong: '#C1C1C1' },
  surface: { soft: '#F7F7F7', strong: '#F2F2F2' },
  danger: { DEFAULT: '#C13515', hover: '#B32505' },
},
borderRadius: { xs: '4px', sm: '8px', md: '14px', lg: '20px', xl: '32px' },
boxShadow: {
  card: 'rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0, rgba(0,0,0,0.10) 0 4px 8px 0',
},
fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'] },
```

Set the type scale as explicit utility classes (`.t-display-xl`, `.t-body-sm`, …) in
`globals.css` rather than sprinkling `text-[22px] font-medium tracking-[-0.44px]` through
components. One place to change, and it keeps JSX readable.
